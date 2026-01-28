import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const chatAPI = {
  sendMessage: async (
    leadId: string | undefined,
    sessionToken: string | undefined,
    leadEmail: string | undefined,
    leadName: string | undefined,
    leadCompany: string | undefined,
    message: string
  ) => {
    const response = await axios.post(`${API_URL}/chat/message`, {
      leadId,
      sessionToken,
      leadEmail,
      leadName,
      leadCompany,
      message,
    });
    return response.data;
  },

  getConversation: async (conversationId: string) => {
    const response = await axios.get(`${API_URL}/chat/conversation/${conversationId}`);
    return response.data;
  },
};

export const leadsAPI = {
  getLeads: async (qualified?: boolean, limit?: number, offset?: number) => {
    const response = await axios.get(`${API_URL}/leads`, {
      params: { qualified, limit, offset },
    });
    return response.data;
  },

  getLead: async (leadId: string) => {
    const response = await axios.get(`${API_URL}/leads/${leadId}`);
    return response.data;
  },

  getMetrics: async () => {
    const response = await axios.get(`${API_URL}/leads/metrics/conversion`);
    return response.data;
  },
};

export const qualificationAPI = {
  getDetails: async (leadId: string) => {
    const response = await axios.get(`${API_URL}/qualification/lead/${leadId}`);
    return response.data;
  },

  complete: async (leadId: string, status: string, notes?: string) => {
    const response = await axios.post(`${API_URL}/qualification/complete/${leadId}`, {
      status,
      notes,
    });
    return response.data;
  },
};

export const fineTuningAPI = {
  getData: async (limit?: number, offset?: number, outcome?: string) => {
    const response = await axios.get(`${API_URL}/fine-tuning/data`, {
      params: { limit, offset, outcome },
    });
    return response.data;
  },

  exportJsonl: async (outcome?: string) => {
    const response = await axios.get(`${API_URL}/fine-tuning/export/jsonl`, {
      params: { outcome },
      responseType: 'blob',
    });
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get(`${API_URL}/fine-tuning/stats`);
    return response.data;
  },

  record: async (conversationId: string, messages: any[], outcome: string, feedback?: string) => {
    const response = await axios.post(`${API_URL}/fine-tuning/record`, {
      conversationId,
      messages,
      outcome,
      feedback,
    });
    return response.data;
  },
};
