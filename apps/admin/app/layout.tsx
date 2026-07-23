import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '../components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'HunarmandAI Admin',
  description: 'Admin portal for HunarmandAI marketplace',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="admin-shell">
          <Sidebar />
          <div className="admin-main">
            {children}
          </div>
        </div>

        <style>{`
          .admin-shell {
            display: flex;
            height: 100vh;
            overflow: hidden;
          }

          .admin-main {
            flex: 1;
            overflow-y: auto;
            min-width: 0;
          }

          @media (max-width: 768px) {
            .admin-shell { display: block; height: auto; overflow: visible; }
            .admin-main { min-height: 100vh; }
          }
        `}</style>
      </body>
    </html>
  );
}
