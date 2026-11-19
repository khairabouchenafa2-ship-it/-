import React, { useState } from 'react';
import {
  Search,
  Volume2,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Bookmark,
  Crown,
} from 'lucide-react';
import { GRAMMAR_DICTIONARY_TERMS } from '../data/curriculumData';
import { DictionaryTerm } from '../types';
import { sounds, speakArabic } from '../utils/audio';

interface LittleGrammarDictionaryProps {
  onDictionaryLookup?: (termId: string) => void;
  lookedUpDictionaryIds?: string[];
}

export const LittleGrammarDictionary: React.FC<LittleGrammarDictionaryProps> = ({
  onDictionaryLookup,
  lookedUpDictionaryIds = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'parts' | 'cases'>(
    'all'
  );
  const [activeTermId, setActiveTermId] = useState<string>('subject');

  const filteredTerms = GRAMMAR_DICTIONARY_TERMS.filter((term) => {
    const matchesSearch =
      term.term.includes(searchQuery) ||
      term.shortDefinition.includes(searchQuery) ||
      term.lexicalCategory.includes(searchQuery);

    if (!matchesSearch) return false;

    if (selectedCategory === 'core') {
      return term.id === 'subject' || term.id === 'object';
    }
    if (selectedCategory === 'parts') {
      return term.id === 'noun' || term.id === 'verb' || term.id === 'particle';
    }
    if (selectedCategory === 'cases') {
      return (
        term.id === 'damma' ||
        term.id === 'fatha' ||
        term.id === 'ierab' ||
        term.id === 'sentence_verbal' ||
        term.id === 'sentence_nominal'
      );
    }
    return true;
  });

  const activeTerm =
    GRAMMAR_DICTIONARY_TERMS.find((t) => t.id === activeTermId) ||
    filteredTerms[0] ||
    GRAMMAR_DICTIONARY_TERMS[0];

  const handleSelectTerm = (termId: string) => {
    sounds.playClick();
    setActiveTermId(termId);
    onDictionaryLookup?.(termId);
  };

  const handleSpeakTerm = (term: DictionaryTerm) => {
    sounds.playClick();
    speakArabic(`${term.term}. ${term.shortDefinition}. ${term.childTip}`);
    onDictionaryLookup?.(term.id);
  };

  const getCardBorder = (color: string) => {
    switch (color) {
      case 'amber':
        return 'border-amber-300 bg-amber-50/50 hover:border-amber-400';
      case 'sky':
        return 'border-sky-300 bg-sky-50/50 hover:border-sky-400';
      case 'emerald':
        return 'border-emerald-300 bg-emerald-50/50 hover:border-emerald-400';
      case 'blue':
        return 'border-blue-300 bg-blue-50/50 hover:border-blue-400';
      case 'purple':
        return 'border-purple-300 bg-purple-50/50 hover:border-purple-400';
      default:
        return 'border-stone-200 bg-stone-50 hover:border-amber-300';
    }
  };

  return (
    <section className="bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 rounded-3xl p-6 md:p-8 border-2 border-amber-300 shadow-md space-y-6">
      {/* Dictionary Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-amber-200/80">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-400 text-amber-950 flex items-center justify-center text-3xl shadow-sm border-2 border-amber-300">
            📖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                مُعْجَمُ النَّحْوِ لِلأَطْفَالِ
              </span>
              <span className="text-xs text-stone-500 font-bold hidden sm:inline">
                مَفَاهِيمُ مُعْجَمِيَّةٌ مُبَسَّطَةٌ
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-amber-950 mt-1">
              قَامُوسُ القَوَاعِدِ الصَّغِيرُ 📚
            </h2>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابْحَثْ عَنْ مُصْطَلَحٍ (الفَاعِل، الاسْم...)"
            className="w-full pr-10 pl-4 py-2.5 rounded-2xl border-2 border-amber-200 bg-white font-bold text-xs md:text-sm text-stone-900 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200 shadow-2xs"
          />
          <Search
            size={18}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-600"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            sounds.playClick();
            setSelectedCategory('all');
          }}
          className={`px-3.5 py-1.5 rounded-xl font-black text-xs md:text-sm transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
          }`}
        >
          كُلُّ المُصْطَلَحَاتِ ({GRAMMAR_DICTIONARY_TERMS.length})
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setSelectedCategory('core');
          }}
          className={`px-3.5 py-1.5 rounded-xl font-black text-xs md:text-sm transition-all cursor-pointer flex items-center gap-1 ${
            selectedCategory === 'core'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
          }`}
        >
          <Crown size={14} />
          <span>الفَاعِلُ وَالمَفْعُولُ بِهِ</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setSelectedCategory('parts');
          }}
          className={`px-3.5 py-1.5 rounded-xl font-black text-xs md:text-sm transition-all cursor-pointer ${
            selectedCategory === 'parts'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
          }`}
        >
          أَقْسَامُ الكَلَامِ (الاسْمُ، الفِعْلُ، الحَرْفُ)
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setSelectedCategory('cases');
          }}
          className={`px-3.5 py-1.5 rounded-xl font-black text-xs md:text-sm transition-all cursor-pointer ${
            selectedCategory === 'cases'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
          }`}
        >
          الحَرَكَاتُ وَالإِعْرَابُ
        </button>
      </div>

      {/* Main Dictionary Explorer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (List of Terms Pills) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
          {filteredTerms.map((t) => {
            const isSelected = activeTerm.id === t.id;
            const isExplored = lookedUpDictionaryIds.includes(t.id);
            return (
              <div
                key={t.id}
                onClick={() => handleSelectTerm(t.id)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-100/70 shadow-sm scale-[1.01] ring-2 ring-amber-300'
                    : getCardBorder(t.color)
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center border border-stone-100">
                    {t.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-base text-stone-900 leading-tight">
                        {t.term}
                      </h3>
                      {isExplored && <CheckCircle2 size={14} className="text-emerald-600" />}
                    </div>
                    <span className="text-[11px] font-bold text-stone-500 block">
                      {t.badge}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeakTerm(t);
                    }}
                    className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-stone-700 text-xs border border-stone-200"
                    title="استمع للنطق والتعريف"
                  >
                    <Volume2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredTerms.length === 0 && (
            <div className="p-8 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
              لَا تُوجَدُ مُصْطَلَحَاتٌ تُطَابِقُ بَحْثَكَ!
            </div>
          )}
        </div>

        {/* Right Column (Detailed Lexical Article Card) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-stone-200 shadow-sm space-y-5 sticky top-24">
            {/* Term Title & Pronunciation Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <span className="text-4xl w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-2xs">
                  {activeTerm.icon}
                </span>
                <div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                    {activeTerm.lexicalCategory}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-stone-900 mt-1">
                    {activeTerm.vocalized}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => handleSpeakTerm(activeTerm)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Volume2 size={16} />
                <span>قِرَاءَةُ التَّعْرِيفِ 🔊</span>
              </button>
            </div>

            {/* Quick Definition Box */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
              <span className="text-xs font-black text-amber-900 flex items-center gap-1">
                <Bookmark size={13} />
                تَعْرِيفُ المُعْجَمِ المُبَسَّطُ:
              </span>
              <p className="text-base md:text-lg font-black text-stone-900 leading-relaxed">
                {activeTerm.shortDefinition}
              </p>
            </div>

            {/* Lexical Narrative for Children */}
            <div className="space-y-1.5 text-sm text-stone-700 leading-relaxed font-medium">
              <span className="text-xs font-black text-stone-500 block">
                الشَّرْحُ البَسِيطُ لِلصِّغَارِ:
              </span>
              <p className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-stone-800">
                {activeTerm.lexicalEntry}
              </p>
            </div>

            {/* Magic Clues & Signs */}
            <div className="space-y-2">
              <span className="text-xs font-black text-emerald-800 flex items-center gap-1">
                <Sparkles size={14} className="text-emerald-600" />
                عَلَامَاتُهُ السِّحْرِيَّةُ (كَيْفَ أَعْرِفُهُ؟):
              </span>
              <div className="space-y-1.5">
                {activeTerm.secretSigns.map((sign, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs md:text-sm text-stone-800 font-bold bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200"
                  >
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{sign}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Magic Question Trigger */}
            {activeTerm.magicQuestion && (
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between text-xs md:text-sm font-bold text-purple-950">
                <div className="flex items-center gap-1.5">
                  <HelpCircle size={16} className="text-purple-600" />
                  <span>السُّؤَالُ السِّحْرِيُّ لِكَشْفِهِ:</span>
                </div>
                <span className="font-black text-purple-900 bg-white px-2.5 py-1 rounded-lg border border-purple-300">
                  {activeTerm.magicQuestion}
                </span>
              </div>
            )}

            {/* Vocalized Examples */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-stone-600 block">
                أَمْثِلَةٌ مُشَكَّلَةٌ مِنَ القَامُوسِ:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeTerm.vocalizedExamples.map((ex, i) => (
                  <span
                    key={i}
                    onClick={() => {
                      sounds.playClick();
                      speakArabic(ex);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 font-black text-xs md:text-sm text-stone-900 border border-stone-300 cursor-pointer hover:bg-amber-100 hover:border-amber-300 transition-colors"
                    title="انقر للاستماع للنطق"
                  >
                    {ex} 🔊
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Parsing Rule if available */}
            {activeTerm.ierabRule && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white space-y-1">
                <span className="text-[11px] font-bold text-amber-100 block">
                  قَاعِدَةُ الإِعْرَابِ النَّمُوذَجِيَّةِ:
                </span>
                <p className="text-sm md:text-base font-black">
                  «{activeTerm.ierabRule}»
                </p>
              </div>
            )}

            {/* Golden Mascot Tip */}
            <div className="p-3 rounded-xl bg-yellow-100/70 border border-yellow-300 flex items-center gap-2 text-xs font-bold text-yellow-950">
              <Lightbulb size={18} className="text-amber-600 flex-shrink-0" />
              <span>
                <span className="font-black">نَصِيحَةُ المُعَلِّمِ:</span> {activeTerm.childTip}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
