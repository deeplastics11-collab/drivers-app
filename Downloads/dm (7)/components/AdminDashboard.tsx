
import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../services/firebaseService';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Users, Calendar, Mail, MapPin, Wrench, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import BackButton from './BackButton';

interface AdminDashboardProps {
  onBack?: () => void;
}

interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  expertise: string;
  location: string;
  registeredAt: any;
  lastActiveAt: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const path = 'users';
      try {
        const q = query(collection(db, 'users'), orderBy('registeredAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const userList = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          userId: doc.id
        })) as UserProfile[];
        setUsers(userList);
      } catch (err: any) {
        handleFirestoreError(err, OperationType.LIST, path);
        setError('Failed to fetch users. Access denied.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-3xl m-6">
        <ShieldCheck className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-black text-red-500 uppercase">ACCESS RESTRICTED</h3>
        <p className="text-slate-400 text-sm mt-2 font-mono">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="shrink-0 px-6 pt-4 pb-4 bg-slate-950 border-b border-slate-900 flex items-center gap-3">
        {onBack && <BackButton onClick={onBack} />}
        <div className="min-w-0">
          <h2 className="text-base font-black text-white uppercase tracking-tight leading-none flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            Registered Users
          </h2>
        </div>
      </div>

      <div className="p-6 pb-24 overflow-y-auto flex-1">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
            Total count: {users.length}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {users.map((user, idx) => (
          <motion.div
            key={user.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-slate-100 font-bold text-lg">{user.displayName || 'Anonymous'}</h3>
                <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </div>
              </div>
              <div className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest">
                {user.expertise || 'Enthusiast'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800/50">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                  <MapPin className="w-3 h-3 text-slate-600" />
                  Location
                </div>
                <div className="text-slate-300 text-xs font-medium pl-5">
                  {user.location || 'Not specified'}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                  <Calendar className="w-3 h-3 text-slate-600" />
                  Registered
                </div>
                <div className="text-slate-300 text-xs font-medium pl-5 font-mono">
                  {user.registeredAt?.toDate?.() ? user.registeredAt.toDate().toLocaleDateString() : 'Unknown'}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
