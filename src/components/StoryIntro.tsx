import React, { useState } from 'react';
import { Sparkles, CheckCircle2, HelpCircle, ArrowRight, Play, BookOpen } from 'lucide-react';
import { STORY_CHARACTERS, SENTENCE_TYPES_DATA } from '../data/curriculumData';
import { MascotMessage } from './MascotMessage';
import { sounds, speakArabic } from '../utils/audio';

interface StoryIntroProps {
  onGoToLessons: () => void;
  onEarnStar: () => void;
}

export const StoryIntro: React.FC<StoryIntroProps> = ({ onGoToLessons, onEarnStar }) => {
  // Mini interactive check
  const [selectedWordTest, setSelectedWordTest] = useState<{
    word: string;
    correctType: 'اسم' | 'فعل' | 'حرف';
    chosenType: string | null;
    isCorrect: boolean | null;
  }[]>([
    { word: 'يَجْرِي', correctType: 'فعل', chosenType: null, isCorrect: null },
    { word: 'المَدْرَسَةُ', correctType: 'اسم', chosenType: null, isCorrect: null },
    { word: 'فِي', correctType: 'حرف', chosenType: null, isCorrect: null },
  ]);

  const [sentenceTest, setSentenceTest] = useState<{
    sentence: string;
    correctType: 'فعلية' | 'اسمية';
    chosen: string | null;
  }>({
    sentence: 'أَشْرَقَتِ الشَّمْسُ بِالدِّفْءِ.',
    correctType: 'فعلية',
    chosen: null,
  });

  const handleTestWord = (idx: number, type: 'اسم' | 'فعل' | 'حرف') => {
    sounds.playClick();
    const item = selectedWordTest[idx];
    const isCorrect = item.correctType === type;
    if (isCorrect) {
      sounds.playCorrect();
      onEarnStar();
    } else {
      sounds.playWrong();
    }

    const updated = [...selectedWordTest];
    updated[idx] = {
      ...item,
      chosenType: type,
      isCorrect,
    };
    setSelectedWordTest(updated);
  };

  const handleSentenceTest = (type: 'فعلية' | 'اسمية') => {
    sounds.playClick();
    if (sentenceTest.correctType === type) {
      sounds.playCorrect();
      onEarnStar();
    } else {
      sounds.playWrong();
    }
    setSentenceTest({ ...sentenceTest, chosen: type });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Mascot Banner */}
      <MascotMessage
        message="مَرْحَباً بِكُمْ يَا عَبَاقِرَةَ اللُّغَةِ العَرَبِيَّةِ! تَعَالَوْا مَعِي لِنَقْرَأَ قِصَّةَ «أَصْدِقَاءِ الكَلَامِ الثَّلَاثَةِ»!"
        subtext="كُلُّ كَلِمَةٍ نَنْطِقُهَا فِي لُغَتِنَا الجَمِيلَةِ لَا تَخْرُجُ عَنْ ثَلَاثَةِ أَنْوَاعٍ: اسْمٌ، أَوْ فِعْلٌ، أَوْ حَرْفٌ!"
        variant="amber"
        emotion="happy"
      />

      {/* Story Narrative Box */}
      <div className="bg-gradient-to-br from-white via-amber-50/50 to-orange-50/40 rounded-3xl p-6 md:p-8 border-2 border-amber-200/90 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 translate-x-4 -translate-y-4 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🏰</span>
          <h2 className="text-xl md:text-2xl font-black text-amber-950">
            قِصَّةُ مَمْلَكَةِ الكَلَامِ: الأَصْدِقَاءُ الثَّلَاثَةُ
          </h2>
        </div>

        <p className="text-base md:text-lg text-stone-800 leading-relaxed mb-6 font-medium">
          فِي وَادٍ جَمِيلٍ يُدْعَى <span className="font-bold text-amber-800">«وَادِي اللُّغَةِ العَرَبِيَّةِ»</span>، كَانَ هُنَاكَ ثَلَاثَةُ إِخْوَةٍ يَعِيشُونَ فِي وِئَامٍ، كُلُّ وَاحِدٍ مِنْهُمْ لَهُ قُوَّةٌ خَاصَّةٌ لَا يَسْتَغْنِي عَنْهَا الآخَرُ!
        </p>

        {/* The 3 Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STORY_CHARACTERS.map((char) => (
            <div
              key={char.name}
              className={`rounded-2xl p-5 border-2 shadow-sm flex flex-col justify-between ${char.bgLight} transition-all hover:shadow-md hover:-translate-y-1`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl border border-stone-100">
                    {char.avatar}
                  </div>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      speakArabic(`${char.name}. ${char.description}`);
                    }}
                    className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-stone-700 shadow-xs border border-stone-200 text-xs flex items-center gap-1 font-bold"
                    title="استمع للتعريف"
                  >
                    <span>🔊</span>
                    <span>اسْتَمِعْ</span>
                  </button>
                </div>

                <h3 className="text-lg font-black text-stone-900 mb-1">{char.name}</h3>
                <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-stone-800 border border-stone-200/80 mb-3">
                  {char.badge}
                </span>

                <p className="text-sm text-stone-800 font-medium leading-relaxed mb-4">
                  {char.description}
                </p>
              </div>

              {/* Examples pills */}
              <div>
                <div className="text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
                  <Sparkles size={13} className="text-amber-500" />
                  <span>أَمْثِلَةٌ مَشْكُولَةٌ:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {char.examples.map((ex) => (
                    <span
                      key={ex}
                      onClick={() => {
                        sounds.playClick();
                        speakArabic(ex);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-white font-black text-xs md:text-sm text-stone-800 shadow-xs border border-stone-200 cursor-pointer hover:bg-amber-100 transition-colors"
                      title="انقر للاستماع للنطق"
                    >
                      {ex} 🔊
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Interactive Mini-Game: Classify Words */}
      <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <h3 className="text-lg md:text-xl font-black text-stone-900">
              تَحَدٍّ سَرِيعٌ: هَلْ أَنْتَ بَطَلٌ فِي التَّمْيِيزِ؟
            </h3>
          </div>
          <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
            نَجْمَةٌ لِكُلِّ إِجَابَةٍ صَحِيحَةٍ ⭐
          </span>
        </div>
        <p className="text-sm text-stone-600 mb-4">
          حَدِّدْ نَوْعَ الكَلِمَةِ بِالضَّغْطِ عَلَى الزِّرِّ المُنَاسِبِ (اسْم، فِعْل، حَرْف):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {selectedWordTest.map((item, idx) => (
            <div
              key={item.word}
              className="p-4 rounded-2xl bg-stone-50 border-2 border-stone-200 text-center space-y-3"
            >
              <div className="text-2xl font-black text-amber-950 py-1 bg-white rounded-xl shadow-xs border border-stone-200">
                {item.word}
              </div>

              <div className="flex justify-center gap-1.5">
                {(['اسم', 'فعل', 'حرف'] as const).map((type) => {
                  const isSelected = item.chosenType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => handleTestWord(idx, type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isSelected
                          ? item.isCorrect
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-rose-500 text-white'
                          : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-300'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>

              {item.isCorrect !== null && (
                <div
                  className={`text-xs font-black px-2 py-1 rounded-lg ${
                    item.isCorrect
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {item.isCorrect
                    ? '🎉 أَحْسَنْتَ! إِجَابَةٌ صَحِيحَةٌ!'
                    : `حَاوِلْ مَرَّةً أُخْرَى! الصَّوَابُ: ${item.correctType}`}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Nominal vs Verbal Sentences */}
      <div className="bg-gradient-to-br from-stone-50 to-amber-50/50 rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-200 text-amber-900 mb-2 inline-block">
            المَفْهُومُ الأَسَاسِيُّ لِلْجُمَلِ
          </span>
          <h2 className="text-xl md:text-2xl font-black text-stone-900">
            مَا الفَرْقُ بَيْنَ «الجُمْلَةِ الفِعْلِيَّةِ» وَ «الجُمْلَةِ الاسْمِيَّةِ»؟
          </h2>
          <p className="text-stone-700 text-sm md:text-base mt-1 font-medium">
            نَنْظُرُ دَائِماً إِلَى <span className="font-black text-amber-800">«أَوَّلِ كَلِمَةٍ»</span> فِي الجُمْلَةِ؛ فَهِيَ المِفْتَاحُ السِّحْرِيُّ!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Verbal Sentence */}
          <div className="rounded-3xl p-5 border-2 border-emerald-300 bg-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">🏃‍♂️</span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200">
                  تَبْدَأُ بِـ فِعْلٍ
                </span>
              </div>
              <h3 className="text-lg font-black text-emerald-950 mb-2">
                1. {SENTENCE_TYPES_DATA.verbal.title}
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed font-medium mb-4">
                {SENTENCE_TYPES_DATA.verbal.explanation}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-emerald-100">
              <span className="text-xs font-bold text-stone-600 block">أَمْثِلَةٌ مَشْكُولَةٌ بِالدِّقَّةِ:</span>
              {SENTENCE_TYPES_DATA.verbal.examples.map((ex, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between"
                >
                  <span className="font-black text-base text-stone-900">{ex.sentence}</span>
                  <span className="text-xs bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-lg">
                    {ex.firstWord} = {ex.firstWordType}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Nominal Sentence */}
          <div className="rounded-3xl p-5 border-2 border-blue-300 bg-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">👦</span>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black border border-blue-200">
                  تَبْدَأُ بِـ اسْمٍ
                </span>
              </div>
              <h3 className="text-lg font-black text-blue-950 mb-2">
                2. {SENTENCE_TYPES_DATA.nominal.title}
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed font-medium mb-4">
                {SENTENCE_TYPES_DATA.nominal.explanation}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-blue-100">
              <span className="text-xs font-bold text-stone-600 block">أَمْثِلَةٌ مَشْكُولَةٌ بِالدِّقَّةِ:</span>
              {SENTENCE_TYPES_DATA.nominal.examples.map((ex, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between"
                >
                  <span className="font-black text-base text-stone-900">{ex.sentence}</span>
                  <span className="text-xs bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded-lg">
                    {ex.firstWord} = {ex.firstWordType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mini test for sentence type */}
        <div className="bg-amber-100/60 rounded-2xl p-4 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">❓</span>
            <div>
              <span className="text-xs font-bold text-stone-600">اخْتَبِرْ نَفْسَكَ:</span>
              <p className="text-base font-black text-stone-900">
                «{sentenceTest.sentence}»
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSentenceTest('فعلية')}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs md:text-sm transition-all cursor-pointer ${
                sentenceTest.chosen === 'فعلية'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-300'
              }`}
            >
              جُمْلَةٌ فِعْلِيَّةٌ
            </button>
            <button
              onClick={() => handleSentenceTest('اسمية')}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs md:text-sm transition-all cursor-pointer ${
                sentenceTest.chosen === 'اسمية'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white hover:bg-blue-50 text-blue-950 border border-blue-300'
              }`}
            >
              جُمْلَةٌ اسْمِيَّةٌ
            </button>
          </div>
        </div>

        {sentenceTest.chosen && (
          <div
            className={`p-3 rounded-xl text-center text-sm font-black ${
              sentenceTest.chosen === sentenceTest.correctType
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-rose-100 text-rose-900 border border-rose-300'
            }`}
          >
            {sentenceTest.chosen === sentenceTest.correctType
              ? '🎉 رَائِعٌ جِدّاً! تَبْدَأُ بِـ (أَشْرَقَتْ) وَهُوَ فِعْلٌ، إِذَنْ فَهِيَ جُمْلَةٌ فِعْلِيَّةٌ!'
              : '❌ انْتَبِهْ: كَلِمَةُ «أَشْرَقَتْ» تَدُلُّ عَلَى حَرَكَةٍ وَعَمَلٍ فَهِيَ فِعْلٌ، لِذَلِكَ الجُمْلَةُ فِعْلِيَّةٌ.'}
          </div>
        )}
      </div>

      {/* Button to proceed to next tab */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => {
            sounds.playClick();
            onGoToLessons();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-base md:text-lg shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-102"
        >
          <span>تَقَدَّمْ إِلَى دُرُوسِ الإِعْرَابِ (الفَاعِلُ وَالمَفْعُولُ بِهِ)</span>
          <ArrowRight size={20} className="rotate-180" />
        </button>
      </div>
    </div>
  );
};
