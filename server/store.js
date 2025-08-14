import { v4 as uuid } from 'uuid';

class Store {
  constructor() {
    this.users = new Map();          // id -> { id, username, password }
    this.sessions = new Map();       // token -> userId
    this.tasks = new Map();          // id -> task
  }

  // USERS
  createUser({ username, password }) {
    if (!username || !password) throw new Error('Username and password are required');
    if ([...this.users.values()].some(u => u.username === username)) {
      const err = new Error('Username already exists');
      err.status = 409; throw err;
    }
    const user = { id: uuid(), username, password };
    this.users.set(user.id, user);
    return user;
  }

  login({ username, password }) {
    const user = [...this.users.values()].find(u => u.username === username && u.password === password);
    if (!user) { const err = new Error('Invalid credentials'); err.status = 401; throw err; }
    const token = uuid();
    this.sessions.set(token, user.id);
    return { token, user };
  }

  auth(token) {
    if (!token) return null;
    const userId = this.sessions.get(token);
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  // TASKS
  createTask({ title, description = '', priority = 'Low', status = 'To Do', assigneeId = null, deps = [] }) {
    if (!title) throw new Error('Title is required');
    const id = uuid();
    const now = new Date().toISOString();
    const task = { id, title, description, priority, status, assigneeId, deps, createdAt: now, updatedAt: now };
    this.tasks.set(id, task);
    return task;
  }

  updateTask(id, patch) {
    const existing = this.tasks.get(id);
    if (!existing) { const err = new Error('Task not found'); err.status = 404; throw err; }
    const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    // Prevent circular/self dependency
    if (updated.deps?.includes(id)) { const err = new Error('Task cannot depend on itself'); err.status = 400; throw err; }
    // Validate all deps exist
    if (updated.deps && !updated.deps.every(d => this.tasks.has(d))) {
      const err = new Error('Some dependency tasks do not exist'); err.status = 400; throw err;
    }
    this.tasks.set(id, updated);
    return updated;
  }

  deleteTask(id) {
    // Also remove this id from other tasks' deps
    for (const t of this.tasks.values()) {
      if (t.deps?.includes(id)) {
        t.deps = t.deps.filter(d => d !== id);
        t.updatedAt = new Date().toISOString();
      }
    }
    return this.tasks.delete(id);
  }

  isBlocked(task) {
    if (!task.deps || task.deps.length === 0) return false;
    return task.deps.some(did => {
      const dep = this.tasks.get(did);
      return !dep || dep.status !== 'Done';
    });
  }

  canComplete(id) {
    const task = this.tasks.get(id);
    if (!task) return { ok: false, reason: 'Task not found' };
    return this.isBlocked(task) ? { ok: false, reason: 'Blocked by incomplete dependencies' } : { ok: true };
  }
}

export const store = new Store();
