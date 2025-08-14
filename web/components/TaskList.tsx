'use client';
import React from 'react';
import { Task, User, api } from '@/lib/api';

export function TaskList({ tasks, users, onChanged }: { tasks: Task[]; users: User[]; onChanged: () => void; }) {
  function userName(id: string | null) {
    return users.find(u=>u.id===id)?.username || '—';
  }

  return (
    <div className="row">
      {tasks.map(t => (
        <div key={t.id} className="card" style={{ flex: '1 1 300px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h4 style={{ margin:0 }}>{t.title}</h4>
            <span className="badge">{t.priority}</span>
          </div>
          <p style={{ opacity:.9 }}>{t.description || '—'}</p>
          <div className="row">
            <span className="badge">Status: {t.status}</span>
            <span className="badge">Assignee: {userName(t.assigneeId)}</span>
            {t.deps.length>0 && <span className="badge">Deps: {t.deps.length}</span>}
          </div>
          <div className="row" style={{ marginTop: 8 }}>
            <button className="button" onClick={async()=>{ try { await api.completeTask(t.id); onChanged(); } catch(e:any){ alert(e.message); } }}>Mark Done</button>
            <button className="button secondary" onClick={async()=>{ if (confirm('Delete this task?')) { await api.deleteTask(t.id); onChanged(); }}}>Delete</button>
            <button className="button secondary" onClick={async()=>{ const s = prompt('New status: To Do | In Progress | Done', t.status); if (!s) return; await api.updateTask(t.id, { status: s as any }); onChanged(); }}>Update Status</button>
          </div>
        </div>
      ))}
    </div>
  );
}
