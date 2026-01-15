import { redirect } from 'next/navigation';

export default function SignupPage() {
  // Signup UI disabled — redirect to detect
  redirect('/detect');
}

