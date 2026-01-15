import { redirect } from 'next/navigation';

export default function LoginPage() {
  // Authentication UI is temporarily disabled — redirect to detect
  redirect('/detect');
}