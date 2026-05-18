import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { CardSkeleton, ChartSkeleton, ListSkeleton } from '../components/LoadingSkeleton';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [recentTopics, setRecentTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, weeklyRes, recentRes] = await Promise.all([
          axiosInstance.get('/dashboard/stats'),
          axiosInstance.get('/dashboard/weekly-summary'),
          axiosInstance.get('/dashboard/recent-topics')
        ]);
        setStats(statsRes.data.data);
        setWeeklyData(weeklyRes.data.data);
        setRecentTopics(recentRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><ChartSkeleton /></div>
          <div><ListSkeleton /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text">Welcome back, {user?.name.split(' ')[0]}!</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl flex items-center justify-between hover:-translate-y-1 transition-transform">
          <div>
            <p className="text-text-secondary font-medium">Total Entries</p>
            <h3 className="text-3xl font-bold text-text mt-2">{stats?.totalEntries || 0}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <BookOpen size={24} />
          </div>
        </div>

        <div className="glass p-6 rounded-2xl flex items-center justify-between hover:-translate-y-1 transition-transform">
          <div>
            <p className="text-text-secondary font-medium">Study Hours</p>
            <h3 className="text-3xl font-bold text-text mt-2">{stats?.totalStudyHours || 0}h</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center text-success">
            <Clock size={24} />
          </div>
        </div>

        <div className="glass p-6 rounded-2xl flex items-center justify-between hover:-translate-y-1 transition-transform">
          <div>
            <p className="text-text-secondary font-medium">Productivity</p>
            <h3 className="text-3xl font-bold text-text mt-2">
              {stats?.totalEntries > 0 ? Math.round((stats.totalStudyHours / stats.totalEntries) * 60) : 0}m/entry
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="glass p-6 rounded-2xl lg:col-span-2">
          <h3 className="text-xl font-bold mb-6">Weekly Learning Summary</h3>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="dayName" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)' }} />
                <Tooltip
                  cursor={{ fill: 'var(--color-primary)', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                />
                <Bar dataKey="duration" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Recent Topics</h3>
          </div>
          {recentTopics.length > 0 ? (
            <div className="space-y-4">
              {recentTopics.map((topic) => (
                <div key={topic._id} className="p-4 rounded-xl border border-border/50 hover:bg-surface/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-text truncate max-w-37.5">{topic.topicName}</h4>
                      <p className="text-sm text-text-secondary mt-1">{new Date(topic.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${topic.difficultyLevel === 'easy' ? 'bg-success/10 text-success' :
                        topic.difficultyLevel === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                          'bg-error/10 text-error'
                      }`}>
                      {topic.difficultyLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-62.5 text-text-secondary">
              <BookOpen size={48} className="mb-4 opacity-20" />
              <p>No recent topics found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
