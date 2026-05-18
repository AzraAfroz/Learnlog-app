import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('Verifying your email, please wait...');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing.');
        return;
      }

      try {
        const res = await api.get(`/auth/verify/${token}`);
        setStatus('success');
        setMessage(res.data.message || 'Email verified successfully. Redirecting to login...');
        toast.success('Email verified successfully.');
        setTimeout(() => navigate('/login'), 2500);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Email verification failed.');
        toast.error(error.response?.data?.message || 'Email verification failed.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass max-w-lg w-full p-8 rounded-2xl text-center">
        <div className="mb-6">
          {status === 'pending' && <Loader2 className="mx-auto h-14 w-14 animate-spin text-primary" />}
          {status === 'success' && <CheckCircle className="mx-auto h-14 w-14 text-emerald-500" />}
          {status === 'error' && <XCircle className="mx-auto h-14 w-14 text-red-500" />}
        </div>
        <h1 className="text-3xl font-bold mb-3">
          {status === 'success' ? 'Email Verified' : status === 'error' ? 'Verification Failed' : 'Verifying...'}
        </h1>
        <p className="text-text-secondary mb-6">{message}</p>
        <div className="space-x-3">
          <Link to="/login" className="btn-primary px-6 py-2">
            Go to Login
          </Link>
          <Link to="/" className="px-6 py-2 border border-border rounded-lg text-text hover:bg-surface transition-colors">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
