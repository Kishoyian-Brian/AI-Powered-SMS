import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Users,
  GraduationCap,
  BarChart3,
  Brain,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Clock,
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations and analytics to improve student performance.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      title: 'Student Management',
      description: 'Easily manage student records, enrollment, and academic information.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track performance metrics and generate comprehensive reports.',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: GraduationCap,
      title: 'Teacher Portal',
      description: 'Empower teachers with tools to manage classes and track progress.',
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: Clock,
      title: 'Attendance Tracking',
      description: 'Monitor attendance in real-time with automated notifications.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security to protect your sensitive data.',
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Students Managed' },
    { value: '500+', label: 'Schools Trust Us' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];

  const benefits = [
    'Automated attendance tracking and reporting',
    'Real-time performance analytics',
    'AI-powered student insights',
    'Customizable dashboards',
    'Mobile-friendly interface',
    'Secure cloud storage',
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                AI-SMS
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Sign In
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="px-6 py-2 gradient-primary text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  AI-Powered School Management
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                Transform Your School
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  With AI Intelligence
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                Streamline student management, track performance, and gain intelligent insights
                with our cutting-edge AI-powered platform designed for modern education.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 gradient-primary text-white rounded-xl font-semibold text-lg shadow-2xl hover:shadow-xl transition-all flex items-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold text-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-cyan-500 transition-all"
                >
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 opacity-10 dark:opacity-5">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <BookOpen className="w-16 h-16 text-blue-500 dark:text-blue-400" />
            </motion.div>
          </div>
          <div className="absolute bottom-20 right-10 opacity-10 dark:opacity-5">
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <TrendingUp className="w-20 h-20 text-cyan-500 dark:text-cyan-400" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="gradient-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <h3 className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-blue-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Modern Schools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage your educational institution efficiently
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white dark:bg-gray-800 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose AI-SMS?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Join hundreds of schools already benefiting from our intelligent platform
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                  <Zap className="w-16 h-16 text-white mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Boost Efficiency by 300%
                  </h3>
                  <p className="text-blue-100 mb-6">
                    Schools using AI-SMS report significant improvements in administrative
                    efficiency and student outcomes.
                  </p>
                  <div className="flex items-center gap-4 text-white">
                    <div>
                      <div className="text-3xl font-bold">95%</div>
                      <div className="text-sm text-blue-100">Satisfaction Rate</div>
                    </div>
                    <div className="h-12 w-px bg-white/30"></div>
                    <div>
                      <div className="text-3xl font-bold">4.9/5</div>
                      <div className="text-sm text-blue-100">Average Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-primary rounded-3xl p-12 sm:p-16 text-center shadow-2xl"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Transform Your School?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of educators who trust AI-SMS to manage their schools efficiently
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-10 py-4 bg-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-2"
              style={{ color: 'var(--color-primary)' }}
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <p className="text-blue-100 mt-4">No credit card required • Free 30-day trial</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 border-t border-gray-700 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AI-SMS</span>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">© 2025 AI-SMS. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


