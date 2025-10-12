import { motion } from 'framer-motion';
import { Users, GraduationCap, TrendingUp, Sparkles } from 'lucide-react';
import Card from '../components/Card';
import Chart from '../components/Chart';
import { useUser } from '../contexts/UserContext';

const statsData = [
  { icon: Users, label: 'Total Students', value: '2,847', change: '+12%', color: 'from-blue-500 to-cyan-500' },
  { icon: GraduationCap, label: 'Total Teachers', value: '156', change: '+5%', color: 'from-green-500 to-emerald-500' },
  { icon: TrendingUp, label: 'Attendance Rate', value: '94.2%', change: '+2.3%', color: 'from-orange-500 to-amber-500' },
  { icon: Sparkles, label: 'AI Insights', value: '23', change: 'New', color: 'from-violet-500 to-purple-500' },
];

const chartData = [
  { name: 'Jan', value: 85 },
  { name: 'Feb', value: 88 },
  { name: 'Mar', value: 92 },
  { name: 'Apr', value: 90 },
  { name: 'May', value: 94 },
  { name: 'Jun', value: 96 },
];

const pieData = [
  { name: 'Excellent', value: 45 },
  { name: 'Good', value: 35 },
  { name: 'Average', value: 15 },
  { name: 'Below Average', value: 5 },
];

export default function Dashboard() {
  const { user } = useUser();
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user?.name || 'Admin'}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} hover gradient>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</h3>
                  <p className="text-green-500 text-sm mt-2">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6" />
          <div>
            <h3 className="font-semibold text-lg">AI Insight</h3>
            <p className="text-blue-100 mt-1">89% of students improved their performance this term. Top performers are in Science and Mathematics.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Attendance Trends</h3>
          <Chart type="bar" data={chartData} dataKey="value" xKey="name" />
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Student Performance</h3>
          <Chart type="pie" data={pieData} dataKey="value" />
        </Card>
      </div>

      <Card>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New student enrolled', name: 'Sarah Johnson', time: '5 minutes ago' },
            { action: 'Attendance marked', name: 'Class 10-A', time: '15 minutes ago' },
            { action: 'Report generated', name: 'Monthly Performance', time: '1 hour ago' },
            { action: 'Teacher added', name: 'Dr. Michael Chen', time: '2 hours ago' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.name}</p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
