import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { speakArabic, stopSpeech, sounds } from '../utils/audio';

interface MascotMessageProps {
  message: string;
  subtext?: string;
  variant?: 'amber' | 'emerald' | 'blue' | 'purple';
  emotion?: 'happy' | 'thinking' | 'celebrating' | 'teaching';
}

export const MascotMessage: React.FC<MascotMessageProps> = ({
  message,
  subtext,
  variant = 'amber',
  emotion = 'teaching',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const variantStyles = {
    amber: {
      card: 'bg-gradient-to-r from-amber-50 to-orange-50/70 border-amber-300',
      badge: 'bg-amber-500 text-white',
      avatarBg: 'bg-amber-400 text-amber-950 border-amber-300',
    },
    emerald: {
      card: 'bg-gradient-to-r from-emerald-50 to-teal-50/70 border-emerald-300',
      badge: 'bg-emerald-600 text-white',
      avatarBg: 'bg-emerald-400 text-emerald-950 border-emerald-300',
    },
    blue: {
      card: 'bg-gradient-to-r from-blue-50 to-sky-50/70 border-blue-300',
      badge: 'bg-blue-600 text-white',
      avatarBg: 'bg-blue-400 text-blue-950 border-blue-300',
    },
    purple: {
      card: 'bg-gradient-to-r from-purple-50 to-pink-50/70 border-purple-300',
      badge: 'bg-purple-600 text-white',
      avatarBg: 'bg-purple-400 text-purple-950 border-purple-300',
    },
  }[variant];

  const emotionEmoji = {
    happy: '😊',
    thinking: '🤔',
    celebrating: '🎉',
    teaching: '🦉',
  }[emotion];

  const handleSpeak = () => {
    sounds.playClick();
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToSpeak = `${message}. ${subtext || ''}`;
      speakArabic(textToSpeak, () => {
        setIsSpeaking(false);
      });
    }
  };

  return (
    <div
      className={`relative rounded-3xl p-4 md:p-5 border-2 shadow-sm ${variantStyles.card} flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all`}
    >
      {/* Mascot Icon */}
      <div className="flex-shrink-0 flex items-center gap-2">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner border-2 ${
            variantStyles.avatarBg
          } ${isSpeaking ? 'animate-bounce' : 'hover:scale-105 transition-transform'}`}
        >
          {emotionEmoji}
        </div>
        <div className="sm:hidden">
          <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${variantStyles.badge}`}>
            الأُسْتَاذُ فَصِيح
          </span>
        </div>
      </div>

      {/* Bubble text */}
      <div className="flex-grow space-y-1">
        <div className="hidden sm:inline-block mb-1">
          <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${variantStyles.badge} inline-flex items-center gap-1`}>
            <Sparkles size={12} />
            نَصِيحَةُ الأُسْتَاذِ فَصِيح:
          </span>
        </div>
        <p className="text-base md:text-lg font-bold text-stone-900 leading-relaxed tracking-wide">
          {message}
        </p>
        {subtext && (
          <p className="text-xs md:text-sm text-stone-600 font-medium leading-relaxed">
            {subtext}
          </p>
        )}
      </div>

      {/* Audio Playback button */}
      <div className="self-end sm:self-center flex-shrink-0">
        <button
          onClick={handleSpeak}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs md:text-sm font-bold shadow-sm transition-all ${
            isSpeaking
              ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
              : 'bg-white hover:bg-stone-50 text-stone-800 border border-stone-300'
          }`}
          title="استمع إلى قراءة المعلم الذكي"
        >
          {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span>{isSpeaking ? 'إِيقَافُ الصَّوْت' : 'اسْتَمِعْ بِصَوْتِي 🔊'}</span>
        </button>
      </div>
    </div>
  );
};
