import React, { useState } from 'react';
import { chatAPI } from '../services/api';
import { Message as MessageType, Lead, ScoringFactors } from '../types';
import { ChatWindow } from '../components/ChatWindow';
import '../styles/ChatPage.css';

export const ChatPage: React.FC = () => {
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [qualificationScore, setQualificationScore] = useState(0);
  const [scoringFactors, setScoringFactors] = useState<ScoringFactors | null>(null);
  const [status, setStatus] = useState<'active' | 'completed' | 'rejected' | null>(null);

  const handleChatStart = (email: string, name: string, company?: string) => {
    setCurrentLead({
      id: '',
      email,
      name,
      company,
      qualificationScore: 0,
      qualificationStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setMessages([]);
    setStatus('active');
  };

  const handleMessageSend = async (message: string) => {
    if (!currentLead) return;

    try {
      setLoading(true);

      // Add user message to local state
      const userMessage: MessageType = {
        id: Math.random().toString(),
        conversationId: conversationId || '',
        role: 'user',
        content: message,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Send to API
      const response = await chatAPI.sendMessage(
        currentLead.id,
        sessionToken || undefined,
        currentLead.email,
        currentLead.name,
        currentLead.company,
        message
      );

      // Update state with response
      setCurrentLead({
        ...currentLead,
        id: response.leadId,
      });
      setSessionToken(response.sessionToken);
      setConversationId(response.conversationId);
      setQualificationScore(response.qualificationScore);
      setScoringFactors(response.scoringFactors);

      // Add assistant message
      const assistantMessage: MessageType = {
        id: Math.random().toString(),
        conversationId: response.conversationId,
        role: 'assistant',
        content: response.message,
        metadata: {
          qualificationScore: response.qualificationScore,
          scoringFactors: response.scoringFactors,
        },
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Update status
      if (response.recommendation === 'qualified') {
        setStatus('completed');
      } else if (response.recommendation === 'rejected') {
        setStatus('rejected');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-page">
      <ChatWindow
        onChatStart={handleChatStart}
        onMessageSend={handleMessageSend}
        loading={loading}
        messages={messages}
        qualificationScore={qualificationScore}
        scoringFactors={scoringFactors}
        status={status}
      />
    </div>
  );
};
