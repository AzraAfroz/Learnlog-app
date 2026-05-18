import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Search, Filter, Plus, Clock, BookOpen, Trash2, Edit } from 'lucide-react';
import { ListSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const JournalList = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [date, setDate] = useState('');

  const fetchEntries = async () => {
    setLoading(true);
    try {
      let queryParams = [];
      if (search) queryParams.push(`search=${search}`);
      if (difficulty) queryParams.push(`difficulty=${difficulty}`);
      if (date) queryParams.push(`date=${date}`);
      
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const res = await axiosInstance.get(`/journal/all${queryString}`);
      setEntries(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch journals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [search, difficulty, date]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axiosInstance.delete(`/journal/delete/${id}`);
        toast.success('Journal entry deleted');
        setEntries(entries.filter(entry => entry._id !== id));
      } catch (error) {
        toast.error('Failed to delete entry');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Learning Journals</h1>
          <p className="text-text-secondary mt-1">Track and manage your study progress.</p>
        </div>
        <Link to="/journals/add" className="btn-primary flex items-center justify-center flex-none w-full md:w-auto px-6 shadow-md whitespace-nowrap" style={{ width: 'fit-content' }}>
          <Plus size={20} className="mr-2" />
          Add Entry
        </Link>
      </div>

      <div className="glass p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search by topic name..."
            className="input-field w-full"
            style={{ paddingLeft: '2.5rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
              <Filter size={18} />
            </div>
            <select
              className="input-field w-full appearance-none"
              style={{ paddingLeft: '2.5rem' }}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <input
            type="date"
            className="input-field w-full sm:w-48 text-text-secondary"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <ListSkeleton />
      ) : entries.length === 0 ? (
        <div className="glass p-12 rounded-2xl flex flex-col items-center justify-center text-center">
          <BookOpen size={64} className="text-text-secondary opacity-30 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No entries found</h3>
          <p className="text-text-secondary max-w-md">
            {search || difficulty || date ? 'Try adjusting your filters to find what you are looking for.' : 'Start tracking your learning journey by adding your first journal entry.'}
          </p>
          {!(search || difficulty || date) && (
            <Link to="/journals/add" className="mt-6 text-primary hover:underline font-medium">
              Create your first entry
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <div key={entry._id} className="glass p-6 rounded-2xl flex flex-col hover:-translate-y-1 transition-transform group">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                  entry.difficultyLevel === 'easy' ? 'bg-success/10 text-success' :
                  entry.difficultyLevel === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                  'bg-error/10 text-error'
                }`}>
                  {entry.difficultyLevel.toUpperCase()}
                </span>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/journals/edit/${entry._id}`} className="text-text-secondary hover:text-primary transition-colors">
                    <Edit size={18} />
                  </Link>
                  <button onClick={() => handleDelete(entry._id)} className="text-text-secondary hover:text-error transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <Link to={`/journals/${entry._id}`} className="flex-1 block">
                <h3 className="text-xl font-bold text-text mb-2 line-clamp-1">{entry.topicName}</h3>
                <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                  {entry.description}
                </p>
              </Link>
              
              <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-sm text-text-secondary">
                <div className="flex items-center">
                  <Clock size={16} className="mr-1.5" />
                  {entry.studyDuration} mins
                </div>
                <div>
                  {new Date(entry.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalList;
