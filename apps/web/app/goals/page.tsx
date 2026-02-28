import type { Metadata } from 'next';
import GoalsPageClient from './GoalsPageClient';


export const metadata: Metadata = {
  title: 'Goals | FinEase',
  description: 'Track your financial milestones and savings gaps.',
};

export default function Page() {
  return <GoalsPageClient />;
}
