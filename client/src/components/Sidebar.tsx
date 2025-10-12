import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  BotMessageSquare,
  Settings,
  FileText,
} from 'lucide-react';

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Students', path: '/students' },
  { icon: GraduationCap, label: 'Teachers', path: '/teachers' },
  { icon: BookOpen, label: 'Classes', path: '/classes' },
  { icon: ClipboardCheck, label: 'Attendance', path: '/attendance' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: BotMessageSquare, label: 'AI Assistant', path: '/assistant' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const teacherMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher-dashboard' },
  { icon: BookOpen, label: 'My Classes', path: '/teacher-classes' },
  { icon: Users, label: 'Students', path: '/students' },
  { icon: ClipboardCheck, label: 'Attendance', path: '/attendance' },
  { icon: FileText, label: 'Assignments', path: '/teacher-assignments' },
  { icon: BarChart3, label: 'Grade Book', path: '/teacher-gradebook' },
  { icon: BotMessageSquare, label: 'AI Assistant', path: '/assistant' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  isTeacher?: boolean;
}

export default function Sidebar({ isTeacher = false }: SidebarProps) {
  const location = useLocation();
  const menuItems = isTeacher ? teacherMenuItems : adminMenuItems;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 w-64 min-h-screen sticky top-0 hidden md:block"
    >
      <div className="p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.aside>
  );
}
