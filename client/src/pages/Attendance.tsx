import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';

const attendanceData = [
  { id: 1, name: 'John Doe', class: '10-A', date: '2025-10-12', status: 'Present' },
  { id: 2, name: 'Emma Wilson', class: '10-B', date: '2025-10-12', status: 'Present' },
  { id: 3, name: 'Michael Brown', class: '11-A', date: '2025-10-12', status: 'Absent' },
  { id: 4, name: 'Sarah Davis', class: '11-B', date: '2025-10-12', status: 'Present' },
  { id: 5, name: 'James Miller', class: '12-A', date: '2025-10-12', status: 'Present' },
];

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState('2025-10-12');
  const [selectedClass, setSelectedClass] = useState('All');

  const columns = [
    { key: 'name', label: 'Student Name' },
    { key: 'class', label: 'Class' },
    { key: 'date', label: 'Date' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`flex items-center gap-2 ${value === 'Present' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {value === 'Present' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {value}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm">
            Mark Present
          </button>
          <button className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm">
            Mark Absent
          </button>
        </div>
      ),
    },
  ];

  const filteredData = attendanceData.filter((record) =>
    selectedClass === 'All' || record.class === selectedClass
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage student attendance</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Present Today</p>
              <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">94.2%</h3>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </Card>
        <Card gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Absent Today</p>
              <h3 className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">5.8%</h3>
            </div>
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
        </Card>
        <Card gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Students</p>
              <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">2,847</h3>
            </div>
            <Calendar className="w-12 h-12 text-blue-500" />
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>10-A</option>
              <option>10-B</option>
              <option>11-A</option>
              <option>11-B</option>
              <option>12-A</option>
            </select>
          </div>
        </div>

        <Table columns={columns} data={filteredData} />
      </Card>
    </div>
  );
}
