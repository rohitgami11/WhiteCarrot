'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const router = useRouter();

  const handleSignIn = async () => {
    const res = await signIn('google', {
      callbackUrl: '/events',  // Redirect to the events page after successful sign-in
    });

    // Manually navigate to the events page if needed (optional)
    if (res?.url) {
      router.push(res.url);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
    >
      Connect Google Calendar
    </button>
  );
}
