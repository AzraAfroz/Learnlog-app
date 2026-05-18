import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { ArrowLeft, Clock, Calendar, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const JournalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await axiosInstance.get(`/journal/${id}`);
        setEntry(res.data.data);
      } catch (error) {
        toast.error('Failed to load entry details');
        navigate('/journals');
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axiosInstance.delete(`/journal/delete/${id}`);
        toast.success('Journal entry deleted');
        navigate('/journals');
      } catch (error) {
        toast.error('Failed to delete entry');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (!entry) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <Link to="/journals" className="flex items-center text-text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Back to Journals
        </Link>
        <div className="flex space-x-3">
          <Link to={`/journals/edit/${entry._id}`} className="px-4 py-2 bg-surface text-text rounded-lg border border-border hover:bg-surface/80 flex items-center transition-colors">
            <Edit size={16} className="mr-2" />
            Edit
          </Link>
          <button onClick={handleDelete} className="px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 flex items-center transition-colors">
            <Trash2 size={16} className="mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl p-8 md:p-10 shadow-sm border border-border/50">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-md mb-4 ${
              entry.difficultyLevel === 'easy' ? 'bg-success/10 text-success' :
              entry.difficultyLevel === 'medium' ? 'bg-orange-500/10 text-orange-500' :
              'bg-error/10 text-error'
            }`}>
              {entry.difficultyLevel.toUpperCase()}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-text leading-tight">{entry.topicName}</h1>
          </div>
          
          <div className="flex flex-col space-y-3 shrink-0 bg-surface/50 p-4 rounded-xl border border-border/30">
            <div className="flex items-center text-text-secondary">
              <Calendar size={18} className="mr-3 text-primary" />
              <span className="font-medium">{new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center text-text-secondary">
              <Clock size={18} className="mr-3 text-primary" />
              <span className="font-medium">{entry.studyDuration} minutes of study</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 mt-4">
          <h3 className="text-lg font-semibold text-text mb-4">Learning Notes</h3>
          <div className="prose prose-slate max-w-none text-text-secondary leading-relaxed whitespace-pre-wrap">
            {entry.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalDetail;
