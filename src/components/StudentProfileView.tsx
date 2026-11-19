import React, { useState, useEffect } from 'react';
import {
  User,
  Award,
  Sparkles,
  Crown,
  Target,
  BookOpen,
  Printer,
  CheckCircle2,
  Lock,
  Edit3,
  Save,
  GraduationCap,
  Star,
  Flame,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { StudentProfile, Badge } from '../types';
import { sounds, speakArabic } from '../utils/audio';
import confetti from 'canvas-confetti';

interface StudentProfileViewProps {
  starsCount: number;
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  onOpenCertificate: () => void;
  onEarnStar: () => void;
}

const AVATAR_OPTIONS = [
  { emoji: '👦', name: 'بَطَلُ النَّحْوِ' },
  { emoji: '👧', name: 'بَطَلَةُ الإِعْرَابِ' },
  { emoji: '🦉', name: 'المُعَلِّمُ فَصِيح' },
  { emoji: '🦁', name: 'الشِّبْلُ الشُّجَاعُ' },
  { emoji: '🦊', name: 'الثَّعْلَبُ الفَطِنُ' },
  { emoji: '🐰', name: 'الأَرْنَبُ السَّرِيعُ' },
  { emoji: '👑', name: 'الأَمِيرُ النَّحْوِيُّ' },
  { emoji: '🚀', name: 'رَائِدُ الفَضَاءِ' },
  { emoji: '🎓', name: 'العَالِمُ الصَّغِيرُ' },
  { emoji: '🌟', name: 'النَّجْمُ اللَّامِعُ' },
];

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  starsCount,
  profile,
  onUpdateProfile,
  onOpenCertificate,
  onEarnStar,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  // Determine Rank based on stars
  const getRankInfo = (stars: number) => {
    if (stars >= 25) {
      return {
        title: '👑 عَبْقَرِيُّ الإِعْرَابِ الكَبِيرُ',
        nextRank: 'الرُّتْبَةُ القُصْوَى المَلَكِيَّةُ!',
        needed: 0,
        progress: 100,
        badgeColor: 'from-amber-400 via-yellow-400 to-amber-500',
      };
    }
    if (stars >= 15) {
      return {
        title: '🥇 قَنَّاصُ المَفْعُولِ بِهِ المَنْصُوبِ',
        nextRank: 'عَبْقَرِيُّ الإِعْرَابِ الكَبِيرُ',
        needed: 25 - stars,
        progress: Math.min(100, Math.round(((stars - 15) / 10) * 100)),
        badgeColor: 'from-sky-400 to-blue-600',
      };
    }
    if (stars >= 8) {
      return {
        title: '🥈 فَارِسُ الفَاعِلِ المَرْفُوعِ',
        nextRank: 'قَنَّاصُ المَفْعُولِ بِهِ',
        needed: 15 - stars,
        progress: Math.min(100, Math.round(((stars - 8) / 7) * 100)),
        badgeColor: 'from-emerald-400 to-teal-600',
      };
    }
    return {
      title: '🥉 مُحَقِّقُ النَّحْوِ المُبْتَدِئُ',
      nextRank: 'فَارِسُ الفَاعِلِ المَرْفُوعِ',
      needed: 8 - stars,
      progress: Math.min(100, Math.round((stars / 8) * 100)),
      badgeColor: 'from-amber-500 to-orange-500',
    };
  };

  const rank = getRankInfo(starsCount);

  // List of Badges
  const badges: Badge[] = [
    {
      id: 'explorer',
      name: 'مُسْتَكْشِفُ الكَلَامِ',
      description: 'تَعَرَّفَ عَلَى الاسْمِ وَالفِعْلِ وَالحَرْفِ.',
      icon: '🔍',
      color: 'bg-blue-100 text-blue-900 border-blue-300',
      unlocked: true,
    },
    {
      id: 'subject_master',
      name: 'تَاجُ الفَاعِلِ المَرْفُوعِ',
      description: 'أَتْقَنَ مَعْرِفَةَ الفَاعِلِ وَإِعْرَابَهُ بِالضَّمَّةِ.',
      icon: '👑',
      color: 'bg-amber-100 text-amber-950 border-amber-300',
      unlocked: starsCount >= 5,
    },
    {
      id: 'object_sniper',
      name: 'قَنَّاصُ المَفْعُولِ بِهِ',
      description: 'أَتْقَنَ مَعْرِفَةَ المَفْعُولِ بِهِ وَإِعْرَابَهُ بِالفَتْحَةِ.',
      icon: '🎯',
      color: 'bg-sky-100 text-sky-950 border-sky-300',
      unlocked: starsCount >= 8,
    },
    {
      id: 'diacritics_guru',
      name: 'خَبِيرُ ضَبْطِ الحَرَكَاتِ',
      description: 'مَلَأَ الفَرَاغَاتِ بِالضَّمَّةِ ُ وَالفَتْحَةِ َ بِدِقَّةٍ.',
      icon: '⚖️',
      color: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      unlocked: starsCount >= 12,
    },
    {
      id: 'parsing_champ',
      name: 'بَطَلُ الإِعْرَابِ التَّامِّ',
      description: 'أَعْرَبَ الجُمَلَ كَامِلاً بِمُطَابَقَةِ النَّمُوذَجِ الصَّائِبِ.',
      icon: '📜',
      color: 'bg-purple-100 text-purple-950 border-purple-300',
      unlocked: starsCount >= 16,
    },
    {
      id: 'dictionary_scholar',
      name: 'بَاحِثُ القَامُوسِ الصَّغِيرِ',
      description: 'اسْتَكْشَفَ مُعْجَمَ القَوَاعِدِ وَمُصْطَلَحَاتِ النَّحْوِ.',
      icon: '📚',
      color: 'bg-orange-100 text-orange-950 border-orange-300',
      unlocked: starsCount >= 20,
    },
  ];

  const handleSave = () => {
    sounds.playCorrect();
    onUpdateProfile(formData);
    setIsEditing(false);
    setSavedNotice(true);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
    });
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handlePrintPassport = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Profile Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
          {/* Avatar and Main Info */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right">
            <div className="relative group">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-white text-stone-900 flex items-center justify-center text-5xl md:text-6xl shadow-xl border-4 border-amber-300">
                {formData.avatar || '👦'}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-2 -right-2 p-2 rounded-full bg-amber-900 text-white hover:bg-stone-900 shadow-md border-2 border-white transition-transform hover:scale-110 cursor-pointer"
                title="تغيير الصورة أو تعديل البيانات"
              >
                <Edit3 size={15} />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-black/20 backdrop-blur-xs border border-white/30 text-amber-100">
                  {formData.grade || 'السَّنَة الثَّالِثَة ابْتِدَائِيّ'}
                </span>
                <span className="text-xs font-bold text-amber-200">
                  مَدْرَسَةُ: {formData.school || 'مَدْرَسَةُ الأَبْطَالِ'}
                </span>
              </div>

              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white">
                {formData.name || 'بَطَلُ اللُّغَةِ العَرَبِيَّةِ'}
              </h2>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 text-sm font-black text-yellow-200">
                <span>{rank.title}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-row sm:flex-col gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white text-amber-950 font-black text-xs md:text-sm shadow-md hover:bg-amber-50 transition-all cursor-pointer"
            >
              <Edit3 size={16} />
              <span>{isEditing ? 'إِلْغَاءُ التَّعْدِيل' : 'تَعْدِيلُ المَلَفّ'}</span>
            </button>

            <button
              onClick={handlePrintPassport}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-900/60 hover:bg-amber-900/80 text-white font-bold text-xs md:text-sm border border-white/30 transition-all cursor-pointer"
            >
              <Printer size={16} />
              <span>طِبَاعَةُ الجَوَازِ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form Modal/Drawer if active */}
      {isEditing && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-300 shadow-md space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✏️</span>
              <h3 className="text-xl font-black text-stone-900">
                تَعْدِيلُ بَيَانَاتِ البَطَلِ الصَّغِيرِ:
              </h3>
            </div>
            <span className="text-xs text-stone-500 font-bold">
              تُحْفَظُ البَيَانَاتُ فِي كُرَّاسِكَ وَشَهَادَتِكَ
            </span>
          </div>

          {/* Avatar Picker */}
          <div>
            <label className="text-xs font-black text-stone-700 block mb-2">
              اخْتَرِ الشَّخْصِيَّةَ الرَّمْزِيَّةَ (AVATAR):
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.emoji}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setFormData({ ...formData, avatar: av.emoji });
                  }}
                  className={`p-2.5 rounded-2xl text-2xl md:text-3xl transition-all cursor-pointer ${
                    formData.avatar === av.emoji
                      ? 'bg-amber-400 shadow-md scale-110 ring-2 ring-amber-600'
                      : 'bg-stone-50 hover:bg-amber-100 border border-stone-200'
                  }`}
                  title={av.name}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-stone-700 block mb-1">
                اسْمُ التِّلْمِيذِ / التِّلْمِيذَةِ:
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                placeholder="مِثَال: أَحْمَدُ البَطَلُ"
              />
            </div>

            <div>
              <label className="text-xs font-black text-stone-700 block mb-1">
                الصَّفُّ وَالفَوْجُ:
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                placeholder="السَّنَةُ الثَّالِثَةُ ابْتِدَائِيّ (فَوْج 1)"
              />
            </div>

            <div>
              <label className="text-xs font-black text-stone-700 block mb-1">
                اسْمُ المَدْرَسَةِ الِابْتِدَائِيَّةِ:
              </label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                placeholder="مَدْرَسَةُ..."
              />
            </div>

            <div>
              <label className="text-xs font-black text-stone-700 block mb-1">
                كَلِمَتُكَ المُفَضَّلَةُ فِي اللُّغَةِ العَرَبِيَّةِ:
              </label>
              <input
                type="text"
                value={formData.favoriteWord}
                onChange={(e) => setFormData({ ...formData, favoriteWord: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                placeholder="مِثَال: نَجَحَ، كِتَابٌ، سَلَامٌ"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs"
            >
              إِلْغَاءٌ
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs md:text-sm shadow-md transition-all cursor-pointer"
            >
              <Save size={16} />
              <span>حِفْظُ المَلَفِّ الشَّخْصِيِّ ✨</span>
            </button>
          </div>
        </div>
      )}

      {savedNotice && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 font-black text-xs md:text-sm rounded-2xl text-center animate-bounce">
          🎉 تَمَّ حِفْظُ مَلَفِّكَ الشَّخْصِيِّ بِنَجَاحٍ!
        </div>
      )}

      {/* Level Progress & Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Level Rank Card */}
        <div className="p-5 rounded-3xl bg-white border-2 border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              المُسْتَوَى وَالرُّتْبَةُ
            </span>
            <span className="text-xl">🏆</span>
          </div>

          <div className="text-xl font-black text-stone-900">{rank.title}</div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500">
              <span>التَّقَدُّمُ نَحْوَ الرُّتْبَةِ التَّالِيَةِ:</span>
              <span>{rank.progress}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${rank.progress}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-stone-600 font-medium leading-relaxed">
            {rank.needed > 0
              ? `بَقِيَ لَكَ ${rank.needed} نَجْمَةٍ لِتَصِلَ إِلَى رُتْبَةِ: «${rank.nextRank}»!`
              : 'أَنْتَ فِي أَعْلَى مَرَاتِبِ الإِعْرَابِ، هَنِيئاً لَكَ!'}
          </p>
        </div>

        {/* Stars Counter Card */}
        <div className="p-5 rounded-3xl bg-white border-2 border-amber-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-yellow-800 bg-yellow-100 px-2.5 py-0.5 rounded-full">
                النُّجُومُ المُكْتَسَبَةُ
              </span>
              <span className="text-2xl">⭐</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black text-amber-950">
                {starsCount}
              </span>
              <span className="text-sm font-bold text-stone-500">نَجْمَةً تَقْدِيرِيَّةً</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-600 flex-shrink-0" />
            <span>كُلَّمَا حَلَلْتَ تَمَارِينَ أَكْثَرَ جَمَعْتَ نُجُوماً أَعْلَى!</span>
          </div>
        </div>

        {/* Certificate Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                الشَّهَادَةُ الرَّسْمِيَّةُ
              </span>
              <span className="text-2xl">🎓</span>
            </div>
            <h4 className="text-lg font-black text-indigo-950">
              شَهَادَةُ بَطَلِ الإِعْرَابِ
            </h4>
            <p className="text-xs text-stone-600 font-medium">
              شَهَادَةُ تَفَوُّقٍ فَخْرِيَّةٌ مُعْتَمَدَةٌ مَطْبُوعَةٌ بِاسْمِكَ الكَرِيمِ.
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playFanfare();
              onOpenCertificate();
            }}
            className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs md:text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Award size={16} />
            <span>عَرْضُ وَطِبَاعَةُ الشَّهَادَةِ</span>
          </button>
        </div>
      </div>

      {/* Badges Gallery (الأوسمة والشارات) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎖️</span>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-stone-900">
                مَعْرَضُ الأَوْسِمَةِ وَالشَّارَاتِ الفَخْرِيَّةِ
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                تُفْتَحُ الأَوْسِمَةُ تِلْقَائِيّاً كُلَّمَا أَنْجَزْتَ الدُّرُوسَ وَالتَّمَارِينَ!
              </p>
            </div>
          </div>
          <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            {badges.filter((b) => b.unlocked).length} / {badges.length} مُكْتَمَل
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                b.unlocked
                  ? `${b.color} shadow-xs`
                  : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  b.unlocked ? 'bg-white shadow-2xs' : 'bg-stone-200 text-stone-400'
                }`}
              >
                {b.unlocked ? b.icon : <Lock size={20} />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-sm text-stone-900">{b.name}</h4>
                  {b.unlocked && <CheckCircle2 size={14} className="text-emerald-600" />}
                </div>
                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  {b.description}
                </p>
                <span className="inline-block text-[10px] font-black mt-1">
                  {b.unlocked ? '✅ تَمَّ الحُصُولُ عَلَيْهِ' : '🔒 قَيْدَ الإِنْجَازِ'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Printable Passport Card format */}
      <div className="p-6 md:p-8 rounded-3xl border-4 border-dashed border-amber-300 bg-amber-50/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛂</span>
            <h3 className="text-lg font-black text-amber-950">
              جَوَازُ سَفَرِ بَطَلِ الإِعْرَابِ (PASSPORT)
            </h3>
          </div>
          <button
            onClick={handlePrintPassport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-black hover:bg-stone-50 shadow-2xs cursor-pointer"
          >
            <Printer size={15} />
            <span>طِبَاعَةُ البِطَاقَةِ</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border-2 border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-4xl border border-amber-300">
              {formData.avatar}
            </div>
            <div>
              <div className="text-lg font-black text-stone-900">{formData.name}</div>
              <div className="text-xs text-stone-500 font-bold">
                {formData.grade} • {formData.school}
              </div>
              <div className="text-xs text-amber-800 font-black mt-1">
                الرُّتْبَةُ: {rank.title}
              </div>
            </div>
          </div>

          <div className="text-center sm:text-left border-t sm:border-t-0 sm:border-r border-stone-200 pt-3 sm:pt-0 sm:pr-6">
            <span className="text-xs text-stone-400 block font-medium">خَاتَمُ التَّفَوُّقِ:</span>
            <div className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-block mt-1">
              مُعْتَمَدٌ فِي النَّحْوِ ✓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
