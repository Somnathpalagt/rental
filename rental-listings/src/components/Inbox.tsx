import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export default function Inbox() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const { data: user } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to view messages.');
      return;
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch messages.');
    } else {
      setMessages(data);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Inbox</h2>
      {messages.length === 0 ? (
        <p className="text-gray-600">No messages yet.</p>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="p-4 border-b">
            <p className="text-gray-900">{msg.content}</p>
            <p className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}
