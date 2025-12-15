import { NextResponse } from 'next/server';
import { config } from './config';

export function checkApiEnvironment() {
  if (config.env === 'local') {
    return NextResponse.json(
      { error: 'API routes are disabled in local environment' },
      { status: 403 }
    );
  }
  return null;
}