import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../../components/Card';

export default function TeacherAssignments() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assignments</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage assignments</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Coming Soon!</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              This feature is currently under development. Stay tuned for updates!
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

