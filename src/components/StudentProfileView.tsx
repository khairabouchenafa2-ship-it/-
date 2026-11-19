import React, { useState, useEffect } from 'react';
import {
  Award,
  Sparkles,
  Printer,
  CheckCircle2,
  Lock,
  Edit3,
  Save,
  Users,
  UserPlus,
  RotateCcw,
  Trash2,
  GraduationCap,
  Smartphone,
} from 'lucide-react';
import { StudentProfile, Badge, StudentAccount } from '../types';
import { sounds } from '../utils/audio';
import { GRAMMAR_DICTIONARY_TERMS } from '../data/curriculumData';
import { PWAInstallButton } from './PWAInstallButton';
import confetti from 'canvas-confetti';

interface StudentProfileViewProps {
  starsCount: number;
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  onOpenCertificate: () => void;
  introCompletedCount: number;
  overallProgressPercent: number;
  accounts: StudentAccount[];
  activeAccountId: string;
  onSwitchAccount: (id: string) => void;
  onCreateAccount: (name: string, avatar: string) => void;
  onDeleteAccount: (id: string) => void;
  onResetCurrentProgress: () => void;
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

const formatStarsNeeded = (count: number) => {
  if (count === 1) return 'نَجْمَةٌ وَاحِدَةٌ';
  if (count === 2) return 'نَجْمَتَانِ';
  if (count >= 3 && count <= 10) return `${count} نَجَمَاتٍ`;
  return `${count} نَجْمَةً`;
};

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  starsCount,
  profile,
  onUpdateProfile,
  onOpenCertificate,
  introCompletedCount,
  overallProgressPercent,
  accounts,
  activeAccountId,
  onSwitchAccount,
  onCreateAccount,
  onDeleteAccount,
  onResetCurrentProgress,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [savedNotice, setSavedNotice] = useState(false);

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentAvatar, setNewStudentAvatar] = useState('👧');

  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const getRankInfo = (stars: number) => {
    if (stars >= 25) {
      return {
        title: '👑 عَبْقَرِيُّ الإِعْرَابِ الكَبِيرُ',
        accessory: '🏆 عَبَاءَةُ العَبْقَرِيَّةِ',
        nextRank: 'الرُّتْبَةُ القُصْوَى المَلَكِيَّةُ!',
        needed: 0,
        progress: 100,
      };
    }
    if (stars >= 15) {
      return {
        title: '🥇 قَنَّاصُ المَفْعُولِ بِهِ المَنْصُوبِ',
        accessory: '🎯 نِيشَانُ الفَتْحَةِ الذَّهَبِيُّ',
        nextRank: 'عَبْقَرِيُّ الإِعْرَابِ الكَبِيرُ',
        needed: 25 - stars,
        progress: Math.min(100, Math.round(((stars - 15) / 10) * 100)),
      };
    }
    if (stars >= 8) {
      return {
        title: '🥈 فَارِسُ الفَاعِلِ المَرْفُوعِ',
        accessory: '👑 تَاجُ الضَّمَّةِ الفِضِّيُّ',
        nextRank: 'قَنَّاصُ المَفْعُولِ بِهِ',
        needed: 15 - stars,
        progress: Math.min(100, Math.round(((stars - 8) / 7) * 100)),
      };
    }
    return {
      title: '🥉 مُحَقِّقُ النَّحْوِ المُبْتَدِئُ',
      accessory: '🔍 عَدَسَةُ المُحَقِّقِ الصَّغِيرِ',
      nextRank: 'فَارِسُ الفَاعِلِ المَرْفُوعِ',
      needed: Math.max(0, 8 - stars),
      progress: Math.min(100, Math.round((stars / 8) * 100)),
    };
  };

  const rank = getRankInfo(starsCount);

  // Badges tied to actual student accomplishments
  const badges: Badge[] = [
    {
      id: 'explorer',
      name: 'مُسْتَكْشِفُ الكَلَامِ',
      description: 'شَارَكَ فِي تَحَدِّي أَقْسَامِ الكَلَامِ وَأَنْوَاعِ الجُمْلَةِ.',
      icon: '🔍',
      color: 'bg-blue-100 text-blue-900 border-blue-300',
      unlocked: introCompletedCount >= 2,
    },
    {
      id: 'subject_master',
      name: 'تَاجُ الفَاعِلِ المَرْفُوعِ',
      description: 'حَلَّ 4 أَسْئِلَةٍ أَوْ أَكْثَرَ فِي بَنْكِ الِاخْتِيَارِ مِن مُتَعَدِّدٍ.',
      icon: '👑',
      color: 'bg-amber-100 text-amber-950 border-amber-300',
      unlocked: profile.mcqCompleted >= 4,
    },
    {
      id: 'object_sniper',
      name: 'صَيَّادُ الكَلِمَاتِ البَارِعُ',
      description: 'اصْطَادَ 4 كَلِمَاتٍ صَحِيحَةٍ أَوْ أَكْثَرَ فِي لُعْبَةِ صَيَّادِ الكَلِمَاتِ.',
      icon: '🎯',
      color: 'bg-sky-100 text-sky-950 border-sky-300',
      unlocked: profile.wordHunterCompleted >= 4,
    },
    {
      id: 'diacritics_guru',
      name: 'خَبِيرُ ضَبْطِ الحَرَكَاتِ',
      description: 'أَجَابَ عَنْ 4 جُمَلٍ أَوْ أَكْثَرَ بِالضَّمَّةِ ُ وَالفَتْحَةِ َ بِدِقَّةٍ.',
      icon: '⚖️',
      color: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      unlocked: profile.diacriticsCompleted >= 4,
    },
    {
      id: 'parsing_champ',
      name: 'بَطَلُ الإِعْرَابِ التَّامِّ',
      description: 'أَعْرَبَ جُمْلَتَيْنِ أَوْ أَكْثَرَ بِمُطَابَقَةِ النَّمُوذَجِ الصَّائِبِ.',
      icon: '📜',
      color: 'bg-purple-100 text-purple-950 border-purple-300',
      unlocked: profile.parsingCompleted >= 2,
    },
    {
      id: 'dictionary_scholar',
      name: 'بَاحِثُ القَامُوسِ الصَّغِيرِ',
      description: 'اسْتَكْشَفَ 4 مُصْطَلَحَاتٍ أَوْ أَكْثَرَ فِي قَامُوسِ القَوَاعِدِ الصَّغِيرِ.',
      icon: '📚',
      color: 'bg-orange-100 text-orange-950 border-orange-300',
      unlocked: profile.dictionaryLookups >= 4,
    },
  ];

  // Mastery breakdown for Parents / Teachers
  const speechSkillPct = Math.round((introCompletedCount / 4) * 100);
  const identificationSkillPct = Math.round(
    ((profile.mcqCompleted + profile.wordHunterCompleted) / 10) * 100
  );
  const diacriticsSkillPct = Math.round((profile.diacriticsCompleted / 5) * 100);
  const parsingSkillPct = Math.round((profile.parsingCompleted / 3) * 100);

  const handleSave = () => {
    sounds.playCorrect();
    onUpdateProfile({
      ...profile,
      name: formData.name.trim() || 'بَطَلُ اللُّغَةِ العَرَبِيَّةِ',
      avatar: formData.avatar,
      grade: formData.grade.trim() || 'السَّنَةُ الثَّالِثَةُ ابْتِدَائِيّ',
      school: formData.school.trim() || 'مَدْرَسَةُ الأَبْطَالِ',
      favoriteWord: formData.favoriteWord.trim() || 'العُصْفُورُ',
    });
    setIsEditing(false);
    setSavedNotice(true);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
    });
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newStudentName.trim();
    if (!cleaned) return;
    sounds.playCorrect();
    onCreateAccount(cleaned, newStudentAvatar);
    setNewStudentName('');
    setShowAddStudent(false);
  };

  const handlePrintPassport = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Multi-Student Switcher Bar */}
      <div className="bg-white rounded-3xl p-4 md:p-5 border-2 border-stone-200 shadow-xs space-y-3 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-black text-stone-800">
            <Users size={18} className="text-amber-700" />
            <span>التَّبْدِيلُ بَيْنَ مَلَفَّاتِ التَّلَامِيذِ عَلَى هَذَا الجِهَازِ:</span>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setShowAddStudent(!showAddStudent);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs cursor-pointer transition-all"
          >
            <UserPlus size={15} />
            <span>إِضَافَةُ تِلْمِيذٍ جَدِيدٍ</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {accounts.map((acc) => {
            const isActive = acc.id === activeAccountId;
            return (
              <div
                key={acc.id}
                className={`flex items-center gap-1 rounded-2xl border-2 pr-1 transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                    : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-amber-50'
                }`}
              >
                <button
                  onClick={() => {
                    sounds.playClick();
                    onSwitchAccount(acc.id);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 font-black text-xs md:text-sm cursor-pointer"
                >
                  <span>{acc.profile.avatar}</span>
                  <span>{acc.profile.name}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-lg tabular-nums ${
                      isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    ⭐ {acc.starsCount}
                  </span>
                </button>
                {accounts.length > 1 && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onDeleteAccount(acc.id);
                    }}
                    className={`p-1.5 rounded-xl ml-1 cursor-pointer ${
                      isActive ? 'hover:bg-rose-600 text-white/80' : 'hover:bg-rose-100 text-stone-400 hover:text-rose-700'
                    }`}
                    title="حذف هذا الملف"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {showAddStudent && (
          <form
            onSubmit={handleAddStudentSubmit}
            className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-wrap items-end gap-3 animate-fadeIn"
          >
            <div className="flex-grow min-w-[180px]">
              <label className="text-xs font-black text-stone-700 block mb-1">
                اسْمُ التِّلْمِيذِ الجَدِيدِ:
              </label>
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="مِثَال: سَارَةُ، يُوسُفُ..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black text-stone-700 block mb-1">الشَّخْصِيَّةُ:</label>
              <div className="flex gap-1">
                {['👧', '👦', '🦁', '🐰', '🦉'].map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setNewStudentAvatar(em)}
                    className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center cursor-pointer ${
                      newStudentAvatar === em
                        ? 'bg-amber-500 ring-2 ring-amber-700'
                        : 'bg-white border border-stone-300'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs md:text-sm cursor-pointer"
            >
              إِنْشَاءُ المَلَفِّ ✓
            </button>
          </form>
        )}
      </div>

      {/* Top Profile Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden print:hidden">
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
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap text-xs font-bold text-amber-100">
                <span>{formData.grade || 'السَّنَة الثَّالِثَة ابْتِدَائِيّ'}</span>
                <span aria-hidden="true">·</span>
                <span>مَدْرَسَةُ: {formData.school || 'مَدْرَسَةُ الأَبْطَالِ'}</span>
              </div>

              <h2 className="text-2xl md:text-4xl font-black text-white">
                {formData.name || 'بَطَلُ اللُّغَةِ العَرَبِيَّةِ'}
              </h2>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 text-sm font-black text-yellow-200">
                  <span>{rank.title}</span>
                </div>
                <span className="text-xs font-black text-amber-100 bg-black/15 px-3 py-1 rounded-xl">
                  {rank.accessory}
                </span>
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
              <span>{isEditing ? 'إِلْغَاءُ التَّعْدِيلِ' : 'تَعْدِيلُ المَلَفّ'}</span>
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

        {/* Overall Unit Progress Strip */}
        <div className="mt-6 pt-4 border-t border-white/20 relative z-10 space-y-1.5">
          <div className="flex items-center justify-between text-xs md:text-sm font-black text-amber-100">
            <span>التَّقَدُّمُ العَامُّ فِي وَحْدَةِ الإِعْرَابِ:</span>
            <span className="tabular-nums">{overallProgressPercent}% مُكْتَمَلٌ</span>
          </div>
          <div className="w-full h-3 rounded-full bg-black/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-300 to-yellow-300 rounded-full transition-all duration-500"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-300 shadow-md space-y-5 animate-fadeIn print:hidden">
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

          <div>
            <label className="text-xs font-black text-stone-700 block mb-2">
              اخْتَرِ الشَّخْصِيَّةَ الرَّمْزِيَّةَ:
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
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs cursor-pointer"
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
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 font-black text-xs md:text-sm rounded-2xl text-center animate-bounce print:hidden">
          🎉 تَمَّ حِفْظُ مَلَفِّكَ الشَّخْصِيِّ بِنَجَاحٍ!
        </div>
      )}

      {/* Level Progress & Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 print:hidden">
        <div className="p-5 rounded-3xl bg-white border-2 border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-800">المُسْتَوَى وَالرُّتْبَةُ</span>
            <span className="text-xl">🏆</span>
          </div>

          <div className="text-xl font-black text-stone-900">{rank.title}</div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500">
              <span>التَّقَدُّمُ نَحْوَ الرُّتْبَةِ التَّالِيَةِ:</span>
              <span className="tabular-nums">{rank.progress}%</span>
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
              ? `بَقِيَ لَكَ ${formatStarsNeeded(rank.needed)} لِتَصِلَ إِلَى رُتْبَةِ: «${rank.nextRank}»!`
              : 'أَنْتَ فِي أَعْلَى مَرَاتِبِ الإِعْرَابِ، هَنِيئاً لَكَ!'}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border-2 border-amber-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-yellow-800">النُّجُومُ المُكْتَسَبَةُ</span>
              <span className="text-2xl">⭐</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black text-amber-950 tabular-nums">
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

        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-indigo-800">الشَّهَادَةُ الرَّسْمِيَّةُ</span>
              <span className="text-2xl">🎓</span>
            </div>
            <h4 className="text-lg font-black text-indigo-950">شَهَادَةُ بَطَلِ الإِعْرَابِ</h4>
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

      {/* Real Accomplishment Stats + Parent/Teacher Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 print:hidden">
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-stone-900">
              📊 سِجِلُّ الإِنْجَازِ التَّعْلِيمِيِّ الحَقِيقِيِّ
            </h3>
            <span className="text-xs font-bold text-stone-500">يَتَحَدَّثُ تِلْقَائِيّاً</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-xs font-bold text-amber-800 block">الِاخْتِيَارُ مِن مُتَعَدِّدٍ</span>
              <span className="text-2xl font-black text-amber-950 tabular-nums">
                {profile.mcqCompleted} / 5
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-center">
              <span className="text-xs font-bold text-sky-800 block">ضَبْطُ الحَرَكَاتِ</span>
              <span className="text-2xl font-black text-sky-950 tabular-nums">
                {profile.diacriticsCompleted} / 5
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-center">
              <span className="text-xs font-bold text-purple-800 block">الإِعْرَابُ الكَامِلُ</span>
              <span className="text-2xl font-black text-purple-950 tabular-nums">
                {profile.parsingCompleted} / 3
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-xs font-bold text-emerald-800 block">صَيَّادُ الكَلِمَاتِ</span>
              <span className="text-2xl font-black text-emerald-950 tabular-nums">
                {profile.wordHunterCompleted} / 5
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 text-center col-span-2 sm:col-span-2">
              <span className="text-xs font-bold text-orange-800 block">مُصْطَلَحَاتُ القَامُوسِ</span>
              <span className="text-2xl font-black text-orange-950 tabular-nums">
                {profile.dictionaryLookups} / {GRAMMAR_DICTIONARY_TERMS.length}
              </span>
            </div>
          </div>
        </div>

        {/* Parent / Teacher Mastery Summary */}
        <div className="bg-white rounded-3xl p-6 border-2 border-indigo-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2">
              <GraduationCap size={20} className="text-indigo-700" />
              <span>مُلَخَّصُ وَلِيِّ الأَمْرِ وَالمُعَلِّمِ</span>
            </h3>
            <span className="text-xs font-bold text-indigo-700">تَقْرِيرُ المَهَارَاتِ</span>
          </div>

          <div className="space-y-3 text-xs font-black">
            {[
              { label: 'أَقْسَامُ الكَلَامِ وَأَنْوَاعُ الجُمْلَةِ', pct: speechSkillPct, color: 'bg-blue-500' },
              {
                label: 'اسْتِخْرَاجُ الفَاعِلِ وَالمَفْعُولِ بِهِ',
                pct: identificationSkillPct,
                color: 'bg-amber-500',
              },
              { label: 'ضَبْطُ الضَّمَّةِ وَالفَتْحَةِ', pct: diacriticsSkillPct, color: 'bg-sky-500' },
              { label: 'بِنَاءُ الإِعْرَابِ الكَامِلِ', pct: parsingSkillPct, color: 'bg-purple-500' },
            ].map((skill) => (
              <div key={skill.label} className="space-y-1">
                <div className="flex justify-between text-stone-700">
                  <span>{skill.label}</span>
                  <span className="tabular-nums">{skill.pct}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className={`h-full ${skill.color} rounded-full transition-all duration-500`}
                    style={{ width: `${skill.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges Gallery */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-stone-200 shadow-sm space-y-6 print:hidden">
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
          <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 tabular-nums">
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

      {/* PWA Mobile Install & Progress Reset Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 print:hidden">
        <div className="p-5 rounded-3xl bg-emerald-50/70 border-2 border-emerald-200 space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-950 font-black text-base">
              <Smartphone size={18} className="text-emerald-700" />
              <span>تَثْبِيتُ التَّطْبِيقِ عَلَى الهَاتِفِ (PWA)</span>
            </div>
            <p className="text-xs text-stone-700 font-medium leading-relaxed">
              يُمْكِنُكَ تَشْغِيلُ «بَطَلِ الإِعْرَابِ» كَتَطْبِيقٍ مُسْتَقِلٍّ عَلَى هَاتِفِ الأَنْدْرُوِيد أَوِ الآيْفُون لِلْعَمَلِ دُونَ إِنْتَرْنِت.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PWAInstallButton showFallbackInfo />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-rose-50/50 border-2 border-rose-200 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-rose-950 font-black text-base">
              <RotateCcw size={18} className="text-rose-700" />
              <span>إِعَادَةُ بَدْءِ الرِّحْلَةِ لِهَذَا المَلَفِّ</span>
            </div>
            <p className="text-xs text-stone-600 font-medium">
              يُصَفِّرُ التَّمَارِينَ وَالنُّجُومَ لِلْمَلَفِّ الحَالِيِّ فَقَطْ (مَعَ الإِبْقَاءِ عَلَى اسْمِ التِّلْمِيذِ).
            </p>
          </div>

          {!confirmReset ? (
            <button
              onClick={() => {
                sounds.playClick();
                setConfirmReset(true);
              }}
              className="self-start px-4 py-2 rounded-xl bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 font-black text-xs cursor-pointer transition-all"
            >
              تَصْفِيرُ التَّقَدُّمِ وَالنُّجُومِ
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-white border border-rose-300">
              <span className="text-xs font-black text-rose-900">هَلْ أَنْتَ مُتَأَكِّدٌ؟</span>
              <button
                onClick={() => {
                  sounds.playClick();
                  onResetCurrentProgress();
                  setConfirmReset(false);
                }}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-black cursor-pointer"
              >
                نَعَمْ، أَعِدِ البَدْءَ
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-bold cursor-pointer"
              >
                إِلْغَاءٌ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Printable Passport Card format */}
      <div className="p-6 md:p-8 rounded-3xl border-4 border-dashed border-amber-300 bg-amber-50/40 space-y-4 print:border-solid print:bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛂</span>
            <h3 className="text-lg font-black text-amber-950">جَوَازُ سَفَرِ بَطَلِ الإِعْرَابِ</h3>
          </div>
          <button
            onClick={handlePrintPassport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-black hover:bg-stone-50 shadow-2xs cursor-pointer print:hidden"
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
                الرُّتْبَةُ: {rank.title} • ⭐ {starsCount}
              </div>
              <div className="text-[11px] text-stone-500 font-bold mt-0.5">
                الكَلِمَةُ المُفَضَّلَةُ: «{formData.favoriteWord}»
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
