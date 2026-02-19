/**
 * Group storage management.
 */

const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const crypto = require('crypto');

class GroupStorage {
  constructor(storagePath = null) {
    this.storagePath = storagePath || path.join(os.homedir(), '.db-toolkit', 'groups.json');
  }

  async ensureStorageDir() {
    const dir = path.dirname(this.storagePath);
    await fs.mkdir(dir, { recursive: true });
  }

  async getAllGroups() {
    try {
      await this.ensureStorageDir();
      const data = await fs.readFile(this.storagePath, 'utf-8');
      const parsed = JSON.parse(data);
      return parsed.groups || [];
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async getGroup(groupId) {
    const groups = await this.getAllGroups();
    return groups.find(group => group.id === groupId) || null;
  }

  async addGroup(name) {
    const group = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: new Date().toISOString()
    };

    const groups = await this.getAllGroups();
    groups.push(group);
    await this.saveGroups(groups);

    return group;
  }

  async updateGroup(groupId, updates) {
    const groups = await this.getAllGroups();
    const index = groups.findIndex(group => group.id === groupId);

    if (index === -1) {
      return null;
    }

    groups[index] = {
      ...groups[index],
      ...updates,
      id: groupId,
      updatedAt: new Date().toISOString()
    };

    await this.saveGroups(groups);
    return groups[index];
  }

  async removeGroup(groupId) {
    const groups = await this.getAllGroups();
    const originalCount = groups.length;
    const filtered = groups.filter(group => group.id !== groupId);

    if (filtered.length < originalCount) {
      await this.saveGroups(filtered);
      return true;
    }
    return false;
  }

  async saveGroups(groups) {
    await this.ensureStorageDir();
    const data = { groups };
    await fs.writeFile(this.storagePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

const groupStorage = new GroupStorage();

module.exports = { GroupStorage, groupStorage };
