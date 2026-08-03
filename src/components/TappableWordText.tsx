import React from 'react';
import { AthenaCoreEngine } from '../core/athenaCoreEngine';

interface TappableWordTextProps {
  text: string;
  onWordTap?: (word: string) => void;
  className?: string;
  wordClassName?: string;
}

export const TappableWordText: React.FC<TappableWordTextProps> = ({
  text,
  onWordTap,
  className = '',
  wordClassName = 'cursor-pointer hover:bg-indigo-500/20 hover:text-indigo-300 rounded px-0.5 transition-colors underline decoration-dotted decoration-indigo-400/40',
}) => {
  if (!text) return null;

  // Split text into words and non-word tokens (punctuation, spaces)
  const tokens = text.split(/(\s+|[.,!?;:()"“”'’\-[\]{}]+)/);

  const handleWordClick = (token: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanWord = token.replace(/[^a-zA-Z0-9'-]/g, '').trim();
    if (!cleanWord || cleanWord.length < 2) return;

    if (onWordTap) {
      onWordTap(cleanWord);
    } else {
      // Dispatch global custom event for Word Tap system
      window.dispatchEvent(
        new CustomEvent('athena_word_tap', {
          detail: { word: cleanWord },
        })
      );
    }
  };

  return (
    <span className={className}>
      {tokens.map((token, index) => {
        const isWord = /^[a-zA-Z0-9'-]+$/.test(token.trim());
        if (isWord) {
          return (
            <span
              key={index}
              onClick={(e) => handleWordClick(token, e)}
              className={wordClassName}
              title={`Tap for dictionary lookup: "${token}"`}
            >
              {token}
            </span>
          );
        }
        return <React.Fragment key={index}>{token}</React.Fragment>;
      })}
    </span>
  );
};
