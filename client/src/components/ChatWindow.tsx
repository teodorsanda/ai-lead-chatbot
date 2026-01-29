import React, { useState, useRef, useEffect } from 'react';
import { Message as MessageType, ScoringFactors } from '../types';
import { MessageCircle, Send, Loader } from 'lucide-react';
import '../styles/ChatWindow.css';

interface ChatWindowProps {
  onChatStart: (email: string, name: string, company?: string) => void;
  onMessageSend: (message: string) => Promise<any>;
  loading: boolean;
  messages: MessageType[];
  qualificationScore: number;
  scoringFactors: ScoringFactors | null;
  status: 'active' | 'completed' | 'rejected' | null;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  onChatStart,
  onMessageSend,
  loading,
  messages,
  qualificationScore,
  scoringFactors,
  status,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSetup, setShowSetup] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company: '',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.name) {
      onChatStart(formData.email, formData.name, formData.company);
      setShowSetup(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !loading) {
      const message = inputValue;
      setInputValue('');
      await onMessageSend(message);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <MessageCircle size={24} />
        <h2>PikaBot 🌊</h2>
      </div>

      <div className="chat-body">
        {showSetup ? (
          <form onSubmit={handleSetupSubmit} className="setup-form">
            <h3>🌊 Bine ai venit la Pikasea!</h3>
            <p className="setup-subtitle">Planifică-ți vacanța pe mare cu PikaBot</p>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplu.ro"
                required
              />
            </div>
            <div className="form-group">
              <label>Nume *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Numele tău"
                required
              />
            </div>
            <div className="form-group">
              <label>Telefon (opțional)</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="+40 7XX XXX XXX"
              />
            </div>
            <button type="submit" className="btn-primary">
              Începe conversația ⛵
            </button>
          </form>
        ) : (
          <>
            <div className="messages-container">
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.role}`}>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))}
              {loading && (
                <div className="message assistant">
                  <Loader size={20} className="spinner" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="qualification-info">
              <div className="score-bar">
                <div className="score-label">Qualification Score: {qualificationScore}%</div>
                <div className="score-fill" style={{ width: `${qualificationScore}%` }} />
              </div>

              {scoringFactors && (
                <div className="factors-grid">
                  <div className="factor">
                    <span className="factor-label">Budget</span>
                    <div className="factor-value">{scoringFactors.budget}</div>
                  </div>
                  <div className="factor">
                    <span className="factor-label">Timeline</span>
                    <div className="factor-value">{scoringFactors.timeline}</div>
                  </div>
                  <div className="factor">
                    <span className="factor-label">Need</span>
                    <div className="factor-value">{scoringFactors.needAlignment}</div>
                  </div>
                  <div className="factor">
                    <span className="factor-label">Engagement</span>
                    <div className="factor-value">{scoringFactors.engagement}</div>
                  </div>
                  <div className="factor">
                    <span className="factor-label">Authority</span>
                    <div className="factor-value">{scoringFactors.authority}</div>
                  </div>
                </div>
              )}

              {status && (
                <div className={`status-badge status-${status}`}>
                  Status: {status.toUpperCase()}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {!showSetup && (
        <div className="chat-footer">
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Scrie mesajul tău..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !inputValue.trim()}>
              {loading ? <Loader size={20} /> : <Send size={20} />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
