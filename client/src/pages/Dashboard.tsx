import React, { useState, useEffect } from 'react';
import { leadsAPI, qualificationAPI } from '../services/api';
import { Lead } from '../types';
import { TrendingUp, Users, CheckCircle, XCircle } from 'lucide-react';
import '../styles/Dashboard.css';

export const Dashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'qualified'>('all');

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const leadsData = await leadsAPI.getLeads(filter === 'qualified');
      setLeads(leadsData.leads);
      setMetrics(leadsData.metrics);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'in-progress':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="dashboard">
      <h1>Lead Qualification Dashboard</h1>

      {metrics && (
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">
              <Users size={24} />
            </div>
            <div className="metric-content">
              <div className="metric-value">{metrics.total_leads}</div>
              <div className="metric-label">Total Leads</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon qualified">
              <CheckCircle size={24} />
            </div>
            <div className="metric-content">
              <div className="metric-value">{metrics.qualified_leads}</div>
              <div className="metric-label">Qualified Leads</div>
              <div className="metric-percent">
                {metrics.total_leads > 0
                  ? ((metrics.qualified_leads / metrics.total_leads) * 100).toFixed(1)
                  : 0}
                %
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon rejected">
              <XCircle size={24} />
            </div>
            <div className="metric-content">
              <div className="metric-value">{metrics.rejected_leads}</div>
              <div className="metric-label">Rejected Leads</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <TrendingUp size={24} />
            </div>
            <div className="metric-content">
              <div className="metric-value">{parseFloat(metrics.avg_score).toFixed(1)}</div>
              <div className="metric-label">Avg Score</div>
            </div>
          </div>
        </div>
      )}

      <div className="leads-section">
        <div className="section-header">
          <h2>Recent Leads</h2>
          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All Leads
            </button>
            <button
              className={filter === 'qualified' ? 'active' : ''}
              onClick={() => setFilter('qualified')}
            >
              Qualified Only
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="empty-state">No leads found</div>
        ) : (
          <div className="leads-table">
            <div className="table-header">
              <div className="col-name">Name</div>
              <div className="col-email">Email</div>
              <div className="col-company">Company</div>
              <div className="col-score">Score</div>
              <div className="col-status">Status</div>
            </div>
            {leads.map((lead) => (
              <div key={lead.id} className="table-row">
                <div className="col-name">{lead.name}</div>
                <div className="col-email">{lead.email}</div>
                <div className="col-company">{lead.company || '-'}</div>
                <div className="col-score">{lead.qualificationScore}</div>
                <div
                  className="col-status"
                  style={{
                    color: getStatusColor(lead.qualificationStatus),
                    fontWeight: 500,
                  }}
                >
                  {lead.qualificationStatus}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
