'use client';

import React from 'react';
import { WalletSelector } from './walletSelector';
import { useSettings } from '@coordinator/settings/src/application/context/settingsContext';

export function WalletConnection() {
  const { isLocal } = useSettings();

  if (isLocal) {
    return null;
  }

  return (
    <div className="flex items-center">
      <WalletSelector />
    </div>
  );
}