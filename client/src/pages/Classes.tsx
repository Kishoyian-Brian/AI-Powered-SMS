import { motion } from 'framer-motion';
import { BookOpen, Users, Clock } from 'lucide-react';
import Card from '../components/Card';

const classesData = [
  { id: 1, name: 'Class 10-A', teacher: 'Dr. Robert Smith', subject: 'Mathematics', students: 35, schedule: 'Mon, Wed, Fri - 9:00 AM' },
  { id: 2, name: 'Class 10-B', teacher: 'Prof. Emily Johnson', subject: 'Physics', students: 32, schedule: 'Tue, Thu - 10:00 AM' },
  { id: 3, name: 'Class 11-A', teacher: 'Ms. Sarah Williams', subject: 'Chemistry', students: 30, schedule: 'Mon, Wed - 11:00 AM' },
  { id: 4, name: 'Class 11-B', teacher: 'Mr. Michael Brown', subject: 'English', students: 33, schedule: 'Tue, Thu, Fri - 2:00 PM' },
  { id: 5, name: 'Class 12-A', teacher: 'Dr. Jennifer Davis', subject: 'Biology', students: 28, schedule: 'Mon, Thu - 1:00 PM' },
  { id: 6, name: 'Class 12-B', teacher: 'Prof. David Miller', subject: 'History', students: 31, schedule: 'Wed, Fri - 3:00 PM' },
];

export default function Classes() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Classes</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage class schedules and assignments</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classesData.map((cls, idx) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card hover className="h-full">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{cls.name}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">{cls.subject}</p>
                </div>
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{cls.students} Students</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{cls.schedule}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Teacher:</span> {cls.teacher}
                  </p>
                </div>
              </div>

              <button className="w-full mt-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-medium">
                View Details
              </button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
