import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export default function Card({ children, className = '', hover = false, gradient = false }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' } : {}}
      className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6
        ${gradient ? 'bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
