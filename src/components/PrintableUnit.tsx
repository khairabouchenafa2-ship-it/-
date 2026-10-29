import React, { useRef } from 'react';
import { Printer, BookOpen, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import {
  MASCOT,
  STORY_CHARACTERS,
  SENTENCE_TYPES_DATA,
  CORE_LESSONS,
  PARSED_EXAMPLES,
  MCQ_QUESTIONS,
  DIACRITICS_QUESTIONS,
  PARSING_EXERCISES,
  MOTIVATIONAL_PHRASES,
} from '../data/curriculumData';

export const PrintableUnit: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Print Control Bar (Hidden when printing) */}
      <div className="bg-white rounded-3xl p-5 border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl border border-amber-300">
            📄
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-stone-900">
              النُّسْخَةُ الكِتَابِيَّةُ الكَامِلَةُ لِلْوَحْدَةِ (لِلتَّلَامِيذِ وَالمُعَلِّمِينَ)
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              مُحْتَوًى تَعْلِيمِيٌّ مُشَكَّلٌ تَشْكِيلاً تَامّاً جَاهِزٌ لِلْقِرَاءَةِ أَوِ الطِّبَاعَةِ الوَرَقِيَّةِ.
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
        >
          <Printer size={18} />
          <span>طِبَاعَةُ كُرَّاسِ الوَحْدَةِ (PRINT)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* Full Pedagogical Written Booklet (Printable)                             */}
      {/* ========================================================================= */}
      <article className="bg-white rounded-3xl p-8 md:p-12 border-2 border-stone-200 shadow-sm space-y-10 print:border-none print:p-0 print:shadow-none text-stone-900 leading-relaxed">
        {/* Document Header */}
        <header className="text-center pb-8 border-b-2 border-stone-200 space-y-3">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs border border-amber-300">
            جُمْهُورِيَّةُ اللُّغَةِ العَرَبِيَّةِ • المَرْحَلَةُ الِابْتِدَائِيَّةُ (السَّنَة الثَّالِثَة - 8-9 سَنَوَات)
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-stone-900 tracking-tight">
            وَحْدَةُ تَعْلِيمِ الإِعْرَابِ: الفَاعِلُ وَالمَفْعُولُ بِهِ
          </h1>
          <p className="text-sm md:text-base text-stone-600 font-medium max-w-2xl mx-auto">
            مَنْهَجٌ قَصَصِيٌّ وَتَطْبِيقِيٌّ مُبَسَّطٌ مَضْبُوطٌ بِالشَّكْلِ التَّامِّ وَالحَرَكَاتِ
          </p>
          <div className="text-xs text-stone-400">إِعْدَادُ: خَبِيرُ تَعْلِيمِ اللُّغَةِ العَرَبِيَّةِ • {MASCOT.name}</div>
        </header>

        {/* ------------------------------------------------------------------- */}
        {/* 1. المقدمة المبسطة والقصة                                          */}
        {/* ------------------------------------------------------------------- */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b-2 border-amber-400 pb-2">
            <span className="text-2xl">📖</span>
            <h2 className="text-xl md:text-2xl font-black text-amber-950">
              أَوَّلاً: مُقَدِّمَةٌ قَصَصِيَّةٌ مُمْتِعَةٌ (عَلَى لِسَانِ المُعَلِّمِ الذَّكِيِّ «فَصِيح»)
            </h2>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-stone-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-black text-base">
              <span>🦉</span>
              <span>كَلِمَةُ المُعَلِّمِ الذَّكِيِّ:</span>
            </div>
            <p className="text-base font-bold leading-loose text-justify">
              «{MASCOT.welcomeGreeting}»
            </p>
          </div>

          {/* Story of the 3 friends */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-stone-900">
              1. قِصَّةُ أَقْسَامِ الكَلِمَةِ: مَمْلَكَةُ الأَصْدِقَاءِ الثَّلَاثَةِ
            </h3>
            <p className="text-base text-stone-800 leading-loose text-justify">
              فِي مَمْلَكَةِ اللُّغَةِ العَرَبِيَّةِ، كُلُّ كَلِمَةٍ نَقْرَؤُهَا أَوْ نَكْتُبُهَا تَنْتَمِي إِلَى وَاحِدٍ مِنْ ثَلَاثَةِ فُرْسَانٍ أَوْفِيَاءَ:
            </p>

            <div className="space-y-4 pr-2">
              {STORY_CHARACTERS.map((char) => (
                <div key={char.name} className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{char.avatar}</span>
                    <h4 className="font-black text-base text-stone-900">{char.name}</h4>
                    <span className="text-xs bg-white border border-stone-300 px-2 py-0.5 rounded-md font-bold text-stone-600">
                      {char.badge}
                    </span>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed font-medium">
                    {char.description}
                  </p>
                  <p className="text-xs font-black text-amber-800">
                    أَمْثِلَةٌ مَشْكُولَةٌ: {char.examples.join(' • ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Verbal vs Nominal */}
          <div className="space-y-3 pt-3">
            <h3 className="text-lg font-black text-stone-900">
              2. أَنْوَاعُ الجُمَلِ: الجُمْلَةُ الفِعْلِيَّةُ وَالجُمْلَةُ الاسْمِيَّةُ
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">
              لِكَيْ نَعْرِفَ نَوْعَ أَيِّ جُمْلَةٍ، نَنْظُرُ دَائِماً إِلَى الكَلِمَةِ الأُولَى الَّتِي تَقِفُ فِي مُقَدِّمَتِهَا:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 space-y-2">
                <h4 className="font-black text-base text-emerald-950">
                  أ. الجُمْلَةُ الفِعْلِيَّةُ (تَبْدَأُ بِـ فِعْلٍ)
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  تَدُلُّ عَلَى حَرَكَةٍ وَعَمَلٍ. مِثَالٌ: «طَارَ العُصْفُورُ فِي السَّمَاءِ» (طَارَ = فِعْلٌ).
                </p>
                <div className="text-xs font-bold text-emerald-900 bg-emerald-100/80 p-2 rounded-lg">
                  أَمْثِلَةٌ مَشْكُولَةٌ: «يَزْرَعُ الفَلَّاحُ القَمْحَ» • «جَلَسَ التِّلْمِيذُ»
                </div>
              </div>

              <div className="p-4 rounded-xl border border-blue-300 bg-blue-50/40 space-y-2">
                <h4 className="font-black text-base text-blue-950">
                  ب. الجُمْلَةُ الاسْمِيَّةُ (تَبْدَأُ بِـ اسْمٍ)
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  تَدُلُّ عَلَى شَيْءٍ هَادِئٍ أَوْ وَصْفٍ. مِثَالٌ: «الشَّمْسُ سَاطِعَةٌ» (الشَّمْسُ = اسْمٌ).
                </p>
                <div className="text-xs font-bold text-blue-900 bg-blue-100/80 p-2 rounded-lg">
                  أَمْثِلَةٌ مَشْكُولَةٌ: «الكِتَابُ مُفِيدٌ» • «الوَرْدَةُ جَمِيلَةٌ»
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------- */}
        {/* 2. دروس ومفاهيم أساسية (مع التشكيل وبخط واضح)                     */}
        {/* ------------------------------------------------------------------- */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b-2 border-amber-400 pb-2">
            <span className="text-2xl">🎓</span>
            <h2 className="text-xl md:text-2xl font-black text-amber-950">
              ثَانِياً: دُرُوسٌ وَمَفَاهِيمُ نَحْوِيَّةٌ أَسَاسِيَّةٌ (الفَاعِلُ وَالمَفْعُولُ بِهِ)
            </h2>
          </div>

          {/* Lesson Subject */}
          <div className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-amber-950">
                1. دَرْسُ الفَاعِلِ (مَنْ قَامَ بِالفِعْلِ؟)
              </h3>
              <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                عَلَامَتُهُ: الضَّمَّةُ ( ُ )
              </span>
            </div>
            <ul className="text-sm text-stone-800 space-y-1.5 list-disc list-inside font-medium leading-loose">
              <li><span className="font-black">تَعْرِيفُهُ:</span> هُوَ اسْمٌ يَدُلُّ عَلَى مَنْ قَامَ بِالفِعْلِ أَوْ صَدَرَ مِنْهُ العَمَلُ.</li>
              <li><span className="font-black">كَيْفَ نَعْرِفُهُ؟</span> نَسْأَلُ عَنْهُ دَائِماً بِأَدَاةِ الِاسْتِفْهَامِ: «مَنْ؟».</li>
              <li><span className="font-black">مِثَالٌ تَوْضِيحِيٌّ:</span> «كَتَبَ التِّلْمِيذُ» 👈 مَنْ كَتَبَ؟ «التِّلْمِيذُ» هُوَ الفَاعِلُ.</li>
            </ul>
            <div className="p-3 bg-amber-200/80 rounded-xl text-center font-black text-base md:text-lg text-amber-950 border border-amber-300">
              قَاعِدَةُ الإِعْرَابِ المَبَاشِرِ: «فَاعِلٌ مَرْفُوعٌ وَعَلامَةُ رَفْعِهِ الضَّمَّةُ الظَّاهِرَةُ عَلَى آخِرِهِ.»
            </div>
          </div>

          {/* Lesson Object */}
          <div className="p-5 rounded-2xl border-2 border-sky-300 bg-sky-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-sky-950">
                2. دَرْسُ المَفْعُولِ بِهِ (مَاذَا وَقَعَ عَلَيْهِ الفِعْلُ؟)
              </h3>
              <span className="text-xs font-bold bg-sky-200 text-sky-900 px-2 py-0.5 rounded-full">
                عَلَامَتُهُ: الفَتْحَةُ ( َ )
              </span>
            </div>
            <ul className="text-sm text-stone-800 space-y-1.5 list-disc list-inside font-medium leading-loose">
              <li><span className="font-black">تَعْرِيفُهُ:</span> هُوَ اسْمٌ يَدُلُّ عَلَى مَا وَقَعَ عَلَيْهِ فِعْلُ الفَاعِلِ.</li>
              <li><span className="font-black">كَيْفَ نَعْرِفُهُ؟</span> نَسْأَلُ عَنْهُ دَائِماً بِأَدَاةِ الِاسْتِفْهَامِ: «مَاذَا؟».</li>
              <li><span className="font-black">مِثَالٌ تَوْضِيحِيٌّ:</span> «أَكَلَ الأَرْنَبُ الجَزَرَةَ» 👈 مَاذَا أَكَلَ الأَرْنَبُ؟ «الجَزَرَةَ» هِيَ المَفْعُولُ بِهِ.</li>
            </ul>
            <div className="p-3 bg-sky-200/80 rounded-xl text-center font-black text-base md:text-lg text-sky-950 border border-sky-300">
              قَاعِدَةُ الإِعْرَابِ المَبَاشِرِ: «مَفْعُولٌ بِهِ مَنْصُوبٌ وَعَلامَةُ نَصْبِهِ الفَتْحَةُ الظَّاهِرَةُ عَلَى آخِرِهِ.»
            </div>
          </div>

          {/* 5 Parsed sentences */}
          <div className="space-y-4 pt-3">
            <h3 className="text-lg font-black text-stone-900">
              3. خَمْسَةُ أَمْثِلَةٍ مُعْرَبَةٍ إِعْرَاباً كَامِلاً وَمُبَسَّطاً
            </h3>

            <div className="space-y-4">
              {PARSED_EXAMPLES.map((ex) => (
                <div key={ex.id} className="p-4 rounded-xl border border-stone-300 bg-stone-50/50 space-y-2">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                    <span className="font-black text-lg text-stone-900">
                      المِثَالُ {ex.id}: «{ex.sentence}»
                    </span>
                    <span className="text-xs text-stone-500 font-bold">{ex.category}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs md:text-sm border-collapse">
                      <thead>
                        <tr className="bg-stone-200/60 font-black">
                          <th className="p-2 border border-stone-300 w-28">الكَلِمَةُ</th>
                          <th className="p-2 border border-stone-300">الإِعْرَابُ التَّامُّ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ex.words.map((w) => (
                          <tr key={w.word} className="border-b border-stone-200">
                            <td className="p-2 font-black text-stone-900 border border-stone-300">
                              {w.vocalized}
                            </td>
                            <td className="p-2 text-stone-800 font-medium border border-stone-300">
                              {w.fullIerab}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------- */}
        {/* 3. بنك التمارين والتطبيقات التفاعلية                                */}
        {/* ------------------------------------------------------------------- */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b-2 border-amber-400 pb-2">
            <span className="text-2xl">📝</span>
            <h2 className="text-xl md:text-2xl font-black text-amber-950">
              ثَالِثاً: بَنْكُ التَّمَارِينِ وَالتَّطْبِيقَاتِ (أَوْرَاقُ عَمَلٍ لِلتَّلْمِيذِ)
            </h2>
          </div>

          {/* Part 1 */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-black text-stone-900">
              الجُزْءُ الأَوَّلُ: أَسْئِلَةُ الِاخْتِيَارِ مِن مُتَعَدِّدٍ (اسْتِخْرَاجُ الفَاعِلِ أَوِ المَفْعُولِ بِهِ)
            </h3>
            <div className="space-y-2.5">
              {MCQ_QUESTIONS.map((q, i) => (
                <div key={q.id} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1.5 text-sm">
                  <p className="font-black text-stone-900">
                    {i + 1}. {q.question}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-stone-700 pr-3">
                    {q.options.map((opt) => (
                      <span key={opt.id} className="border border-stone-300 px-3 py-1 rounded-lg bg-white">
                        ( {opt.id} ) {opt.text} {opt.isCorrect && '✓ (الحَلُّ)'}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Part 2 */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base md:text-lg font-black text-stone-900">
              الجُزْءُ الثَّانِي: مَلْءُ الفَرَاغِ بِالحَرَكَةِ المُنَاسِبَةِ (الضَّمَّةُ ُ أَوِ الفَتْحَةُ َ)
            </h3>
            <div className="space-y-2 text-sm font-bold text-stone-800">
              {DIACRITICS_QUESTIONS.map((q, i) => (
                <div key={q.id} className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center justify-between">
                  <span>
                    {i + 1}. {q.sentenceContext}
                  </span>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                    الحَلُّ: {q.role} 👈 ({q.options.find((o) => o.isCorrect)?.symbol})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Part 3 */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base md:text-lg font-black text-stone-900">
              الجُزْءُ الثَّالِثُ: ثَلَاثُ جُمَلٍ بَسِيطَةٍ لِلْإِعْرَابِ كَامِلاً (مَعَ النَّمُوذَجِ الصَّائِبِ)
            </h3>
            <div className="space-y-3">
              {PARSING_EXERCISES.map((ex, i) => (
                <div key={ex.id} className="p-4 rounded-xl border border-purple-300 bg-purple-50/30 space-y-2 text-sm">
                  <div className="flex items-center justify-between font-black text-stone-900">
                    <span>{i + 1}. أَعْرِبْ مَا يَأْتِي: «{ex.sentence}»</span>
                    <span className="text-xs bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md">
                      {ex.targetRoleLabel}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-purple-200 text-xs md:text-sm font-bold text-stone-800">
                    <span className="text-emerald-700 font-black">النَّمُوذَجُ الصَّائِبُ:</span> {ex.modelAnswer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------- */}
        {/* 4. تعزيز وتحفيز                                                     */}
        {/* ------------------------------------------------------------------- */}
        <section className="space-y-4 border-t-2 border-stone-200 pt-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            <h2 className="text-xl md:text-2xl font-black text-amber-950">
              رَابِعاً: عِبَارَاتُ الثَّنَاءِ وَالتَّعْزِيزِ لِلتَّشْجِيعِ
            </h2>
          </div>
          <p className="text-sm text-stone-600 font-medium">
            يَسْتَخْدِمُهَا المُعَلِّمُ وَالأَبَوَانِ لِتَحْفِيزِ البَطَلِ الصَّغِيرِ عِنْدَ الإِجَابَةِ الصَّحِيحَةِ:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {MOTIVATIONAL_PHRASES.map((phrase, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 font-black text-xs md:text-sm text-center shadow-2xs"
              >
                {phrase}
              </div>
            ))}
          </div>
        </section>

        {/* Teacher Signature & Seal */}
        <footer className="pt-8 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-500">
          <div>
            <span>وِحْدَةُ الإِعْرَابِ المُيَسَّرِ • الصَّفُّ الثَّالِثُ الِابْتِدَائِيُّ</span>
          </div>
          <div className="font-bold text-stone-700">
            تَوْقِيعُ خَبِيرِ اللُّغَةِ العَرَبِيَّةِ: الأُسْتَاذُ فَصِيح 🦉
          </div>
        </footer>
      </article>
    </div>
  );
};
