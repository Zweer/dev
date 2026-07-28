#!/bin/bash
# =============================================================================
# gh-multi-account-setup.sh
#
# Configures per-directory GitHub account switching using:
# - direnv for GH_CONFIG_DIR in shells
# - git includeIf + credential helper wrappers for git push/pull (any IDE)
#
# Usage:
#   ./gh-multi-account-setup.sh up     # Install everything
#   ./gh-multi-account-setup.sh down   # Remove everything
#   ./gh-multi-account-setup.sh status # Check current state
# =============================================================================

set -euo pipefail

# === Configuration ===
WORK_ACCOUNT="NiccoloOlivieriAchille"
PERSONAL_ACCOUNT="Zweer"

WORK_DIR="$HOME/projects/bepower"
PERSONAL_DIR="$HOME/projects/mine"

GH_CONFIG_WORK="$HOME/.config/gh-work"
GH_CONFIG_PERSONAL="$HOME/.config/gh-personal"

CREDENTIAL_WORK="$HOME/.local/bin/gh-credential-work"
CREDENTIAL_PERSONAL="$HOME/.local/bin/gh-credential-personal"

GITCONFIG_WORK="$HOME/.gitconfig-work"
GITCONFIG_PERSONAL="$HOME/.gitconfig-mine"  # Already exists, we'll update it

BASHRC="$HOME/.bashrc"
DIRENV_HOOK_MARKER="# >>> gh-multi-account direnv hook >>>"
DIRENV_HOOK_MARKER_END="# <<< gh-multi-account direnv hook <<<"

# === Colors ===
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# === Backup helper ===
backup_file() {
  local file="$1"
  if [[ -f "$file" ]]; then
    cp "$file" "${file}.bak.$(date +%Y%m%d%H%M%S)"
    info "Backed up $file"
  fi
}

# =============================================================================
# UP
# =============================================================================
do_up() {
  echo ""
  echo "=========================================="
  echo " gh multi-account setup"
  echo "=========================================="
  echo ""
  echo " Work account:     $WORK_ACCOUNT"
  echo " Personal account: $PERSONAL_ACCOUNT"
  echo " Work dir:         $WORK_DIR"
  echo " Personal dir:     $PERSONAL_DIR"
  echo ""

  # --- Step 1: Install direnv ---
  info "Step 1: Installing direnv..."
  if command -v direnv &>/dev/null; then
    ok "direnv already installed"
  else
    if command -v apt &>/dev/null; then
      sudo apt install -y direnv
    elif command -v dnf &>/dev/null; then
      sudo dnf install -y direnv
    elif command -v pacman &>/dev/null; then
      sudo pacman -S --noconfirm direnv
    elif command -v brew &>/dev/null; then
      brew install direnv
    else
      error "Cannot detect package manager. Install direnv manually: https://direnv.net/docs/installation.html"
      exit 1
    fi
    ok "direnv installed"
  fi

  # --- Step 2: Hook direnv into bash ---
  info "Step 2: Hooking direnv into bashrc..."
  if grep -qF "$DIRENV_HOOK_MARKER" "$BASHRC" 2>/dev/null; then
    ok "direnv hook already in .bashrc"
  else
    backup_file "$BASHRC"
    cat >> "$BASHRC" << EOF

$DIRENV_HOOK_MARKER
eval "\$(direnv hook bash)"
$DIRENV_HOOK_MARKER_END
EOF
    ok "direnv hook added to .bashrc"
  fi

  # --- Step 3: Create separate gh config directories ---
  info "Step 3: Creating gh config directories..."

  GH_CONFIG_EXISTING="$HOME/.config/gh"

  # Check if we can extract tokens from existing config
  if [[ -f "$GH_CONFIG_EXISTING/hosts.yml" ]]; then
    WORK_TOKEN=$(grep -A1 "$WORK_ACCOUNT" "$GH_CONFIG_EXISTING/hosts.yml" | grep "oauth_token" | awk '{print $2}')
    PERSONAL_TOKEN=$(grep -A1 "$PERSONAL_ACCOUNT" "$GH_CONFIG_EXISTING/hosts.yml" | grep "oauth_token" | awk '{print $2}')
  else
    WORK_TOKEN=""
    PERSONAL_TOKEN=""
  fi

  # Work config
  if [[ -d "$GH_CONFIG_WORK" ]] && [[ -f "$GH_CONFIG_WORK/hosts.yml" ]]; then
    ok "gh-work config already exists"
  else
    mkdir -p "$GH_CONFIG_WORK"
    if [[ -n "$WORK_TOKEN" ]]; then
      cat > "$GH_CONFIG_WORK/hosts.yml" << EOF
github.com:
    users:
        $WORK_ACCOUNT:
            oauth_token: $WORK_TOKEN
    git_protocol: https
    user: $WORK_ACCOUNT
    oauth_token: $WORK_TOKEN
EOF
      ok "Work account configured from existing token (no re-auth needed)"
    else
      info "No existing token found for $WORK_ACCOUNT. Opening browser for login..."
      echo ""
      echo "  Log in with your WORK account ($WORK_ACCOUNT)."
      echo "  Scopes: repo, read:org, gist, read:packages, workflow"
      echo ""
      GH_CONFIG_DIR="$GH_CONFIG_WORK" gh auth login --hostname github.com --git-protocol https --web --scopes "repo,read:org,gist,read:packages,workflow"
      ok "Work account configured in $GH_CONFIG_WORK"
    fi
  fi

  # Personal config
  if [[ -d "$GH_CONFIG_PERSONAL" ]] && [[ -f "$GH_CONFIG_PERSONAL/hosts.yml" ]]; then
    ok "gh-personal config already exists"
  else
    mkdir -p "$GH_CONFIG_PERSONAL"
    if [[ -n "$PERSONAL_TOKEN" ]]; then
      cat > "$GH_CONFIG_PERSONAL/hosts.yml" << EOF
github.com:
    users:
        $PERSONAL_ACCOUNT:
            oauth_token: $PERSONAL_TOKEN
    git_protocol: https
    user: $PERSONAL_ACCOUNT
    oauth_token: $PERSONAL_TOKEN
EOF
      ok "Personal account configured from existing token (no re-auth needed)"
    else
      info "No existing token found for $PERSONAL_ACCOUNT. Opening browser for login..."
      echo ""
      echo "  Log in with your PERSONAL account ($PERSONAL_ACCOUNT)."
      echo "  Scopes: repo, read:org, gist, read:packages, workflow"
      echo ""
      GH_CONFIG_DIR="$GH_CONFIG_PERSONAL" gh auth login --hostname github.com --git-protocol https --web --scopes "repo,read:org,gist,read:packages,workflow"
      ok "Personal account configured in $GH_CONFIG_PERSONAL"
    fi
  fi

  # --- Step 4: Create credential helper wrappers ---
  info "Step 4: Creating credential helper wrappers..."
  mkdir -p "$HOME/.local/bin"

  cat > "$CREDENTIAL_WORK" << 'EOF'
#!/bin/bash
GH_CONFIG_DIR="__GH_CONFIG_WORK__" exec gh auth git-credential "$@"
EOF
  sed -i "s|__GH_CONFIG_WORK__|$GH_CONFIG_WORK|g" "$CREDENTIAL_WORK"
  chmod +x "$CREDENTIAL_WORK"

  cat > "$CREDENTIAL_PERSONAL" << 'EOF'
#!/bin/bash
GH_CONFIG_DIR="__GH_CONFIG_PERSONAL__" exec gh auth git-credential "$@"
EOF
  sed -i "s|__GH_CONFIG_PERSONAL__|$GH_CONFIG_PERSONAL|g" "$CREDENTIAL_PERSONAL"
  chmod +x "$CREDENTIAL_PERSONAL"

  ok "Credential helpers created"

  # --- Step 5: Configure git includeIf ---
  info "Step 5: Configuring git includeIf + credential helpers..."
  backup_file "$HOME/.gitconfig"

  # Write .gitconfig-work
  cat > "$GITCONFIG_WORK" << EOF
[user]
	name = Niccolò Olivieri Achille
	email = niccolo.olivieri@bepower.com
[credential "https://github.com"]
	helper =
	helper = !$CREDENTIAL_WORK
[credential "https://gist.github.com"]
	helper =
	helper = !$CREDENTIAL_WORK
EOF
  ok "Created $GITCONFIG_WORK"

  # Write .gitconfig-mine (personal)
  cat > "$GITCONFIG_PERSONAL" << EOF
[user]
	name = Zweer
	email = n.olivieriachille@gmail.com
[credential "https://github.com"]
	helper =
	helper = !$CREDENTIAL_PERSONAL
[credential "https://gist.github.com"]
	helper =
	helper = !$CREDENTIAL_PERSONAL
EOF
  ok "Created $GITCONFIG_PERSONAL"

  # Update main .gitconfig
  # Remove existing credential and includeIf sections, rewrite cleanly
  cat > "$HOME/.gitconfig" << EOF
[user]
	name = Niccolò Olivieri Achille
	email = niccolo.olivieri@bepower.com

[includeIf "gitdir:$WORK_DIR/"]
	path = $GITCONFIG_WORK

[includeIf "gitdir:$PERSONAL_DIR/"]
	path = $GITCONFIG_PERSONAL

# Default credential helper (work) - used outside bepower/ and mine/
[credential "https://github.com"]
	helper =
	helper = !$CREDENTIAL_WORK
[credential "https://gist.github.com"]
	helper =
	helper = !$CREDENTIAL_WORK
EOF
  ok "Updated ~/.gitconfig with includeIf"

  # --- Step 6: Create .envrc files ---
  info "Step 6: Creating .envrc files..."

  mkdir -p "$WORK_DIR" "$PERSONAL_DIR"

  if [[ -f "$WORK_DIR/.envrc" ]] && grep -qF "GH_CONFIG_DIR" "$WORK_DIR/.envrc"; then
    ok "$WORK_DIR/.envrc already configured"
  else
    echo "export GH_CONFIG_DIR=\"$GH_CONFIG_WORK\"" >> "$WORK_DIR/.envrc"
    ok "Created $WORK_DIR/.envrc"
  fi

  if [[ -f "$PERSONAL_DIR/.envrc" ]] && grep -qF "GH_CONFIG_DIR" "$PERSONAL_DIR/.envrc"; then
    ok "$PERSONAL_DIR/.envrc already configured"
  else
    echo "export GH_CONFIG_DIR=\"$GH_CONFIG_PERSONAL\"" >> "$PERSONAL_DIR/.envrc"
    ok "Created $PERSONAL_DIR/.envrc"
  fi

  # Allow direnv
  direnv allow "$WORK_DIR" 2>/dev/null || true
  direnv allow "$PERSONAL_DIR" 2>/dev/null || true
  ok ".envrc files allowed by direnv"

  # --- Step 7: Remove global gh auth setup-git (avoid conflicts) ---
  info "Step 7: Cleanup..."
  # The old global credential config is now replaced by includeIf, nothing else to do.
  ok "Setup complete!"

  echo ""
  echo "=========================================="
  echo " Done! Next steps:"
  echo "=========================================="
  echo ""
  echo " 1. Reload your shell:  source ~/.bashrc"
  echo " 2. Test work dir:      cd $WORK_DIR && gh auth status"
  echo " 3. Test personal dir:  cd $PERSONAL_DIR && gh auth status"
  echo " 4. Test git push from any IDE - it will use the right account"
  echo ""
  echo " The default (outside both dirs) is: WORK account."
  echo ""
}

# =============================================================================
# DOWN
# =============================================================================
do_down() {
  echo ""
  echo "=========================================="
  echo " gh multi-account teardown"
  echo "=========================================="
  echo ""

  # --- Remove credential wrappers ---
  info "Removing credential helper wrappers..."
  rm -f "$CREDENTIAL_WORK" "$CREDENTIAL_PERSONAL"
  ok "Removed wrappers"

  # --- Remove .envrc entries ---
  info "Removing .envrc files..."
  if [[ -f "$WORK_DIR/.envrc" ]]; then
    sed -i '/GH_CONFIG_DIR/d' "$WORK_DIR/.envrc"
    # Remove file if empty
    [[ ! -s "$WORK_DIR/.envrc" ]] && rm -f "$WORK_DIR/.envrc"
    ok "Cleaned $WORK_DIR/.envrc"
  fi
  if [[ -f "$PERSONAL_DIR/.envrc" ]]; then
    sed -i '/GH_CONFIG_DIR/d' "$PERSONAL_DIR/.envrc"
    [[ ! -s "$PERSONAL_DIR/.envrc" ]] && rm -f "$PERSONAL_DIR/.envrc"
    ok "Cleaned $PERSONAL_DIR/.envrc"
  fi

  # --- Remove direnv hook from bashrc ---
  info "Removing direnv hook from .bashrc..."
  if grep -qF "$DIRENV_HOOK_MARKER" "$BASHRC" 2>/dev/null; then
    sed -i "/$DIRENV_HOOK_MARKER/,/$DIRENV_HOOK_MARKER_END/d" "$BASHRC"
    # Remove trailing blank lines left behind
    sed -i -e :a -e '/^\n*$/{$d;N;ba' -e '}' "$BASHRC"
    ok "Removed direnv hook from .bashrc"
  else
    ok "No direnv hook found in .bashrc"
  fi

  # --- Remove gh config directories ---
  info "Removing gh config directories..."
  rm -rf "$GH_CONFIG_WORK" "$GH_CONFIG_PERSONAL"
  ok "Removed $GH_CONFIG_WORK and $GH_CONFIG_PERSONAL"

  # --- Remove gitconfig-work ---
  info "Removing $GITCONFIG_WORK..."
  rm -f "$GITCONFIG_WORK"
  ok "Removed"

  # --- Restore .gitconfig-mine to original ---
  info "Restoring $GITCONFIG_PERSONAL to original (user-only)..."
  cat > "$GITCONFIG_PERSONAL" << EOF
[user]
	name = Zweer
	email = n.olivieriachille@gmail.com
EOF
  ok "Restored"

  # --- Restore ~/.gitconfig ---
  info "Restoring ~/.gitconfig..."
  cat > "$HOME/.gitconfig" << 'EOF'
[user]
	name = Niccolò Olivieri Achille
	email = niccolo.olivieri@bepower.com

[includeIf "gitdir:~/projects/mine/"]
	path = ~/.gitconfig-mine

[credential "https://github.com"]
	helper =
	helper = !/usr/bin/gh auth git-credential
[credential "https://gist.github.com"]
	helper =
	helper = !/usr/bin/gh auth git-credential
EOF
  ok "Restored ~/.gitconfig to original state"

  echo ""
  echo "=========================================="
  echo " Teardown complete"
  echo "=========================================="
  echo ""
  echo " Your gh auth is back to global mode (gh auth switch)."
  echo " direnv is still installed but unhooked — remove it with your package manager if desired."
  echo ""
  echo " Reload your shell: source ~/.bashrc"
  echo ""
}

# =============================================================================
# STATUS
# =============================================================================
do_status() {
  echo ""
  echo "=========================================="
  echo " gh multi-account status"
  echo "=========================================="
  echo ""

  # direnv
  if command -v direnv &>/dev/null; then
    ok "direnv installed: $(which direnv)"
  else
    warn "direnv not installed"
  fi

  # direnv hook
  if grep -qF "$DIRENV_HOOK_MARKER" "$BASHRC" 2>/dev/null; then
    ok "direnv hook in .bashrc"
  else
    warn "direnv hook NOT in .bashrc"
  fi

  # gh configs
  if [[ -d "$GH_CONFIG_WORK" ]]; then
    ok "gh-work config exists"
    GH_CONFIG_DIR="$GH_CONFIG_WORK" gh auth status 2>&1 | grep "account" | head -1 | sed 's/^/     /'
  else
    warn "gh-work config missing"
  fi

  if [[ -d "$GH_CONFIG_PERSONAL" ]]; then
    ok "gh-personal config exists"
    GH_CONFIG_DIR="$GH_CONFIG_PERSONAL" gh auth status 2>&1 | grep "account" | head -1 | sed 's/^/     /'
  else
    warn "gh-personal config missing"
  fi

  # Credential wrappers
  if [[ -x "$CREDENTIAL_WORK" ]]; then
    ok "gh-credential-work wrapper exists"
  else
    warn "gh-credential-work wrapper missing"
  fi
  if [[ -x "$CREDENTIAL_PERSONAL" ]]; then
    ok "gh-credential-personal wrapper exists"
  else
    warn "gh-credential-personal wrapper missing"
  fi

  # .envrc files
  if [[ -f "$WORK_DIR/.envrc" ]] && grep -qF "GH_CONFIG_DIR" "$WORK_DIR/.envrc"; then
    ok "$WORK_DIR/.envrc configured"
  else
    warn "$WORK_DIR/.envrc not configured"
  fi
  if [[ -f "$PERSONAL_DIR/.envrc" ]] && grep -qF "GH_CONFIG_DIR" "$PERSONAL_DIR/.envrc"; then
    ok "$PERSONAL_DIR/.envrc configured"
  else
    warn "$PERSONAL_DIR/.envrc not configured"
  fi

  # Git includeIf
  if grep -qF "gitconfig-work" "$HOME/.gitconfig" 2>/dev/null; then
    ok "~/.gitconfig has work includeIf"
  else
    warn "~/.gitconfig missing work includeIf"
  fi

  echo ""
}

# =============================================================================
# Main
# =============================================================================
case "${1:-}" in
  up)     do_up ;;
  down)   do_down ;;
  status) do_status ;;
  *)
    echo "Usage: $0 {up|down|status}"
    echo ""
    echo "  up     — Install multi-account configuration"
    echo "  down   — Remove all configuration, restore original state"
    echo "  status — Check current state"
    exit 1
    ;;
esac
