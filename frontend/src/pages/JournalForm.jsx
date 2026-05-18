import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

const JournalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    topicName: '',
    description: '',
    studyDuration: '',
    difficultyLevel: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchJournal = async () => {
        try {
          const res = await axiosInstance.get(`/journal/${id}`);
          setFormData({
            topicName: res.data.data.topicName,
            description: res.data.data.description,
            studyDuration: res.data.data.studyDuration,
            difficultyLevel: res.data.data.difficultyLevel
          });
        } catch (error) {
          toast.error('Failed to fetch journal entry');
          navigate('/journals');
        } finally {
          setFetching(false);
        }
      };
      fetchJournal();
    }
  }, [id, navigate, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.topicName || !formData.description || !formData.studyDuration) {
      return toast.error('Please fill in all required fields');
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await axiosInstance.put(`/journal/update/${id}`, formData);
        toast.success('Journal entry updated successfully');
      } else {
        await axiosInstance.post('/journal/add', formData);
        toast.success('Journal entry added successfully');
      }
      navigate('/journals');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center space-x-4 mb-8">
        <Link to="/journals" className="p-2 rounded-full hover:bg-surface transition-colors text-text-secondary hover:text-primary">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text">{isEditMode ? 'Edit Journal Entry' : 'Add New Entry'}</h1>
          <p className="text-text-secondary mt-1">
            {isEditMode ? 'Update your learning progress details.' : 'Document what you learned today.'}
          </p>
        </div>
      </div>

      <div className="glass rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Topic Name *</label>
            <input
              type="text"
              name="topicName"
              className="input-field"
              placeholder="e.g., React Hooks, Node.js Event Loop"
              value={formData.topicName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Study Duration (Minutes) *</label>
              <input
                type="number"
                name="studyDuration"
                min="1"
                className="input-field"
                placeholder="e.g., 60"
                value={formData.studyDuration}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Difficulty Level *</label>
              <select
                name="difficultyLevel"
                className="input-field"
                value={formData.difficultyLevel}
                onChange={handleChange}
                required
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Description / Notes *</label>
            <textarea
              name="description"
              rows="6"
              className="input-field resize-none"
              placeholder="What did you learn? What were the key takeaways?"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-border/50">
            <button
              type="button"
              onClick={() => navigate('/journals')}
              className="px-6 py-2.5 rounded-lg text-text-secondary font-medium hover:bg-surface transition-colors mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center w-auto px-8"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  {isEditMode ? 'Update Entry' : 'Save Entry'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JournalForm;
