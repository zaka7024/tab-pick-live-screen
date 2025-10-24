'use client';

import { useSettings } from '@/app/hooks/useSettings';
import type React from 'react';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoading } = useSettings();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <main>{children}</main>;
}
