import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Palette } from 'lucide-react';
import Card from '../components/Card';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const themeColors = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
  { name: 'Red', value: 'red', class: 'bg-red-500' },
  { name: 'Cyan', value: 'cyan', class: 'bg-cyan-500' },
];

export default function Settings({ darkMode, toggleDarkMode }: SettingsProps) {
  const { user } = useUser();
  const { themeColor, fontSize, setThemeColor, setFontSize } = useTheme();
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : {
      email: true,
      push: false,
      attendance: true,
      reports: false,
    };
  });
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleColorChange = (color: string) => {
    setThemeColor(color);
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
  };

  const toggleNotification = (key: string) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const handleSaveProfile = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
    // In a real app, you would save to backend
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your preferences and account settings</p>
      </motion.div>

      {showSaveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 bg-green-100 dark:bg-green-900/20 border border-green-500 rounded-xl flex items-center gap-3"
        >
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-green-700 dark:text-green-400 font-medium">Settings saved successfully!</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Settings</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue={user?.name || 'User'}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                defaultValue={user?.email || 'user@school.com'}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
              <input
                type="text"
                value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                disabled
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400"
              />
            </div>
            <button 
              onClick={handleSaveProfile}
              className="w-full py-2 gradient-primary text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Save Changes
            </button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Palette className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark mode theme</p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  darkMode ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  animate={{ x: darkMode ? 24 : 2 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme Color</label>
              <div className="grid grid-cols-5 gap-2">
                {themeColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorChange(color.value)}
                    className={`h-10 ${color.class} rounded-lg hover:scale-110 transition-transform ${
                      themeColor === color.value ? 'ring-4 ring-offset-2 ring-gray-400 dark:ring-gray-500' : ''
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Selected: {themeColors.find(c => c.value === themeColor)?.name || 'Blue'}
              </p>
              
              {/* Theme Preview */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 gradient-primary text-white rounded-lg text-sm font-medium">
                    Button
                  </button>
                  <div className="px-4 py-2 border-2 border-primary rounded-lg text-sm font-medium text-primary">
                    Border
                  </div>
                  <div className="w-8 h-8 bg-primary rounded-lg"></div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Size</label>
              <select 
                value={fontSize}
                onChange={(e) => handleFontSizeChange(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              >
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h3>
          </div>

          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive email updates' },
              { key: 'push', label: 'Push Notifications', desc: 'Receive browser notifications' },
              { key: 'attendance', label: 'Attendance Alerts', desc: 'Alert when attendance is low' },
              { key: 'reports', label: 'Performance Reports', desc: 'Weekly performance summaries' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
                <button 
                  onClick={() => toggleNotification(item.key)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: notifications[item.key as keyof typeof notifications] ? 24 : 2 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Security</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>
            <button className="w-full py-2 bg-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all">
              Update Password
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
