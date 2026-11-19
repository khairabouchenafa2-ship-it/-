import React from 'react';

interface VocalizedWordProps {
  word: string;
  highlightClassName?: string;
  className?: string;
}

const ARABIC_DIACRITICS_REGEX = /[\u064B-\u065F\u0670]/;

/**
 * Splits an Arabic word into its stem and its final base letter + trailing diacritics,
 * preserving Arabic cursive ligatures by using only a color span without padding/margin/weight changes.
 */
export const VocalizedWord: React.FC<VocalizedWordProps> = ({
  word,
  highlightClassName = 'text-rose-600',
  className = '',
}) => {
  const trimmed = word.trim();
  if (!trimmed) return null;

  // Handle trailing punctuation (e.g. "." or "؟")
  let trailingPunctuation = '';
  let core = trimmed;
  while (core.length > 0 && /[.\u061F!،,:؛]/.test(core[core.length - 1])) {
    trailingPunctuation = core[core.length - 1] + trailingPunctuation;
    core = core.slice(0, -1);
  }

  // Walk backwards past trailing diacritics to find the final base letter index
  let idx = core.length - 1;
  while (idx >= 0 && ARABIC_DIACRITICS_REGEX.test(core[idx])) {
    idx--;
  }

  // If word is too short or has no base character, render plainly
  if (idx <= 0) {
    return <span className={className}>{word}</span>;
  }

  // Keep any shadda+diacritic directly attached to the final letter
  const prefix = core.slice(0, idx);
  const ending = core.slice(idx);

  return (
    <span className={className}>
      {prefix}
      <span className={highlightClassName}>{ending}</span>
      {trailingPunctuation}
    </span>
  );
};
