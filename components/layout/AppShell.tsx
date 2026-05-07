import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

export function AppShell({ children, className = '' }: AppShellProps) {
  return (
    <div className="easy-start-app">
      <Sidebar />
      <main className="easy-main">
        <div className={className}>
          {children}
        </div>
      </main>
    </div>
  );
}