'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ShopRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/games');
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-slate-400 font-mono text-sm">
      Redirecting to Gully Games Vault...
    </div>
  );
}
