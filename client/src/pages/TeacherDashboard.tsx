import { motion } from 'framer-motion';
import { Users, BookOpen, ClipboardCheck, Award, TrendingUp, Bell, Calendar, Plus } from 'lucide-react';
import Card from '../components/Card';
import Chart from '../components/Chart';
import { useUser } from '../contexts/UserContext';
import { useNotifications } from '../contexts/NotificationContext';

const teacherInfo = {
  subject: 'Mathematics',
  classes: ['10-A', '10-B', '11-A'],
  totalStudents: 95,
  avgAttendance: '94.2%',
};

const myClasses = [
  { id: 1, name: '10-A', students: 35, subject: 'Mathematics', schedule: 'Mon, Wed, Fri - 9:00 AM', avgGrade: 85 },
  { id: 2, name: '10-B', students: 32, subject: 'Mathematics', schedule: 'Tue, Thu - 10:00 AM', avgGrade: 88 },
  { id: 3, name: '11-A', students: 28, subject: 'Advanced Math', schedule: 'Mon, Thu - 2:00 PM', avgGrade: 82 },
];

const performanceData = [
  { name: 'Jan', value: 82 },
  { name: 'Feb', value: 85 },
  { name: 'Mar', value: 88 },
  { name: 'Apr', value: 86 },
  { name: 'May', value: 90 },
  { name: 'Jun', value: 87 },
];

const classPerformance = myClasses.map(c => ({ name: c.name, value: c.avgGrade }));

const upcomingTasks = [
  { title: 'Grade 10-A Mid-term Papers', date: '2025-10-15', type: 'grading' },
  { title: 'Parent-Teacher Meeting', date: '2025-10-18', type: 'meeting' },
  { title: 'Submit Grade Reports', date: '2025-10-20', type: 'admin' },
  { title: 'Class 11-A Quiz', date: '2025-10-22', type: 'assessment' },
];

const recentActivities = [
  { title: 'Uploaded assignment for 10-A', time: '2 hours ago' },
  { title: 'Marked attendance for 10-B', time: '5 hours ago' },
  { title: 'Graded 25 assignments', time: '1 day ago' },
  { title: 'Updated lesson plan', time: '2 days ago' },
];

export default function TeacherDashboard() {
  const { user } = useUser();
  const { addNotification } = useNotifications();

  const testNotification = () => {
    const messages = [
      { title: 'Student Submitted Assignment', message: 'John Doe submitted Math assignment', type: 'info' as const, category: 'push' as const },
      { title: 'Class Average Improved', message: '10-A average increased by 5%', type: 'success' as const, category: 'reports' as const },
      { title: 'Parent Meeting Request', message: 'Mrs. Johnson requested a meeting', type: 'warning' as const, category: 'email' as const },
      { title: 'Grading Reminder', message: '15 assignments pending grading', type: 'warning' as const, category: 'push' as const },
    ];
    const random = messages[Math.floor(Math.random() * messages.length)];
    addNotification(random);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name || 'Teacher'}!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {teacherInfo.subject} Teacher • {teacherInfo.classes.length} Classes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={testNotification}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Test Notification
          </button>
          <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
              {teacherInfo.totalStudents} Total Students
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover gradient>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">My Classes</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{teacherInfo.classes.length}</h3>
              <p className="text-blue-500 text-sm mt-2">Active this semester</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card hover gradient>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Students</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{teacherInfo.totalStudents}</h3>
              <p className="text-green-500 text-sm mt-2">Across all classes</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card hover gradient>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Avg Attendance</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{teacherInfo.avgAttendance}</h3>
              <p className="text-green-500 text-sm mt-2">Excellent</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500">
              <ClipboardCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card hover gradient>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Pending Tasks</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{upcomingTasks.length}</h3>
              <p className="text-orange-500 text-sm mt-2">Need attention</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">AI Insight</h3>
            <p className="text-blue-100 mt-1">
              Class 10-B shows excellent improvement this month! Consider implementing similar teaching methods in other classes.
              Students in 11-A may need additional support in advanced topics.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Classes */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">My Classes</h3>
            <div className="space-y-4">
              {myClasses.map((cls, idx) => (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Class {cls.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{cls.subject} • {cls.students} students</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{cls.schedule}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{cls.avgGrade}%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Grade</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <div>
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Tasks
            </h3>
            <div className="space-y-3">
              {upcomingTasks.map((task, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">{task.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{task.date}</p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    task.type === 'grading' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    task.type === 'meeting' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                    task.type === 'assessment' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                    'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                  }`}>
                    {task.type}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Class Average Trend</h3>
          <Chart type="bar" data={performanceData} dataKey="value" xKey="name" />
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Class Performance Comparison</h3>
          <Chart type="bar" data={classPerformance} dataKey="value" xKey="name" colors={['#06b6d4']} />
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Recent Activities
        </h3>
        <div className="space-y-3">
          {recentActivities.map((activity, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <p className="text-gray-900 dark:text-white">{activity.title}</p>
              <span className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}

