import React, { useState } from 'react';
import { Crown, Target, Sparkles, ArrowRight, Volume2, CheckCircle2, Lightbulb } from 'lucide-react';
import { CORE_LESSONS } from '../data/curriculumData';
import { MascotMessage } from './MascotMessage';
import { sounds, speakArabic } from '../utils/audio';

interface GrammarLessonsProps {
  onGoToExamples: () => void;
  onEarnStar: () => void;
}

export const GrammarLessons: React.FC<GrammarLessonsProps> = ({ onGoToExamples, onEarnStar }) => {
  const [activeTab, setActiveTab] = useState<'subject' | 'object' | 'compare'>('subject');
  const [revealedTip, setRevealedTip] = useState(false);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Teacher Mascot intro */}
      <MascotMessage
        message="أَهْلاً بِكُمْ فِي قَلْعَةِ الإِعْرَابِ! كَلِمَةُ «الإِعْرَابِ» يَا صِغَارِي تَعْنِي: مَعْرِفَةَ دَوْرِ الكَلِمَةِ وَالحَرَكَةِ الَّتِي تَرْكَبُ فَوْقَ حَرْفِهَا الأَخِيرِ!"
        subtext="اليَوْمَ سَنَتَعَلَّمُ قَاعِدَتَيْنِ ذَهَبِيَّتَيْنِ: الفَاعِلَ المَرْفُوعَ بِالضَّمَّةِ ُ ، وَالمَفْعُولَ بِهِ المَنْصُوبَ بِالفَتْحَةِ َ !"
        variant="emerald"
        emotion="teaching"
      />

      {/* Lesson Switcher Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-white border-2 border-stone-200 shadow-xs">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('subject');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
              activeTab === 'subject'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Crown size={18} />
            <span>1. دَرْسُ الفَاعِلِ (الضَّمَّةُ ُ)</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('object');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
              activeTab === 'object'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Target size={18} />
            <span>2. دَرْسُ المَفْعُولِ بِهِ (الفَتْحَةُ َ)</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('compare');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
              activeTab === 'compare'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Sparkles size={18} />
            <span>3. جَدْوَلُ المُقَارَنَةِ السَّحِيرِ</span>
          </button>
        </div>
      </div>

      {/* Lesson 1: The Subject (الفاعل) */}
      {activeTab === 'subject' && (
        <div className="bg-gradient-to-br from-white via-amber-50/60 to-orange-50/30 rounded-3xl p-6 md:p-8 border-2 border-amber-300 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-white flex items-center justify-center text-3xl shadow-sm border border-amber-300">
                👑
              </div>
              <div>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                  {CORE_LESSONS.subject.badge}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-amber-950 mt-1">
                  {CORE_LESSONS.subject.title}
                </h2>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                speakArabic(
                  `${CORE_LESSONS.subject.title}. ${CORE_LESSONS.subject.whoIsIt} ${CORE_LESSONS.subject.magicQuestion} إعرابه المباشر: ${CORE_LESSONS.subject.ruleIerab}`
                );
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs shadow-xs border border-amber-300"
            >
              <Volume2 size={16} />
              <span>اسْتَمِعْ لِشَرْحِ الفَاعِلِ</span>
            </button>
          </div>

          {/* Cards Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border-2 border-amber-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
                <span className="text-xl">🤔</span>
                <span>مَنْ هُوَ الفَاعِلُ؟</span>
              </div>
              <p className="text-base font-bold text-stone-800 leading-relaxed">
                {CORE_LESSONS.subject.whoIsIt}
              </p>
              <p className="text-xs text-stone-500 font-medium">
                (لَا يُوجَدُ فِعْلٌ فِي الدُّنْيَا بِدُونِ فَاعِلٍ قَامَ بِهِ!)
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border-2 border-amber-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
                <span className="text-xl">🔍</span>
                <span>السُّؤَالُ السِّحْرِيُّ لِكَشْفِهِ:</span>
              </div>
              <p className="text-base font-bold text-amber-950 leading-relaxed">
                {CORE_LESSONS.subject.magicQuestion}
              </p>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-sm font-black text-amber-900">
                {CORE_LESSONS.subject.magicExample}
              </div>
            </div>
          </div>

          {/* Direct Parsing Formula */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown size={22} className="text-yellow-200" />
                <span className="font-black text-sm text-yellow-100">
                  الإِعْرَابُ المَبَاشِرُ المَحْفُوظُ لِلْفَاعِلِ:
                </span>
              </div>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">
                حَرَكَتُهُ: الضَّمَّةُ ( ُ )
              </span>
            </div>

            <div className="text-center py-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/20">
              <p className="text-xl md:text-2xl font-black tracking-wide">
                «{CORE_LESSONS.subject.ruleIerab}»
              </p>
            </div>

            <p className="text-xs text-yellow-100 text-center font-medium">
              احْفَظْ هَذِهِ الجُمْلَةَ الإِعْرَابِيَّةَ جَيِّداً مِثْلَ اسْمِكَ يَا بَطَلَ الإِعْرَابِ!
            </p>
          </div>

          {/* Crown visual representation */}
          <div className="p-4 rounded-2xl bg-amber-100/70 border border-amber-300 flex items-center gap-3">
            <span className="text-3xl">💡</span>
            <div className="text-sm text-amber-950 font-bold leading-relaxed">
              <span className="font-black">سِرٌّ ذَكِيٌّ:</span> تَخَيَّلِ الضَّمَّةَ ( ُ ) كَأَنَّهَا تَاجٌ صَغِيرٌ يَلْبَسُهُ الفَاعِلُ فَوْقَ رَأْسِهِ لِأَنَّهُ المَلِكُ الَّذِي أَنْجَزَ الفِعْلَ!
            </div>
          </div>
        </div>
      )}

      {/* Lesson 2: The Object (المفعول به) */}
      {activeTab === 'object' && (
        <div className="bg-gradient-to-br from-white via-sky-50/60 to-blue-50/30 rounded-3xl p-6 md:p-8 border-2 border-sky-300 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-3xl shadow-sm border border-sky-400">
                🎯
              </div>
              <div>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  {CORE_LESSONS.object.badge}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-sky-950 mt-1">
                  {CORE_LESSONS.object.title}
                </h2>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                speakArabic(
                  `${CORE_LESSONS.object.title}. ${CORE_LESSONS.object.whoIsIt} ${CORE_LESSONS.object.magicQuestion} إعرابه المباشر: ${CORE_LESSONS.object.ruleIerab}`
                );
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-xs shadow-xs border border-sky-300"
            >
              <Volume2 size={16} />
              <span>اسْتَمِعْ لِشَرْحِ المَفْعُولِ بِهِ</span>
            </button>
          </div>

          {/* Cards Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border-2 border-sky-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-sky-800 font-black text-sm">
                <span className="text-xl">🤔</span>
                <span>مَنْ هُوَ المَفْعُولُ بِهِ؟</span>
              </div>
              <p className="text-base font-bold text-stone-800 leading-relaxed">
                {CORE_LESSONS.object.whoIsIt}
              </p>
              <p className="text-xs text-stone-500 font-medium">
                (هُوَ الشَّيْءُ الَّذِي أَكَلْنَاهُ، أَوْ شَرِبْنَاهُ، أَوْ كَتَبْنَاهُ، أَوْ رَسَمْنَاهُ!)
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border-2 border-sky-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-sky-800 font-black text-sm">
                <span className="text-xl">🔍</span>
                <span>السُّؤَالُ السِّحْرِيُّ لِكَشْفِهِ:</span>
              </div>
              <p className="text-base font-bold text-sky-950 leading-relaxed">
                {CORE_LESSONS.object.magicQuestion}
              </p>
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sm font-black text-sky-900">
                {CORE_LESSONS.object.magicExample}
              </div>
            </div>
          </div>

          {/* Direct Parsing Formula */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target size={22} className="text-sky-200" />
                <span className="font-black text-sm text-sky-100">
                  الإِعْرَابُ المَبَاشِرُ المَحْفُوظُ لِلْمَفْعُولِ بِهِ:
                </span>
              </div>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">
                حَرَكَتُهُ: الفَتْحَةُ ( َ )
              </span>
            </div>

            <div className="text-center py-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/20">
              <p className="text-xl md:text-2xl font-black tracking-wide">
                «{CORE_LESSONS.object.ruleIerab}»
              </p>
            </div>

            <p className="text-xs text-sky-100 text-center font-medium">
              احْفَظْ هَذِهِ القَاعِدَةَ: المَفْعُولُ بِهِ مَنْصُوبٌ دَائِماً وَعَلَامَتُهُ الفَتْحَةُ الظَّاهِرَةُ!
            </p>
          </div>

          {/* Target visual hint */}
          <div className="p-4 rounded-2xl bg-sky-100/70 border border-sky-300 flex items-center gap-3">
            <span className="text-3xl">💡</span>
            <div className="text-sm text-sky-950 font-bold leading-relaxed">
              <span className="font-black">سِرٌّ ذَكِيٌّ:</span> الفَتْحَةُ ( َ ) خَفِيفَةٌ وَمَرِحَةٌ، تَقِفُ فَوْقَ رَأْسِ المَفْعُولِ بِهِ لِأَنَّهُ اسْتَقْبَلَ الفِعْلَ بِكُلِّ سُرُورٍ!
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {activeTab === 'compare' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-purple-200 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              مُلَخَّصٌ سَرِيعٌ فِي ثَوَانٍ
            </span>
            <h2 className="text-xl md:text-2xl font-black text-stone-900">
              مُقَارَنَةٌ بَيْنَ الفَاعِلِ وَالمَفْعُولِ بِهِ
            </h2>
            <p className="text-sm text-stone-600 font-medium">
              هَذَا الجَدْوَلُ يَمْنَعُكَ مِنَ الخَلْطِ بَيْنَهُمَا نِهَائِيّاً!
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse rounded-2xl overflow-hidden border border-stone-200">
              <thead>
                <tr className="bg-stone-100 text-stone-900 border-b border-stone-200 font-black text-sm md:text-base">
                  <th className="p-4">وَجْهُ المُقَارَنَةِ</th>
                  <th className="p-4 bg-amber-50 text-amber-950 border-r border-stone-200">
                    👑 الفَاعِلُ (Subject)
                  </th>
                  <th className="p-4 bg-sky-50 text-sky-950 border-r border-stone-200">
                    🎯 المَفْعُولُ بِهِ (Object)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-sm md:text-base font-bold text-stone-800">
                <tr>
                  <td className="p-4 bg-stone-50 font-black text-stone-700">مَعْنَاهُ</td>
                  <td className="p-4 bg-amber-50/40 border-r border-stone-200">مَنْ قَامَ بِالفِعْلِ</td>
                  <td className="p-4 bg-sky-50/40 border-r border-stone-200">مَا وَقَعَ عَلَيْهِ الفِعْلُ</td>
                </tr>
                <tr>
                  <td className="p-4 bg-stone-50 font-black text-stone-700">السُّؤَالُ عَنْهُ</td>
                  <td className="p-4 bg-amber-50/40 border-r border-stone-200 text-amber-900 font-black">
                    بِـ «مَنْ؟»
                  </td>
                  <td className="p-4 bg-sky-50/40 border-r border-stone-200 text-sky-900 font-black">
                    بِـ «مَاذَا؟»
                  </td>
                </tr>
                <tr>
                  <td className="p-4 bg-stone-50 font-black text-stone-700">الحَالَةُ الإِعْرَابِيَّةُ</td>
                  <td className="p-4 bg-amber-50/40 border-r border-stone-200 text-amber-900 font-black">
                    مَرْفُوعٌ 👑
                  </td>
                  <td className="p-4 bg-sky-50/40 border-r border-stone-200 text-sky-900 font-black">
                    مَنْصُوبٌ 🎯
                  </td>
                </tr>
                <tr>
                  <td className="p-4 bg-stone-50 font-black text-stone-700">الحَرَكَةُ الظَّاهِرَةُ</td>
                  <td className="p-4 bg-amber-50/40 border-r border-stone-200">
                    الضَّمَّةُ ( ُ ) فَوْقَ آخِرِهِ
                  </td>
                  <td className="p-4 bg-sky-50/40 border-r border-stone-200">
                    الفَتْحَةُ ( َ ) فَوْقَ آخِرِهِ
                  </td>
                </tr>
                <tr>
                  <td className="p-4 bg-stone-50 font-black text-stone-700">مِثَالٌ مَشْكُولٌ</td>
                  <td className="p-4 bg-amber-50/40 border-r border-stone-200 font-black text-amber-950">
                    قَرَأَ <span className="underline decoration-amber-500">مُحَمَّدُ</span>
                  </td>
                  <td className="p-4 bg-sky-50/40 border-r border-stone-200 font-black text-sky-950">
                    قَرَأَ مُحَمَّدٌ <span className="underline decoration-sky-500">الكِتَابَ</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Golden Sentence Formula */}
          <div className="p-5 rounded-2xl bg-stone-900 text-white text-center space-y-2">
            <span className="text-xs font-bold text-amber-300">مُعَادَلَةُ الجُمْلَةِ الفِعْلِيَّةِ النَّمُوذَجِيَّةِ:</span>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-base md:text-xl font-black py-1">
              <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white">فِعْلٌ (مَاضٍ)</span>
              <span className="text-stone-400">+</span>
              <span className="px-3 py-1 rounded-xl bg-amber-500 text-white">فَاعِلٌ (مَرْفُوعٌ بِالضَّمَّةِ ُ)</span>
              <span className="text-stone-400">+</span>
              <span className="px-3 py-1 rounded-xl bg-sky-600 text-white">مَفْعُولٌ بِهِ (مَنْصُوبٌ بِالفَتْحَةِ َ)</span>
            </div>
          </div>
        </div>
      )}

      {/* Button to proceed to next tab */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => {
            sounds.playClick();
            onGoToExamples();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-base md:text-lg shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-102"
        >
          <span>تَقَدَّمْ إِلَى النَّمَاذِجِ الإِعْرَابِيَّةِ الخَمْسَةِ المَشْكُولَةِ</span>
          <ArrowRight size={20} className="rotate-180" />
        </button>
      </div>
    </div>
  );
};
