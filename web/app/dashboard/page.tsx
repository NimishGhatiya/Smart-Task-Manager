"use client";
import React, { useEffect, useMemo, useState } from "react";
import { api, Task, User } from "@/lib/api";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { Filters, FiltersBar } from "@/components/Filters";
import { UsersList } from "@/components/Users";
export default function Dashboard() {
  const [me, setMe] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showTasks, setShowTasks] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<Filters>({
    priority: "All",
    status: "All",
    showBlocked: false,
  });

  function loadAll() {
    api.users().then(setUsers);
    api.tasks().then(setTasks);
  }

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) {
      window.location.href = "/";
      return;
    }
    setMe(JSON.parse(u));
    loadAll();
    const id = setInterval(loadAll, 3000); // polling to simulate real-time
    return () => clearInterval(id);
  }, []);

  const myTasks = useMemo(
    () => tasks.filter((t) => t.assigneeId === me?.id),
    [tasks, me]
  );

  const filtered = useMemo(() => {
    let list = tasks;
    if (filters.priority !== "All")
      list = list.filter((t) => t.priority === filters.priority);
    if (filters.status !== "All")
      list = list.filter((t) => t.status === filters.status);
    if (filters.showBlocked)
      list = list
        .filter((t) => t.deps.length > 0)
        .filter((t) => t.status !== "Done");
    return list;
  }, [tasks, filters]);
  return (
    <>
      {showUsers ? (
        <UsersList users={users} />
      ) : (
        <div className="row">
          <div style={{ flex: "1 1 320px" }}>
            <div className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>Hello, {me?.username}</h3>
                <button
                  className="button secondary"
                  style={{ backgroundColor: "red" }}
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                  }}
                >
                  Logout
                </button>
              </div>
              <p>
                Quick stats: {tasks.length} tasks • {users.length} users
              </p>
              <button
                className="button secondary"
                style={{ backgroundColor: "blue" }}
                onClick={() => setShowUsers(true)}
              >
                All Users
              </button>
            </div>
            <TaskForm users={users} tasks={tasks} onCreated={loadAll} />
          </div>

          <div style={{ flex: "2 1 600px" }}>
            <FiltersBar filters={filters} setFilters={setFilters} />

            <div className="card">
              <div className="">
              {[
                { label: "My Tasks", checked: showTasks },
                { label: "All Tasks", checked: !showTasks },
              ].map(({ label, checked }) => (
                <h3
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setShowTasks(!showTasks)}
                  />
                  {label}
                </h3>
              ))}
</div>
              {showTasks ? (
                <TaskList tasks={myTasks} users={users} onChanged={loadAll} />
              ) : (
                <>
                  <h3>
                    All Tasks {filters.showBlocked ? "(Blocked Only)" : ""}
                  </h3>
                  <TaskList
                    tasks={filtered}
                    users={users}
                    onChanged={loadAll}
                  />
                </>
              )}
            </div>

            {/* <div className="card" style={{ marginTop: 16 }}>
              <h3>All Tasks {filters.showBlocked ? "(Blocked Only)" : ""}</h3>
              <TaskList tasks={filtered} users={users} onChanged={loadAll} />
            </div> */}
          </div>
        </div>
      )}
    </>
  );
}
