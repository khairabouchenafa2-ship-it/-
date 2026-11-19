import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  RefreshCw,
  Crown,
  Target,
  BookOpen,
  FlaskConical,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { LAB_ENHANCED_DATA } from '../data/curriculumData';
import { LabVerbItem, LabSubjectItem, LabObjectItem } from '../types';
import { sounds, speakArabic } from '../utils/audio';
import { MascotMessage } from './MascotMessage';
import { LittleGrammarDictionary } from './LittleGrammarDictionary';
import { VocalizedWord } from './VocalizedWord';

interface SentenceLabProps {
  onEarnStar: (rewardId?: string) => void;
  onDictionaryLookup: (termId: string) => void;
  lookedUpDictionaryIds: string[];
}

export const SentenceLab: React.FC<SentenceLabProps> = ({
  onEarnStar,
  onDictionaryLookup,
  lookedUpDictionaryIds,
}) => {
  const [activeLabTab, setActiveLabTab] = useState<'both' | 'builder' | 'dictionary'>('both');
  const [tense, setTense] = useState<'past' | 'present'>('past');
  const [semanticMode, setSemanticMode] = useState<'smart' | 'free'>('smart');

  const [selectedVerb, setSelectedVerb] = useState<LabVerbItem>(LAB_ENHANCED_DATA.verbs[0]);
  const [selectedSubject, setSelectedSubject] = useState<LabSubjectItem>(LAB_ENHANCED_DATA.subjects[0]);
  const [selectedObject, setSelectedObject] = useState<LabObjectItem>(LAB_ENHANCED_DATA.objects[0]);

  // Compute properly conjugated verb based on tense + subject gender + definite article
  const getConjugatedVerb = (): string => {
    if (tense === 'present') {
      return selectedSubject.gender === 'fem' ? selectedVerb.presentFem : selectedVerb.presentMasc;
    }
    if (selectedSubject.gender === 'fem') {
      return selectedSubject.startsWithAl ? selectedVerb.pastFemBeforeAl : selectedVerb.pastFem;
    }
    return selectedVerb.pastMasc;
  };

  const conjugatedVerb = getConjugatedVerb();
  const hasObject = selectedVerb.isTransitive || semanticMode === 'free';
  const fullSentence = hasObject
    ? `${conjugatedVerb} ${selectedSubject.vocalized} ${selectedObject.vocalized}.`
    : `${conjugatedVerb} ${selectedSubject.vocalized}.`;

  // In smart mode, ensure selected object matches the verb's allowed objects
  const handleSelectVerb = (v: LabVerbItem) => {
    sounds.playClick();
    setSelectedVerb(v);
    if (semanticMode === 'smart' && v.isTransitive && !v.allowedObjectIds.includes(selectedObject.id)) {
      const validObj = LAB_ENHANCED_DATA.objects.find((o) => v.allowedObjectIds.includes(o.id));
      if (validObj) setSelectedObject(validObj);
    }
  };

  const handleToggleSemanticMode = (mode: 'smart' | 'free') => {
    sounds.playClick();
    setSemanticMode(mode);
    if (mode === 'smart' && selectedVerb.isTransitive && !selectedVerb.allowedObjectIds.includes(selectedObject.id)) {
      const validObj = LAB_ENHANCED_DATA.objects.find((o) => selectedVerb.allowedObjectIds.includes(o.id));
      if (validObj) setSelectedObject(validObj);
    }
  };

  const handleSpeakSentence = () => {
    sounds.playClick();
    speakArabic(fullSentence);
  };

  const handleRandomize = () => {
    sounds.playClick();
    const verbsPool = LAB_ENHANCED_DATA.verbs;
    const v = verbsPool[Math.floor(Math.random() * verbsPool.length)];
    const s = LAB_ENHANCED_DATA.subjects[Math.floor(Math.random() * LAB_ENHANCED_DATA.subjects.length)];

    let o = LAB_ENHANCED_DATA.objects[Math.floor(Math.random() * LAB_ENHANCED_DATA.objects.length)];
    if (semanticMode === 'smart' && v.isTransitive && v.allowedObjectIds.length > 0) {
      const validIds = v.allowedObjectIds;
      const validObjects = LAB_ENHANCED_DATA.objects.filter((item) => validIds.includes(item.id));
      if (validObjects.length > 0) {
        o = validObjects[Math.floor(Math.random() * validObjects.length)];
      }
    }

    setSelectedVerb(v);
    setSelectedSubject(s);
    setSelectedObject(o);
    onEarnStar('lab-random-discover');
  };

  const getVerbParsingExplanation = () => {
    if (tense === 'present') {
      return 'فِعْلٌ مُضَارِعٌ مَرْفُوعٌ وَعَلَامَةُ رَفْعِهِ الضَّمَّةُ الظَّاهِرَةُ عَلَى آخِرِهِ.';
    }
    if (selectedSubject.gender === 'fem') {
      return 'فِعْلٌ مَاضٍ مَبْنِيٌّ عَلَى الفَتْحِ، وَالتَّاءُ تَاءُ التَّأْنِيثِ السَّاكِنَةُ لِأَنَّ الفَاعِلَ مُؤَنَّثٌ.';
    }
    return 'فِعْلٌ مَاضٍ مَبْنِيٌّ عَلَى الفَتْحِ الظَّاهِرِ عَلَى آخِرِهِ.';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Mascot cheer */}
      <MascotMessage
        message="أَهْلاً بِكُمْ فِي المَصْنَعِ النَّحْوِيِّ الذَّكِيِّ! هُنَا تَتَدَرَّبُ عَلَى الفِعْلِ المَاضِي وَالمُضَارِعِ، وَالفَاعِلِ المُذَكَّرِ وَالمُؤَنَّثِ، مَعَ «قَامُوسِ القَوَاعِدِ الصَّغِيرِ»!"
        subtext="جرِّبِ التَّرْكِيبَ المَنْطِقِيَّ لِتَصْنَعَ جُمَلاً سَلِيمَةَ المَعْنَى، وَلَاحِظْ كَيْفَ يَكْتَفِي الفِعْلُ اللَّازِمُ (مِثْلُ: جَلَسَ، نَامَ، طَارَ) بِالفَاعِلِ فَقَطْ!"
        variant="purple"
        emotion="teaching"
      />

      {/* Lab Sub-navigation */}
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap justify-center gap-1 p-1.5 rounded-2xl bg-white border-2 border-stone-200 shadow-xs">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveLabTab('both');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer ${
              activeLabTab === 'both'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Sparkles size={16} />
            <span>عَرْضُ الكُلِّ (المُخْتَبَرُ + القَامُوسُ)</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveLabTab('builder');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer ${
              activeLabTab === 'builder'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <FlaskConical size={16} />
            <span>1. تَرْكِيبُ الجُمَلِ الفِعْلِيَّةِ</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveLabTab('dictionary');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer ${
              activeLabTab === 'dictionary'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <BookOpen size={16} />
            <span>2. قَامُوسُ القَوَاعِدِ الصَّغِيرُ 📚</span>
          </button>
        </div>
      </div>

      {/* Main Builder Board */}
      {(activeLabTab === 'both' || activeLabTab === 'builder') && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
            <div>
              <span className="text-xs font-bold text-purple-800">
                مُخْتَبَرُ التَّرْكِيبِ التَّفَاعُلِيِّ الذَّكِيِّ
              </span>
              <h2 className="text-xl md:text-2xl font-black text-stone-900 mt-1">
                اصْنَعْ جُمْلَتَكَ الفِعْلِيَّةَ وَشَاهِدْ إِعْرَابَهَا لَحْظِيّاً!
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
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

          {/* Tense + Semantic Pairing Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
            {/* Tense Toggle */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-stone-700 flex items-center gap-1">
                <Clock size={14} className="text-emerald-700" />
                <span>زَمَنُ الفِعْلِ:</span>
              </span>
              <div className="inline-flex p-1 rounded-xl bg-white border border-stone-200 gap-1">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setTense('past');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    tense === 'past' ? 'bg-emerald-600 text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  فِعْلٌ مَاضٍ (كَتَبَ)
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setTense('present');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    tense === 'present' ? 'bg-emerald-600 text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  فِعْلٌ مُضَارِعٌ (يَكْتُبُ)
                </button>
              </div>
            </div>

            {/* Semantic Mode Toggle */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-stone-700 flex items-center gap-1">
                <ShieldCheck size={14} className="text-purple-700" />
                <span>نَمَطُ التَّرْكِيبِ:</span>
              </span>
              <div className="inline-flex p-1 rounded-xl bg-white border border-stone-200 gap-1">
                <button
                  onClick={() => handleToggleSemanticMode('smart')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    semanticMode === 'smart'
                      ? 'bg-purple-600 text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  ✅ تَرْكِيبٌ مَنْطِقِيٌّ سَلِيمٌ
                </button>
                <button
                  onClick={() => handleToggleSemanticMode('free')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    semanticMode === 'free'
                      ? 'bg-amber-500 text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  🎭 تَرْكِيبٌ حُرٌّ مَرِحٌ
                </button>
              </div>
            </div>
          </div>

          {/* Live Sentence Display */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg text-center space-y-4">
            <span className="text-xs font-bold text-amber-100">
              الجُمْلَةُ الفِعْلِيَّةُ المُتَكَامِلَةُ (الحَرْفُ الأَخِيرُ مُمَيَّزٌ بِاللَّوْنِ):
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3 text-3xl md:text-5xl font-black">
              <span className="bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-xs border border-white/30">
                <VocalizedWord word={conjugatedVerb} highlightClassName="text-emerald-100" />
              </span>
              <span className="bg-amber-300 text-amber-950 px-4 py-2 rounded-2xl shadow-sm border-2 border-white/60">
                <VocalizedWord word={selectedSubject.vocalized} highlightClassName="text-rose-700" />
              </span>
              {hasObject ? (
                <span className="bg-sky-300 text-sky-950 px-4 py-2 rounded-2xl shadow-sm border-2 border-white/60">
                  <VocalizedWord word={selectedObject.vocalized} highlightClassName="text-rose-700" />
                </span>
              ) : (
                <span className="text-sm md:text-base font-black bg-white/20 px-3.5 py-2 rounded-2xl border border-white/30">
                  ✓ جُمْلَةٌ تَامَّةٌ بِفِعْلٍ لَازِمٍ (لَا تَحْتَاجُ مَفْعُولاً بِهِ)
                </span>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-3 text-xs md:text-sm font-bold text-amber-100 pt-2">
              <span className="flex items-center gap-1">
                <span>{selectedVerb.icon}</span>{' '}
                {tense === 'past' ? 'فِعْلٌ مَاضٍ' : 'فِعْلٌ مُضَارِعٌ'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-yellow-100">
                <Crown size={15} /> فَاعِلٌ{' '}
                {selectedSubject.gender === 'fem' ? '(مُؤَنَّثٌ - الضَّمَّةُ ُ)' : '(مُذَكَّرٌ - الضَّمَّةُ ُ)'}
              </span>
              {hasObject && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-sky-100">
                    <Target size={15} /> مَفْعُولٌ بِهِ (مَنْصُوبٌ بِالفَتْحَةِ َ)
                  </span>
                </>
              )}
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
                <span className="text-xs text-stone-500">مُتَعَدٍّ أَوْ لَازِمٌ</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {LAB_ENHANCED_DATA.verbs.map((v) => {
                  const isSelected = selectedVerb.id === v.id;
                  const labelVerb =
                    tense === 'present'
                      ? selectedSubject.gender === 'fem'
                        ? v.presentFem
                        : v.presentMasc
                      : selectedSubject.gender === 'fem'
                      ? v.pastFem
                      : v.pastMasc;
                  return (
                    <button
                      key={v.id}
                      onClick={() => handleSelectVerb(v)}
                      className={`p-2.5 rounded-xl text-center font-black transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs scale-[1.02] ring-2 ring-emerald-300'
                          : 'bg-white hover:bg-emerald-100/60 text-stone-800 border border-emerald-200'
                      }`}
                    >
                      <span className="text-lg block mb-0.5">{v.icon}</span>
                      <span className="text-base block">{labelVerb}</span>
                      <span
                        className={`text-[10px] font-bold block mt-0.5 ${
                          isSelected ? 'text-emerald-100' : 'text-stone-500'
                        }`}
                      >
                        {v.isTransitive ? 'يَحْتَاجُ مَفْعُولاً' : 'لَازِمٌ (يكتفي بالفاعل)'}
                      </span>
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
                <span className="text-xs text-stone-500">مُذَكَّرٌ وَمُؤَنَّثٌ</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {LAB_ENHANCED_DATA.subjects.map((s) => {
                  const isSelected = selectedSubject.id === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedSubject(s);
                      }}
                      className={`p-2.5 rounded-xl text-center font-black transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-white shadow-xs scale-[1.02] ring-2 ring-amber-300'
                          : 'bg-white hover:bg-amber-100/60 text-stone-800 border border-amber-200'
                      }`}
                    >
                      <span className="text-lg block mb-0.5">{s.icon}</span>
                      <span className="text-base block">{s.vocalized}</span>
                      <span
                        className={`text-[10px] font-bold block mt-0.5 ${
                          isSelected ? 'text-amber-100' : 'text-stone-500'
                        }`}
                      >
                        {s.gender === 'fem' ? 'مُؤَنَّثٌ' : 'مُذَكَّرٌ'}
                      </span>
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
                <span className="text-xs text-stone-500">
                  {!hasObject ? 'مُعَطَّلٌ لِلْفِعْلِ اللَّازِمِ' : 'مَا وَقَعَ عَلَيْهِ'}
                </span>
              </div>

              {!hasObject ? (
                <div className="p-5 rounded-2xl bg-white border-2 border-dashed border-sky-300 text-center space-y-2">
                  <span className="text-3xl block">🐦</span>
                  <p className="text-sm font-black text-sky-950">
                    الفِعْلُ «{conjugatedVerb}» فِعْلٌ لَازِمٌ!
                  </p>
                  <p className="text-xs font-medium text-stone-600 leading-relaxed">
                    مَعْنَاهُ يَكْتَمِلُ بِالفَاعِلِ فَقَطْ (مِثْلُ: {conjugatedVerb} {selectedSubject.vocalized})، وَلَا يَحْتَاجُ إِلَى مَفْعُولٍ بِهِ.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {LAB_ENHANCED_DATA.objects.map((o) => {
                    const isSelected = selectedObject.id === o.id;
                    const isAllowedInSmart =
                      semanticMode === 'free' ||
                      !selectedVerb.isTransitive ||
                      selectedVerb.allowedObjectIds.includes(o.id);

                    return (
                      <button
                        key={o.id}
                        disabled={!isAllowedInSmart}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedObject(o);
                        }}
                        className={`p-2.5 rounded-xl text-center font-black transition-all ${
                          !isAllowedInSmart
                            ? 'bg-stone-100 text-stone-400 border border-stone-200 opacity-50 cursor-not-allowed'
                            : isSelected
                            ? 'bg-sky-600 text-white shadow-xs scale-[1.02] ring-2 ring-sky-300 cursor-pointer'
                            : 'bg-white hover:bg-sky-100/60 text-stone-800 border border-sky-200 cursor-pointer'
                        }`}
                      >
                        <span className="text-lg block mb-0.5">{o.icon}</span>
                        <span className="text-base">{o.vocalized}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Live Parsing Breakdown */}
          <div className="p-5 rounded-2xl bg-stone-50 border-2 border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-stone-700">
                الإِعْرَابُ التَّلْقَائِيُّ لِلْجُمْلَةِ الَّتِي رَكَّبْتَهَا:
              </span>
              <span className="text-xs text-emerald-700 font-bold">
                نَحْوٌ فَوْرِيٌّ {semanticMode === 'free' ? '· وَضْعٌ حُرٌّ مَرِحٌ 🎭' : '· مَعْنًى سَلِيمٌ ✅'}
              </span>
            </div>

            <div className={`grid grid-cols-1 ${hasObject ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-3`}>
              <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1">
                <span className="text-xs text-emerald-700 font-bold">1. الفِعْلُ:</span>
                <div className="text-lg font-black text-emerald-950">
                  <VocalizedWord word={conjugatedVerb} highlightClassName="text-emerald-600" />
                </div>
                <p className="text-xs text-stone-600 font-medium">{getVerbParsingExplanation()}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-amber-300 space-y-1">
                <span className="text-xs text-amber-700 font-bold">2. الفَاعِلُ (مَنْ؟):</span>
                <div className="text-lg font-black text-amber-950">
                  <VocalizedWord word={selectedSubject.vocalized} highlightClassName="text-rose-600" />
                </div>
                <p className="text-xs text-stone-600 font-medium">
                  فَاعِلٌ مَرْفُوعٌ وَعَلَامَةُ رَفْعِهِ الضَّمَّةُ الظَّاهِرَةُ عَلَى آخِرِهِ.
                </p>
              </div>

              {hasObject && (
                <div className="p-3.5 rounded-xl bg-white border border-sky-300 space-y-1">
                  <span className="text-xs text-sky-700 font-bold">3. المَفْعُولُ بِهِ (مَاذَا؟):</span>
                  <div className="text-lg font-black text-sky-950">
                    <VocalizedWord word={selectedObject.vocalized} highlightClassName="text-rose-600" />
                  </div>
                  <p className="text-xs text-stone-600 font-medium">
                    مَفْعُولٌ بِهِ مَنْصُوبٌ وَعَلَامَةُ نَصْبِهِ الفَتْحَةُ الظَّاهِرَةُ عَلَى آخِرِهِ.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Little Grammar Dictionary Section */}
      {(activeLabTab === 'both' || activeLabTab === 'dictionary') && (
        <div id="grammar-dictionary-section" className="pt-2">
          <LittleGrammarDictionary
            onDictionaryLookup={onDictionaryLookup}
            lookedUpDictionaryIds={lookedUpDictionaryIds}
          />
        </div>
      )}
    </div>
  );
};
