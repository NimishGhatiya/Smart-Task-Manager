'use client';
import React, { useMemo, useState } from 'react';
import { api, Task, User } from '@/lib/api';

export function TaskForm({ users, tasks, onCreated }: { users: User[]; tasks: Task[]; onCreated: (t: Task)=>void; }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low'|'Medium'|'High'>('Low');
  const [status, setStatus] = useState<'To Do'|'In Progress'|'Done'>('To Do');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [deps, setDeps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const depOptions = useMemo(() => tasks, [tasks]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(null);
    try {
      const task = await api.createTask({ title, description, priority, status, assigneeId: assigneeId || null, deps });
      onCreated(task);
      setTitle(''); setDescription(''); setPriority('Low'); setStatus('To Do'); setAssigneeId(''); setDeps([]);
    } catch (e: any) { setError(e.message); }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h3>Create Task</h3>
      <div className="row">
        <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <textarea className="input" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <div className="row" style={{ width:'100%' }}>
          <select value={priority} onChange={e=>setPriority(e.target.value as any)}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
          <select value={status} onChange={e=>setStatus(e.target.value as any)}>
            <option>To Do</option><option>In Progress</option><option>Done</option>
          </select>
          <select value={assigneeId} onChange={e=>setAssigneeId(e.target.value)}>
            <option value="">Unassigned</option>
            {users.map(u=> <option key={u.id} value={u.id}>{u.username}</option>)}
          </select>
        </div>
        <div>
          <label>Dependencies</label>
          <div className="grid">
            {depOptions.map(t => (
              <label key={t.id} className="badge" style={{ display:'flex', alignItems:'center', gap:6 }}>
                <input type="checkbox" checked={deps.includes(t.id)} onChange={(e)=>{
                  setDeps(prev => e.target.checked ? [...prev, t.id] : prev.filter(id => id !== t.id));
                }} />
                {t.title}
              </label>
            ))}
          </div>
        </div>
        {error && <div className="badge" style={{ borderColor: '#ff5b5b', color:'#ff9b9b' }}>{error}</div>}
        <button className="button" type="submit">Create</button>
      </div>
    </form>
  );
}
