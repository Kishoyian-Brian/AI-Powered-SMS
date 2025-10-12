import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Classes from './pages/Classes';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import AiAssistant from './pages/AiAssistant';
import Settings from './pages/Settings';
import TeacherClasses from './pages/teacher/Classes';
import TeacherAssignments from './pages/teacher/Assignments';
import TeacherGradeBook from './pages/teacher/GradeBook';
import AiChatWidget from './components/AiChatWidget';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';

function AppContent({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) {
  const location = useLocation();
  const showChatWidget = !['/login', '/register', '/'].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route element={<MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/assistant" element={<AiAssistant />} />
          <Route path="/settings" element={<Settings darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        </Route>

        {/* Teacher Routes */}
        <Route element={<MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} isTeacher={true} />}>
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher-classes" element={<TeacherClasses />} />
          <Route path="/teacher-assignments" element={<TeacherAssignments />} />
          <Route path="/teacher-gradebook" element={<TeacherGradeBook />} />
        </Route>
      </Routes>
      {showChatWidget && <AiChatWidget />}
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider>
      <NotificationProvider>
        <UserProvider>
          <BrowserRouter>
            <AppContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </BrowserRouter>
        </UserProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
