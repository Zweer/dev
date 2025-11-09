import { describe, expect, it } from 'vitest';

import { getAllAgents } from '../../cli/utils/agents.js';

describe('agents utility', () => {
  describe('getAllAgents', () => {
    it('should return an array of agents', async () => {
      const agents = await getAllAgents();

      expect(agents).toBeInstanceOf(Array);
      expect(agents.length).toBeGreaterThan(0);
    });

    it('should have required properties', async () => {
      const agents = await getAllAgents();
      const agent = agents[0];

      expect(agent).toHaveProperty('name');
      expect(agent).toHaveProperty('path');
      expect(agent).toHaveProperty('category');
      expect(typeof agent.name).toBe('string');
      expect(typeof agent.path).toBe('string');
      expect(typeof agent.category).toBe('string');
    });

    it('should extract descriptions from agent files', async () => {
      const agents = await getAllAgents();
      const agentWithDescription = agents.find((a) => a.description);

      expect(agentWithDescription).toBeDefined();
      expect(typeof agentWithDescription?.description).toBe('string');
    });

    it('should categorize agents correctly', async () => {
      const agents = await getAllAgents();
      const categories = [...new Set(agents.map((a) => a.category))];

      expect(categories).toContain('web');
      expect(categories).toContain('services');
      expect(categories).toContain('infrastructure');
      expect(categories).toContain('mobile');
      expect(categories).toContain('quality');
    });

    it('should handle subcategories', async () => {
      const agents = await getAllAgents();
      const webAgents = agents.filter((a) => a.category === 'web');
      const withSubcategory = webAgents.find((a) => a.subcategory);

      expect(withSubcategory).toBeDefined();
      expect(withSubcategory?.subcategory).toBeDefined();
    });
  });
});
