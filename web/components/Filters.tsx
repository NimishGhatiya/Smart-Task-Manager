'use client';
import React from 'react';

export type Filters = {
  priority: 'All' | 'Low' | 'Medium' | 'High';
  status: 'All' | 'To Do' | 'In Progress' | 'Done';
  showBlocked: boolean;
};
export function FiltersBar({ filters, setFilters }: { filters: Filters; setFilters: (f: Filters) => void; }) {
  return (
    <div className="card row" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span><strong>Priority:</strong></span>
        <select
          value={filters.priority}
          onChange={e => setFilters({ ...filters, priority: e.target.value as any })}
        >
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </label>

      {/* Status Filter */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span><strong>Status:</strong></span>
        <select
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value as any })}
        >
          <option>All</option>
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
      </label>

      {/* Blocked Filter */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={filters.showBlocked}
          onChange={e => setFilters({ ...filters, showBlocked: e.target.checked })}
        />
        Show Blocked Only
      </label>
    </div>
  );
}
