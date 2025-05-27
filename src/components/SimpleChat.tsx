"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Message {
  id: number;
  issue_slug: string;
  sender_name: string;
  message: string;
  created_at: string;
}

interface SimpleChatProps {
  issueSlug: string;
}

export default function SimpleChat({ issueSlug }: SimpleChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderName, setSenderName] = useState('TestUser');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 기존 메시지 로드
    const loadMessages = async () => {
      console.log('📥 Loading messages for:', issueSlug);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('issue_slug', issueSlug)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Error loading messages:', error);
        return;
      }

      console.log('✅ Loaded messages:', data?.length || 0);
      setMessages(data || []);
    };

    loadMessages();

    // 실시간 구독
    console.log('🔄 Setting up realtime subscription');
    const channel = supabase
      .channel(`chat-${issueSlug}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `issue_slug=eq.${issueSlug}`
        },
        (payload) => {
          console.log('🔥 NEW MESSAGE RECEIVED:', payload);
          const newMsg = payload.new as Message;
          setMessages(prev => {
            console.log('📝 Adding message to state. Current count:', prev.length);
            return [...prev, newMsg];
          });
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
      });

    return () => {
      console.log('🧹 Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [issueSlug]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    console.log('📤 Sending message:', newMessage);

    const { data, error } = await supabase
      .from('chat_messages')
      .insert([
        {
          issue_slug: issueSlug,
          sender_name: senderName,
          message: newMessage,
          ip_address: 'test-ip',
        },
      ])
      .select();

    if (error) {
      console.error('❌ Error sending message:', error);
    } else {
      console.log('✅ Message sent successfully:', data);
      setNewMessage('');
    }

    setIsLoading(false);
  };

  return (
    <div className="border rounded-lg p-4 max-w-md mx-auto">
      <h3 className="font-bold mb-4">Simple Chat Test</h3>
      
      <div className="h-48 overflow-y-auto border rounded p-2 mb-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2 p-2 bg-white rounded text-sm">
            <strong>{msg.sender_name}:</strong> {msg.message}
            <div className="text-xs text-gray-500">
              {new Date(msg.created_at).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="space-y-2">
        <input
          type="text"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder="Your name"
          className="w-full p-2 border rounded text-sm"
        />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-2 border rounded text-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !newMessage.trim()}
          className="w-full p-2 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        Messages: {messages.length} | Issue: {issueSlug}
      </div>
    </div>
  );
} 