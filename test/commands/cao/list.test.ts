import { describe, expect, it } from 'vitest';

import { groupAgentsByCategory, listCommand } from '../../../cli/commands/cao/list.js';
import type { Agent } from '../../../cli/utils/agents.js';

describe('list command', () => {
  describe('command structure', () => {
    it('should be defined', () => {
      expect(listCommand).toBeDefined();
    });

    it('should have correct name', () => {
      expect(listCommand.name()).toBe('list');
    });

    it('should have description', () => {
      expect(listCommand.description()).toBe('List all available agents');
    });
  });

  describe('groupAgentsByCategory', () => {
    it('should group agents by category', () => {
      const agents: Agent[] = [
        { name: 'agent1', path: '/path/1', category: 'web' },
        { name: 'agent2', path: '/path/2', category: 'web' },
        { name: 'agent3', path: '/path/3', category: 'services' },
      ];

      const grouped = groupAgentsByCategory(agents);

      expect(grouped.web).toHaveLength(2);
      expect(grouped.services).toHaveLength(1);
    });

    it('should group agents with subcategories', () => {
      const agents: Agent[] = [
        { name: 'agent1', path: '/path/1', category: 'web', subcategory: 'frontend' },
        { name: 'agent2', path: '/path/2', category: 'web', subcategory: 'backend' },
        { name: 'agent3', path: '/path/3', category: 'web' },
      ];

      const grouped = groupAgentsByCategory(agents);

      expect(grouped['web/frontend']).toHaveLength(1);
      expect(grouped['web/backend']).toHaveLength(1);
      expect(grouped.web).toHaveLength(1);
    });

    it('should handle empty array', () => {
      const grouped = groupAgentsByCategory([]);

      expect(Object.keys(grouped)).toHaveLength(0);
    });

    it('should handle multiple categories', () => {
      const agents: Agent[] = [
        { name: 'a1', path: '/1', category: 'web' },
        { name: 'a2', path: '/2', category: 'services' },
        { name: 'a3', path: '/3', category: 'mobile' },
        { name: 'a4', path: '/4', category: 'quality' },
      ];

      const grouped = groupAgentsByCategory(agents);

      expect(Object.keys(grouped)).toHaveLength(4);
      expect(grouped.web).toHaveLength(1);
      expect(grouped.services).toHaveLength(1);
      expect(grouped.mobile).toHaveLength(1);
      expect(grouped.quality).toHaveLength(1);
    });
  });
});
