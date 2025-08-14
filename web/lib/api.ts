const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export type User = { id: string; username: string; };
export type Task = {
  id: string;
  title: string;
  description: string;
  priority: 'Low'|'Medium'|'High';
  status: 'To Do'|'In Progress'|'Done';
  assigneeId: string | null;
  deps: string[];
  createdAt: string; updatedAt: string;
};

function headers() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export const api = {
  async signup(username: string, password: string) {
    const r = await fetch(`${API}/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    if (!r.ok) throw new Error((await r.json()).error || 'Signup failed');
    return r.json();
  },
  async login(username: string, password: string) {
    const r = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    if (!r.ok) throw new Error((await r.json()).error || 'Login failed');
    return r.json();
  },
  async users(): Promise<User[]> {
    const r = await fetch(`${API}/users`);
    return r.json();
  },
  async tasks(params?: { assigneeId?: string; blocked?: boolean; }): Promise<Task[]> {
    const q = new URLSearchParams();
    if (params?.assigneeId) q.set('assigneeId', params.assigneeId);
    if (typeof params?.blocked === 'boolean') q.set('blocked', String(params.blocked));
    const r = await fetch(`${API}/tasks?${q.toString()}`);
    return r.json();
  },
  async createTask(body: Partial<Task>) {
    const r = await fetch(`${API}/tasks`, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
    if (!r.ok) throw new Error((await r.json()).error || 'Create failed');
    return r.json();
  },
  async updateTask(id: string, patch: Partial<Task>) {
    const r = await fetch(`${API}/tasks/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(patch) });
    if (!r.ok) throw new Error((await r.json()).error || 'Update failed');
    return r.json();
  },
  async deleteTask(id: string) {
    const r = await fetch(`${API}/tasks/${id}`, { method: 'DELETE', headers: headers() });
    if (!r.ok) throw new Error((await r.json()).error || 'Delete failed');
    return r.json();
  },
  async completeTask(id: string) {
    const r = await fetch(`${API}/tasks/${id}/complete`, { method: 'POST', headers: headers() });
    if (!r.ok) throw new Error((await r.json()).error || 'Cannot complete');
    return r.json();
  }
};
