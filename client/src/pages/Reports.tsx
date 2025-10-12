import { motion } from 'framer-motion';
import { FileText, Download, Sparkles } from 'lucide-react';
import Card from '../components/Card';
import Chart from '../components/Chart';

const performanceData = [
  { name: 'Math', value: 87 },
  { name: 'Science', value: 92 },
  { name: 'English', value: 85 },
  { name: 'History', value: 79 },
  { name: 'Physics', value: 88 },
];

const monthlyData = [
  { name: 'Jan', value: 82 },
  { name: 'Feb', value: 85 },
  { name: 'Mar', value: 88 },
  { name: 'Apr', value: 86 },
  { name: 'May', value: 90 },
  { name: 'Jun', value: 92 },
];

export default function Reports() {
  const handleGenerateReport = () => {
    console.log('Generating AI report...');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Analytics and performance insights</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateReport}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Generate AI Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Download className="w-5 h-5" />
            Export
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-xl mb-2">AI-Generated Insights</h3>
            <p className="text-blue-100 leading-relaxed">
              Based on the analysis of student performance data over the past semester, the AI system has identified
              that 89% of students have shown improvement in their overall grades. Mathematics and Science departments
              are performing exceptionally well, with average scores increasing by 15% compared to the previous term.
              The system recommends focusing additional resources on the History and English departments to maintain
              balanced academic growth.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">High Performance</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">Positive Trend</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">Action Required</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card gradient>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Average Score</p>
            <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">87.5%</h3>
            <p className="text-green-500 text-sm mt-2">+5.2% from last term</p>
          </div>
        </Card>
        <Card gradient>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Pass Rate</p>
            <h3 className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">96.3%</h3>
            <p className="text-green-500 text-sm mt-2">+3.1% from last term</p>
          </div>
        </Card>
        <Card gradient>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Top Performers</p>
            <h3 className="text-4xl font-bold text-orange-600 dark:text-orange-400 mt-2">342</h3>
            <p className="text-green-500 text-sm mt-2">+18% from last term</p>
          </div>
        </Card>
        <Card gradient>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Improvement Rate</p>
            <h3 className="text-4xl font-bold text-cyan-600 dark:text-cyan-400 mt-2">89%</h3>
            <p className="text-green-500 text-sm mt-2">+12% from last term</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Subject Performance</h3>
          <Chart type="bar" data={performanceData} dataKey="value" xKey="name" />
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Monthly Trends</h3>
          <Chart type="bar" data={monthlyData} dataKey="value" xKey="name" colors={['#06b6d4']} />
        </Card>
      </div>

      <Card>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Available Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            'Monthly Performance Report',
            'Attendance Summary',
            'Subject-wise Analysis',
            'Teacher Performance',
            'Student Progress Report',
            'AI Recommendations',
          ].map((report, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-gray-900 dark:text-white">{report}</span>
              </div>
              <Download className="w-4 h-4 text-gray-400" />
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
