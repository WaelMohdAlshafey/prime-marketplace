'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';

export default function ClientAuthWrapper({ children }: { children: ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
}