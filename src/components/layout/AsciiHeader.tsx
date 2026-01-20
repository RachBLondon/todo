import Image from 'next/image';

export function AsciiHeader() {
  return (
    <div className="flex justify-center py-6">
      <Image
        src="/logo.png"
        alt="Locked In"
        width={200}
        height={60}
        priority
      />
    </div>
  );
}
