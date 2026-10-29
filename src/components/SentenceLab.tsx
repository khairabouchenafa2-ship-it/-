import React, { useState } from 'react';
import { Sparkles, Volume2, RefreshCw, Crown, Target, Play } from 'lucide-react';
import { LAB_WORDS } from '../data/curriculumData';
import { sounds, speakArabic } from '../utils/audio';
import { MascotMessage } from './MascotMessage';

interface SentenceLabProps {
  onEarnStar: () => void;
}

export const SentenceLab: React.FC<SentenceLabProps> = ({ onEarnStar }) => {
  const [selectedVerb, setSelectedVerb] = useState(LAB_WORDS.verbs[0]);
  const [selectedSubject, setSelectedSubject] = useState(LAB_WORDS.subjects[0]);
  const [selectedObject, setSelectedObject] = useState(LAB_WORDS.objects[0]);

  const fullSentence = `${selectedVerb.base} ${selectedSubject.vocalized} ${selectedObject.vocalized}.`;

  const handleSpeakSentence = () => {
    sounds.playClick();
    speakArabic(fullSentence);
  };

  const handleRandomize = () => {
    sounds.playClick();
    const v = LAB_WORDS.verbs[Math.floor(Math.random() * LAB_WORDS.verbs.length)];
    const s = LAB_WORDS.subjects[Math.floor(Math.random() * LAB_WORDS.subjects.length)];
    const o = LAB_WORDS.objects[Math.floor(Math.random() * LAB_WORDS.objects.length)];
    setSelectedVerb(v);
    setSelectedSubject(s);
    setSelectedObject(o);
    onEarnStar();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Mascot cheer */}
      <MascotMessage
        message="مَرْحَباً بِكُمْ فِي مُخْتَبَرِ الكَلِمَاتِ! هُنَا تَسْتَطِيعُ صِنَاعَةَ جُمَلٍ فِعْلِيَّةٍ كَثِيرَةٍ بِنَفْسِكَ!"
        subtext="رَاقِبْ كَيْفَ يَحْمِلُ الفَاعِلُ دَائِماً ضَمَّتَهُ الذَّهَبِيَّةَ ُ ، وَيَحْمِلُ المَفْعُولُ بِهِ فَتْحَتَهُ المَرِحَةَ َ !"
        variant="purple"
        emotion="teaching"
      />

      {/* Main Builder Board */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full">
              مُخْتَبَرُ التَّرْكِيبِ التَّفَاعُلِيِّ
            </span>
            <h2 className="text-xl md:text-2xl font-black text-stone-900 mt-1">
              اصْنَعْ جُمْلَتَكَ الفِعْلِيَّةَ وَشَاهِدْ إِعْرَابَهَا لَحْظِيّاً!
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomize}
              className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw size={15} />
              <span>جُمْلَةٌ عَشْوَائِيَّةٌ سِحْرِيَّةٌ</span>
            </button>
            <button
              onClick={handleSpeakSentence}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Volume2 size={16} />
              <span>نُطْقُ الجُمْلَةِ كَامِلَةً</span>
            </button>
          </div>
        </div>

        {/* Live Sentence Display */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg text-center space-y-4">
          <span className="text-xs font-bold text-amber-100 tracking-wider">
            الجُمْلَةُ الفِعْلِيَّةُ المُتَكَامِلَةُ:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 text-3xl md:text-5xl font-black">
            <span className="bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-xs border border-white/30">
              {selectedVerb.base}
            </span>
            <span className="bg-amber-400 text-amber-950 px-4 py-2 rounded-2xl shadow-sm border-2 border-white/50">
              {selectedSubject.vocalized}
            </span>
            <span className="bg-sky-400 text-sky-950 px-4 py-2 rounded-2xl shadow-sm border-2 border-white/50">
              {selectedObject.vocalized}
            </span>
          </div>

          <div className="flex justify-center gap-3 text-xs md:text-sm font-bold text-amber-100 pt-2">
            <span className="flex items-center gap-1">
              <span>{selectedVerb.icon}</span> فِعْلٌ مَاضٍ
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-yellow-200">
              <Crown size={15} /> فَاعِلٌ (مَرْفُوعٌ بِالضَّمَّةِ ُ)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-sky-200">
              <Target size={15} /> مَفْعُولٌ بِهِ (مَنْصُوبٌ بِالفَتْحَةِ َ)
            </span>
          </div>
        </div>

        {/* Word Selectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Verbs Column */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded-md">
                1. اخْتَرِ الفِعْلَ
              </span>
              <span className="text-xs text-stone-500">حَرَكَةٌ وَعَمَلٌ</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {LAB_WORDS.verbs.map((v) => {
                const isSelected = selectedVerb.base === v.base;
                return (
                  <button
                    key={v.base}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedVerb(v);
                    }}
                    className={`p-2.5 rounded-xl text-center font-black transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs scale-102 ring-2 ring-emerald-300'
                        : 'bg-white hover:bg-emerald-100/60 text-stone-800 border border-emerald-200'
                    }`}
                  >
                    <span className="text-lg block mb-0.5">{v.icon}</span>
                    <span className="text-base">{v.base}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Subjects Column */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-950 bg-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Crown size={12} />
                2. اخْتَرِ الفَاعِلَ (الضَّمَّةُ ُ)
              </span>
              <span className="text-xs text-stone-500">مَنْ قَامَ بِالفِعْلِ</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {LAB_WORDS.subjects.map((s) => {
                const isSelected = selectedSubject.base === s.base;
                return (
                  <button
                    key={s.base}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedSubject(s);
                    }}
                    className={`p-2.5 rounded-xl text-center font-black transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-xs scale-102 ring-2 ring-amber-300'
                        : 'bg-white hover:bg-amber-100/60 text-stone-800 border border-amber-200'
                    }`}
                  >
                    <span className="text-lg block mb-0.5">{s.icon}</span>
                    <span className="text-base">{s.vocalized}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Objects Column */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border-2 border-sky-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-sky-950 bg-sky-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Target size={12} />
                3. اخْتَرِ المَفْعُولَ بِهِ (الفَتْحَةُ َ)
              </span>
              <span className="text-xs text-stone-500">مَا وَقَعَ عَلَيْهِ</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {LAB_WORDS.objects.map((o) => {
                const isSelected = selectedObject.base === o.base;
                return (
                  <button
                    key={o.base}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedObject(o);
                    }}
                    className={`p-2.5 rounded-xl text-center font-black transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-xs scale-102 ring-2 ring-sky-300'
                        : 'bg-white hover:bg-sky-100/60 text-stone-800 border border-sky-200'
                    }`}
                  >
                    <span className="text-lg block mb-0.5">{o.icon}</span>
                    <span className="text-base">{o.vocalized}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Parsing Breakdown */}
        <div className="p-5 rounded-2xl bg-stone-50 border-2 border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-stone-700">
              الإِعْرَابُ التَّلْقَائِيُّ لِلْجُمْلَةِ الَّتِي رَكَّبْتَهَا:
            </span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
              نَحْوٌ فَوْرِيٌّ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1">
              <span className="text-xs text-emerald-700 font-bold">1. الفِعْلُ:</span>
              <div className="text-lg font-black text-emerald-950">{selectedVerb.base}</div>
              <p className="text-xs text-stone-600 font-medium">
                فِعْلٌ مَاضٍ مَبْنِيٌّ عَلَى الفَتْحِ الظَّاهِرِ عَلَى آخِرِهِ.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-amber-300 space-y-1">
              <span className="text-xs text-amber-700 font-bold">2. الفَاعِلُ (مَنْ؟):</span>
              <div className="text-lg font-black text-amber-950">{selectedSubject.vocalized}</div>
              <p className="text-xs text-stone-600 font-medium">
                فَاعِلٌ مَرْفُوعٌ وَعَلامَةُ رَفْعِهِ الضَّمَّةُ الظَّاهِرَةُ عَلَى آخِرِهِ.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-sky-300 space-y-1">
              <span className="text-xs text-sky-700 font-bold">3. المَفْعُولُ بِهِ (مَاذَا؟):</span>
              <div className="text-lg font-black text-sky-950">{selectedObject.vocalized}</div>
              <p className="text-xs text-stone-600 font-medium">
                مَفْعُولٌ بِهِ مَنْصُوبٌ وَعَلامَةُ نَصْبِهِ الفَتْحَةُ الظَّاهِرَةُ عَلَى آخِرِهِ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
