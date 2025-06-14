import { use, useEffect, useState } from 'react';

export default function Timer({ remaining, setRemaining }) {

    useEffect(() => {
    const interval = setInterval(() => {
      if (remaining > 0) {
        setRemaining(remaining - 1000);
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [remaining]);

  // Format as mm:ss
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000)
    .toString()
    .padStart(2, '0');

  return (
    <div className="font-mono text-lg mb-4">
      Time left: {minutes}:{seconds}
    </div>
  );
}