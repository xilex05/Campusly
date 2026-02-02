import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Logo({ className = '', size = 'default' }) {
  const { dark } = useTheme();
  const [imgFailed, setImgFailed] = useState(false);
  const isLarge = size === 'large';

  // Light mode: logo_purple (white bg, purple text). Dark mode: logo_white (black/dark bg, white logo).
  const logoSrc = dark ? '/logo_white.png' : '/logo_purple.png';

  return (
    <div className={`flex items-center shrink-0 ${className}`}>
      {!imgFailed ? (
        <img
          src={logoSrc}
          alt="CAMPUSLY"
          className={`object-contain object-left w-auto ${
            isLarge ? 'h-14 max-w-[200px]' : 'h-8 max-w-[140px]'
          } ${
            dark ? '' : 'drop-shadow-[0_1px_2px_rgba(139,92,246,0.15)]'
          }`}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className={`font-bold tracking-tight text-gray-900 dark:text-white ${isLarge ? 'text-2xl' : 'text-xl'}`}>
          campusly
        </span>
      )}
    </div>
  );
}
