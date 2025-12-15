import { NextResponse } from 'next/server';
import { config } from './config';

export function checkApiEnvironment() {
  if (config.env === 'development') {
    return NextResponse.json(
      { error: 'API routes are disabled in development environment' },
      { status: 403 }
    );
  }
  return null;
}