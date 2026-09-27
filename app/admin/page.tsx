import type { Metadata } from 'next';
import AdminPanel from './AdminPanel';
import './admin.css';

export const metadata: Metadata = {
  title: 'Media Admin | NXT Academy',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPanel />;
}

