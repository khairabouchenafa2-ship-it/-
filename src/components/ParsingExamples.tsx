import React, { useState } from 'react';
import { Volume2, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { PARSED_EXAMPLES } from '../data/curriculumData';
import { MascotMessage } from './MascotMessage';
import { sounds, speakArabic } from '../utils/audio';

interface ParsingExamplesProps {
  onGoToQuiz: () => void;
  onEarnStar: () => void;
}

export const ParsingExamples: React.FC<ParsingExamplesProps> = ({ onGoToQuiz, onEarnStar }) => {
  const [selectedExampleId, setSelectedExampleId] = useState<number>(1);
  const [hiddenIerab, setHiddenIerab] = useState<Record<number, boolean>>({});
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);

  const currentExample = PARSED_EXAMPLES.find((ex) => ex.id === selectedExampleId) || PARSED_EXAMPLES[0];
  const isCurrentlyHidden = hiddenIerab[selectedExampleId] || false;

  const toggleHide = (id: number) => {
    sounds.playClick();
    setHiddenIerab((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getRoleBadgeColor = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'amber':
        return 'bg-amber-100 text-amber-950 border-amber-300';
      case 'sky':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  const getWordBgHighlight = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'border-emerald-400 bg-emerald-50 text-emerald-900';
      case 'amber':
        return 'border-amber-400 bg-amber-50 text-amber-950 ring-2 ring-amber-400/30';
      case 'sky':
        return 'border-sky-400 bg-sky-50 text-sky-950 ring-2 ring-sky-400/30';
      default:
        return 'border-stone-300 bg-stone-50';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Mascot Intro */}
      <MascotMessage
        message="هَيَّا بِنَا إِلَى المَيْدَانِ العَمَلِيِّ! لَدَيْنَا هُنَا 5 أَمْثِلَةٍ مَشْكُولَةٍ بِعِنَايَةٍ فَائِقَةٍ، مَعْرُوبَةٍ إِعْرَاباً كَامِلاً وَمُبَسَّطاً!"
        subtext="انْقُرْ عَلَى أَيِّ كَلِمَةٍ فِي الجُمْلَةِ لِتَكْتَشِفَ سِرَّهَا، أَوْ جَرِّبْ إِخْفَاءَ الإِعْرَابِ لِتَخْتَبِرَ ذَكَاءَكَ قَبْلَ كَشْفِ الحَلِّ!"
        variant="amber"
        emotion="happy"
      />

      {/* Sentence Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {PARSED_EXAMPLES.map((ex) => {
          const isSelected = ex.id === selectedExampleId;
          return (
            <button
              key={ex.id}
              onClick={() => {
                sounds.playClick();
                setSelectedExampleId(ex.id);
                setActiveWordIndex(null);
              }}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-md scale-105 ring-2 ring-amber-300'
                  : 'bg-white hover:bg-amber-50 text-stone-700 border border-stone-200'
              }`}
            >
              <span className="text-lg">{ex.icon}</span>
              <span>المِثَالُ {ex.id}:</span>
              <span className="truncate max-w-[130px] md:max-w-none">{ex.sentence}</span>
            </button>
          );
        })}
      </div>

      {/* Main Sentence Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-md space-y-6">
        {/* Sentence Header & Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{currentExample.icon}</span>
            <div>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                {currentExample.category}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-stone-900 mt-1">
                {currentExample.sentence}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio read button */}
            <button
              onClick={() => {
                sounds.playClick();
                speakArabic(currentExample.sentence);
              }}
              className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1.5 text-xs font-bold transition-all"
              title="استمع لنطق الجملة"
            >
              <Volume2 size={16} />
              <span>نُطْقُ الجُمْلَةِ</span>
            </button>

            {/* Hide/Show parsing toggle */}
            <button
              onClick={() => toggleHide(currentExample.id)}
              className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                isCurrentlyHidden
                  ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
              title="إخفاء الإعراب لاختبار النفس"
            >
              {isCurrentlyHidden ? <Eye size={16} /> : <EyeOff size={16} />}
              <span>{isCurrentlyHidden ? 'أَظْهِرِ الإِعْرَابَ النَّمُوذَجِيَّ' : 'اخْتَبِرْ نَفْسَكَ (إِخْفَاء)'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Word Cards (Clicking highlights) */}
        <div>
          <span className="text-xs font-bold text-stone-500 mb-2 block">
            انْقُرْ عَلَى كَلِمَاتِ الجُمْلَةِ لِمُشَاهَدَةِ تَفَاصِيلِهَا:
          </span>
          <div className="flex flex-wrap gap-3">
            {currentExample.words.map((w, idx) => {
              const isWordActive = activeWordIndex === idx;
              return (
                <div
                  key={w.word}
                  onClick={() => {
                    sounds.playClick();
                    setActiveWordIndex(idx);
                    speakArabic(`${w.vocalized}: ${w.fullIerab}`);
                  }}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center min-w-[120px] ${
                    isWordActive
                      ? getWordBgHighlight(w.color)
                      : 'border-stone-200 bg-stone-50/70 hover:bg-white hover:border-amber-300'
                  }`}
                >
                  <span className="text-2xl font-black mb-1">{w.vocalized}</span>
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${getRoleBadgeColor(w.color)}`}>
                    {w.role}
                  </span>
                  <span className="text-[10px] text-stone-500 mt-1 font-bold">
                    {w.questionTip}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pedagogical Explanation Box */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
            <Sparkles size={14} className="text-amber-600" />
            <span>كَيْفَ نُفَكِّرُ ذَكِيّاً مَعَ هَذِهِ الجُمْلَةِ؟</span>
          </div>
          <p className="text-sm md:text-base text-stone-800 font-medium leading-relaxed">
            {currentExample.simpleExplanation}
          </p>
          <div className="text-xs text-amber-800 font-bold pt-1">
            📌 قَاعِدَةٌ ذَهَبِيَّةٌ: {currentExample.memoryRule}
          </div>
        </div>

        {/* Full Detailed Parsing Table or Hidden Quiz mode */}
        {isCurrentlyHidden ? (
          <div className="p-8 rounded-2xl bg-purple-50/60 border-2 border-dashed border-purple-300 text-center space-y-3">
            <span className="text-4xl">🤔</span>
            <h3 className="text-lg font-black text-purple-950">
              وَضْعُ التَّحَدِّي مُفَعَّلٌ! حَاوِلْ إِعْرَابَ كَلِمَاتِ الجُمْلَةِ بِنَفْسِكَ:
            </h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              تَذَكَّرْ: مَنْ قَامَ بِالفِعْلِ هُوَ فَاعِلٌ مَرْفُوعٌ بِالضَّمَّةِ، وَمَا وَقَعَ عَلَيْهِ الفِعْلُ هُوَ مَفْعُولٌ بِهِ مَنْصُوبٌ بِالفَتْحَةِ!
            </p>
            <button
              onClick={() => {
                toggleHide(currentExample.id);
                onEarnStar();
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-sm transition-all"
            >
              كَشْفُ الإِعْرَابِ النَّمُوذَجِيِّ وَالتَّأَكُّدِ مِنَ الحَلِّ ✨
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border-2 border-stone-200">
            <div className="bg-stone-100 p-3.5 border-b border-stone-200 flex items-center justify-between">
              <span className="font-black text-sm text-stone-900">
                جَدْوَلُ الإِعْرَابِ النَّمُوذَجِيِّ المُبَسَّطِ (السَّنَة الثَّالِثَة):
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                إِعْرَابٌ كَامِلٌ مُشَكَّلٌ
              </span>
            </div>

            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-black text-stone-600">
                  <th className="p-3 w-32 md:w-44">الكَلِمَةُ</th>
                  <th className="p-3 w-36 hidden sm:table-cell">المَوْقِعُ وَالحَرَكَةُ</th>
                  <th className="p-3">الإِعْرَابُ التَّفْصِيلِيُّ الصَّحِيحُ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-sm md:text-base font-bold text-stone-800">
                {currentExample.words.map((w, idx) => (
                  <tr
                    key={w.word}
                    className={`transition-colors ${
                      activeWordIndex === idx ? 'bg-amber-100/50' : 'hover:bg-amber-50/30'
                    }`}
                  >
                    <td className="p-3.5 font-black text-lg text-amber-950 align-top">
                      <div className="flex items-center gap-1.5">
                        <span>{w.vocalized}</span>
                        <button
                          onClick={() => {
                            sounds.playClick();
                            speakArabic(w.fullIerab);
                          }}
                          className="text-stone-400 hover:text-stone-800"
                          title="استمع لإعراب هذه الكلمة"
                        >
                          <Volume2 size={15} />
                        </button>
                      </div>
                    </td>
                    <td className="p-3.5 align-top hidden sm:table-cell">
                      <span className={`inline-block text-xs font-black px-2 py-0.5 rounded-lg border ${getRoleBadgeColor(w.color)}`}>
                        {w.role}
                      </span>
                      <div className="text-xs text-stone-500 mt-1 font-medium">{w.haraka}</div>
                    </td>
                    <td className="p-3.5 text-stone-900 leading-relaxed font-bold align-top">
                      {w.fullIerab}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Button to proceed to next tab */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => {
            sounds.playClick();
            onGoToQuiz();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base md:text-lg shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-102"
        >
          <span>تَقَدَّمْ إِلَى بَنْكِ التَّمَارِينِ وَالتَّطْبِيقَاتِ التَّفَاعُلِيَّةِ</span>
          <ArrowRight size={20} className="rotate-180" />
        </button>
      </div>
    </div>
  );
};
