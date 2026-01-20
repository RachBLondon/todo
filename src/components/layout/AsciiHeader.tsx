import { HEADER_ASCII } from '@/lib/utils/ascii';

export function AsciiHeader() {
  return (
    <div className="flex justify-center py-6">
      <pre className="ascii-art text-center">
        {HEADER_ASCII}
      </pre>
    </div>
  );
}
