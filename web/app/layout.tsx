import './globals.css';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <h1>🧠 Smart Task Manager</h1>
          {children}
        </div>
      </body>
    </html>
  );
}
