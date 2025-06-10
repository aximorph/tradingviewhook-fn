import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Activity, 
  Download, 
  Users, 
  Zap,
  TrendingUp,
  TrendingDown,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const data = [
  { name: 'Jan', signals: 400 },
  { name: 'Feb', signals: 300 },
  { name: 'Mar', signals: 600 },
  { name: 'Apr', signals: 800 },
  { name: 'May', signals: 500 },
  { name: 'Jun', signals: 900 },
  { name: 'Jul', signals: 1200 },
];

const metrics = [
  {
    name: 'Total Signals',
    value: '12,847',
    change: '+12%',
    trend: 'up',
    icon: Activity,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    name: 'DLLs Generated',
    value: '156',
    change: '+8%',
    trend: 'up',
    icon: Zap,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    name: 'Downloads',
    value: '2,847',
    change: '+23%',
    trend: 'up',
    icon: Download,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    name: 'Active Sessions',
    value: '48',
    change: '-3%',
    trend: 'down',
    icon: Users,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20'
  }
];

const recentActivity = [
  { id: 1, action: 'DLL Generated', details: 'Pro_EA_v2.dll created with HWID protection', time: '2 minutes ago' },
  { id: 2, action: 'Signal Sent', details: 'EURUSD BUY signal transmitted to 24 clients', time: '5 minutes ago' },
  { id: 3, action: 'Download Complete', details: 'MT5_Expert_v1.3.ex5 downloaded by user', time: '12 minutes ago' },
  { id: 4, action: 'Session Started', details: 'New WebSocket connection established', time: '18 minutes ago' },
  { id: 5, action: 'HWID Updated', details: 'Hardware ID updated for premium account', time: '1 hour ago' },
];

export const Overview: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
            <p className="text-blue-100">
              You're on the <span className="font-semibold capitalize">{user?.subscription}</span> plan. 
              Your signals are performing great today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 rounded-lg p-4">
              <TrendingUp className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`${metric.bgColor} ${metric.color} p-3 rounded-lg`}>
                <metric.icon className="h-6 w-6" />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {metric.change}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {metric.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Signal Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Signal Activity
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center">
              View Details
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="signals" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center">
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full p-2 mt-1">
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {activity.details}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};