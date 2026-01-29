import React, { useState, useEffect } from 'react';
import { fineTuningAPI } from '../services/api';
import { Download, BarChart3, TrendingUp } from 'lucide-react';
import '../styles/FineTuning.css';

export const FineTuningPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<string | undefined>(undefined);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, fineTuningData] = await Promise.all([
        fineTuningAPI.getStats(),
        fineTuningAPI.getData(100, 0, selectedOutcome),
      ]);
      setStats(statsData);
      setData(fineTuningData.data);
    } catch (error) {
      console.error('Failed to load fine-tuning data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOutcome]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await fineTuningAPI.exportJsonl(selectedOutcome);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'fine-tuning-data.jsonl';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fine-tuning-page">
      <div className="page-header">
        <h1>Fine-Tuning Data Management</h1>
        <button onClick={handleExport} disabled={exporting} className="btn-export">
          <Download size={20} />
          {exporting ? 'Exporting...' : 'Export JSONL'}
        </button>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total_records}</div>
              <div className="stat-label">Total Records</div>
            </div>
          </div>

          <div className="stat-card qualified">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.qualified_count}</div>
              <div className="stat-label">Qualified</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-value">{stats.rejected_count}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-value">{stats.escalated_count}</div>
              <div className="stat-label">Escalated</div>
            </div>
          </div>

          <div className="stat-card highlight">
            <div className="stat-content">
              <div className="stat-value">{stats.qualification_rate}%</div>
              <div className="stat-label">Qualification Rate</div>
            </div>
          </div>
        </div>
      )}

      <div className="filter-section">
        <h2>Filter by Outcome</h2>
        <div className="filter-buttons">
          <button
            className={selectedOutcome === undefined ? 'active' : ''}
            onClick={() => setSelectedOutcome(undefined)}
          >
            All Data
          </button>
          <button
            className={selectedOutcome === 'qualified' ? 'active' : ''}
            onClick={() => setSelectedOutcome('qualified')}
          >
            Qualified
          </button>
          <button
            className={selectedOutcome === 'rejected' ? 'active' : ''}
            onClick={() => setSelectedOutcome('rejected')}
          >
            Rejected
          </button>
          <button
            className={selectedOutcome === 'escalated' ? 'active' : ''}
            onClick={() => setSelectedOutcome('escalated')}
          >
            Escalated
          </button>
        </div>
      </div>

      <div className="data-section">
        <h2>Fine-Tuning Records</h2>
        {loading ? (
          <div className="loading">Loading data...</div>
        ) : data.length === 0 ? (
          <div className="empty-state">No fine-tuning data available</div>
        ) : (
          <div className="data-table">
            {data.map((record, idx) => (
              <div key={record.id || idx} className="data-row">
                <div className="row-header">
                  <span className="outcome-badge" style={{
                    backgroundColor: record.outcome === 'qualified' ? '#10b981' : 
                                    record.outcome === 'rejected' ? '#ef4444' : '#f59e0b'
                  }}>
                    {record.outcome}
                  </span>
                  <span className="timestamp">
                    {new Date(record.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="row-content">
                  <div className="messages-preview">
                    {record.messages.slice(0, 2).map((msg: any, i: number) => (
                      <div key={i} className={`preview-msg ${msg.role}`}>
                        <strong>{msg.role}:</strong> {msg.content.substring(0, 100)}...
                      </div>
                    ))}
                  </div>
                  {record.feedback && (
                    <div className="feedback">
                      <strong>Feedback:</strong> {record.feedback}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
