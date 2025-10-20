import useSWR from 'swr';
import { Settings } from '@/app/types/settings';

interface SettingsResponse {
  payload: Settings;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  
  const data: SettingsResponse = await response.json();
  return data.payload;
};

export function useSettings() {
  const { data, error, isLoading, mutate } = useSWR<Settings>(
    '/api/settings',
    fetcher,
  );

  const updateSettings = async (settings: Partial<Settings>) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      await mutate();
      
      return await response.json();
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  return {
    settings: data,
    isLoading,
    isError: error,
    mutate,
    updateSettings,
  };
}

