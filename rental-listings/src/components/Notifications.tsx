import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { Bell } from 'lucide-react';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();

    // Listen for real-time notifications
    const subscription = supabase
      .channel('realtime-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
          toast.success('New notification received!');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchNotifications() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    }
  }

  async function markAsRead(id: string) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    setUnreadCount((prev) => prev - 1);
  }

  return (
    <div className="relative">
      <button className="relative">
        <Bell className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md">
        {notifications.length === 0 ? (
          <p className="text-gray-600 p-4">No notifications</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b cursor-pointer ${notification.is_read ? 'bg-gray-100' : 'bg-white'}`}
              onClick={() => markAsRead(notification.id)}
            >
              <p className="text-gray-900">{notification.message}</p>
              <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
