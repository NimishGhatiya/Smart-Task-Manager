import React from "react";
import { Task, User, api } from "@/lib/api";

export function UsersList({ users }: { users: User[] }) {
  return (
      <div>
        <div className="users-class">
          <h3>Users</h3>
          <h3>Total Users {users.length}</h3>
          <button
          className="button"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Back
          </button>
        </div>
        {users?.map((u) => (
          <div key={u.id} className="card" style={{ flex: "1 1 300px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4 style={{ margin: 0 }}>{u.username}</h4>
            </div>
          </div>
        ))}
      </div>
  );
}
