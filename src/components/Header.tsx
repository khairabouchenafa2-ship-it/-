import React from 'react';
import { Volume2, VolumeX, Award, ZoomIn, ZoomOut, Gauge } from 'lucide-react';
import { SectionTab, StudentProfile } from '../types';
import { sounds } from '../utils/audio';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentTab: SectionTab;
  onSelectTab: (tab: SectionTab) => void;
  starsCount: number;
  onOpenCertificate: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  speechRateMode: 'slow' | 'normal';
  onToggleSpeechRate: () => void;
  largeFont: boolean;
  onToggleLargeFont: () => void;
  profile?: StudentProfile;
  overallProgressPercent: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  starsCount,
  onOpenCertificate,
  soundEnabled,
  onToggleSound,
  speechRateMode,
  onToggleSpeechRate,
  largeFont,
  onToggleLargeFont,
  profile,
  overallProgressPercent,
}) => {
  const tabs: { id: SectionTab; label: string; icon: string; badge?: string }[] = [
    { id: 'intro', label: 'المُقَدِّمَةُ وَالقِصَّةُ', icon: '📖' },
    { id: 'lessons', label: 'دُرُوسُ الإِعْرَابِ', icon: '🎓' },
    { id: 'examples', label: 'النَّمَاذِجُ المِثَالِيَّةُ (5)', icon: '🌟' },
    { id: 'quiz', label: 'بَنْكُ التَّمَارِينِ', icon: '🎯', badge: 'تَفَاعُلِي' },
    { id: 'lab', label: 'مُخْتَبَرُ الجُمَلِ', icon: '🧪' },
    { id: 'printable', label: 'الكُرَّاسُ وَالطِّبَاعَةُ', icon: '🖨️' },
    { id: 'profile', label: 'المَلَفُّ الشَّخْصِيُّ', icon: '👤' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-sm print:hidden">
      {/* Top Banner */}
      <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2.5">
        {/* Brand & Mascot */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-2xl shadow-md border-2 border-amber-300">
            🦉
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 font-bold">
              <span className="text-amber-900 font-black">السَّنَة الثَّالِثَة ابْتِدَائِيّ</span>
              <span aria-hidden="true" className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">عُمُر 8 - 9 سَنَوَات</span>
              <span aria-hidden="true">•</span>
              <span className="text-emerald-700 font-black tabular-nums">
                الإِنْجَازُ: {overallProgressPercent}%
              </span>
            </div>
            <h1 className="text-lg md:text-2xl font-black text-amber-950 leading-tight">
              وَحْدَةُ تَعْلِيمِ الإِعْرَابِ: الفَاعِلُ وَالمَفْعُولُ بِهِ
            </h1>
          </div>
        </div>

        {/* Controls & Gamification */}
        <div className="flex items-center flex-wrap gap-1.5 md:gap-2">
          {/* Font Resizer */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleLargeFont();
            }}
            title={largeFont ? 'تصغير الخط' : 'تكبير الخط'}
            className="p-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 flex items-center gap-1 text-xs font-bold transition-all cursor-pointer"
          >
            {largeFont ? <ZoomOut size={15} /> : <ZoomIn size={15} />}
            <span className="hidden lg:inline">{largeFont ? 'خَطٌّ عَادِيّ' : 'تَكْبِيرُ الخَطّ'}</span>
          </button>

          {/* Speech Rate Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleSpeechRate();
            }}
            title="التحكم في سرعة القراءة الصوتية"
            className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold cursor-pointer ${
              speechRateMode === 'slow'
                ? 'bg-sky-50 text-sky-900 border-sky-300'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <Gauge size={15} />
            <span className="hidden md:inline">
              {speechRateMode === 'slow' ? 'نُطْقٌ بَطِيءٌ' : 'نُطْقٌ عَادِيٌّ'}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) sounds.playCorrect();
            }}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-stone-100 text-stone-500 border-stone-200'
            }`}
            title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تشغيل الأصوات'}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span className="hidden lg:inline">{soundEnabled ? 'الصَّوْتُ شَغَّال' : 'صَامِت'}</span>
          </button>

          {/* Stars / Gamification */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black text-xs md:text-sm shadow-sm border border-amber-300 tabular-nums">
            <span>⭐</span>
            <span>{starsCount}</span>
          </div>

          {/* Certificate Button */}
          <button
            onClick={() => {
              sounds.playFanfare();
              onOpenCertificate();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs md:text-sm shadow-sm transition-all cursor-pointer"
          >
            <Award size={15} />
            <span>الشَّهَادَةُ</span>
          </button>

          {/* Student Profile Shortcut Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('profile');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border transition-all cursor-pointer ${
              currentTab === 'profile'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm ring-2 ring-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300'
            }`}
            title="الملف الشخصي للطالب"
          >
            <span className="text-base">{profile?.avatar || '👦'}</span>
            <span className="text-xs font-black hidden sm:inline truncate max-w-[80px]">
              {profile?.name || 'مَلَفِّي'}
            </span>
          </button>

          {/* In-app PWA Install Prompt */}
          <PWAInstallButton />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <nav className="flex gap-1.5 md:gap-2 pb-2 pt-1 min-w-max">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectTab(tab.id);
                }}
                className={`relative px-3.5 py-2 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 ring-2 ring-amber-400/50'
                    : 'bg-white hover:bg-amber-50 text-stone-700 border border-stone-200/80 hover:border-amber-300'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-amber-800 text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
