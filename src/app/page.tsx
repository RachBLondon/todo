import Image from 'next/image';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center landing-bg px-6">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div>
          <Image
            src="/logo.png"
            alt="Locked In"
            width={240}
            height={72}
            priority
            className="mx-auto"
          />
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-lofi-dark mb-3">
          build momentum,<br />one day at a time.
        </h1>

        {/* Subheading */}
        <p className="text-base text-lofi-muted mb-8 max-w-sm mx-auto leading-relaxed">
          Simple daily tasks and habits.<br />
          Stay consistent. Watch your streak grow.
        </p>

        {/* CTA Button */}
        <GoogleSignInButton />

        {/* Footer note */}
        <p className="mt-10 text-xs text-lofi-muted/60">
          Weekdays only. Weekends are for rest.
        </p>
      </div>
    </div>
  );
}
