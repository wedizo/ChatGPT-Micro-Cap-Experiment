import { ResearchRequest, ResearchResult } from '../types';

const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? '/api' 
  : 'http://localhost:8000/api';

export const generateResearch = async (request: ResearchRequest): Promise<ResearchResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/research`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Research API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Research API error:', error);
    throw new Error('Failed to generate research. Please check your connection and try again.');
  }
};

export const getResearchHistory = async (): Promise<ResearchResult[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/research/history`);
    
    if (!response.ok) {
      throw new Error(`Research history API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Research history API error:', error);
    return [];
  }
};