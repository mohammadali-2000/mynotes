import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';

export default function Layout() {
  const { isSidebarOpen, toggleSidebar } = useWorkspaceStore();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out relative",
          isSidebarOpen ? "ml-0 sm:ml-64" : "ml-0"
        )}
      >
        <header className="h-14 flex items-center px-4 border-b shrink-0 bg-background/80 backdrop-blur-sm z-10 sticky top-0">
          {!isSidebarOpen && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1 flex justify-between items-center">
            {/* Topbar actions (search, profile) can go here */}
            <div className="text-sm text-muted-foreground ml-auto">
              {/* Space for right-side items */}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
