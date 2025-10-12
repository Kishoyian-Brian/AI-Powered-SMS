import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

interface MainLayoutProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isTeacher?: boolean;
}

export default function MainLayout({ darkMode, toggleDarkMode, isTeacher = false }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isTeacher={isTeacher} />
      <div className="flex-1 flex flex-col">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
