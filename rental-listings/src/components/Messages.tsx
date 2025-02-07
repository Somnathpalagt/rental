import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

interface MessagesProps {
  receiverId: string; // User ID of the listing owner
}

export default function Messages({ receiverId }: MessagesProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: user } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to send messages.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: receiverId,
      content: message,
    });

    if (error) {
      toast.error('Failed to send message.');
    } else {
      toast.success('Message sent successfully!');
      setMessage('');
    }

    setLoading(false);
  }

  return (
    <form onSubmit={sendMessage} className="space-y-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 w-full rounded-md"
        rows={3}
        placeholder="Type your message..."
        required
      />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
