'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import useSWR from 'swr';
import { Settings } from '@/app/types/settings';

interface SettingsResponse {
  payload: Settings;
}

interface SettingsContextType {
  settings: Settings | undefined;
  isLoading: boolean;
  isError: Error | undefined;
  mutate: () => void;
  updateSettings: (settings: Partial<Settings>) => Promise<SettingsResponse>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  
  const data: SettingsResponse = await response.json();
  return data.payload;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
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

  const value: SettingsContextType = {
    settings: data,
    isLoading,
    isError: error,
    mutate,
    updateSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
}
