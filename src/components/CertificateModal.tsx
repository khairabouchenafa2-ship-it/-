import React, { useState, useEffect } from 'react';
import { X, Printer, Sparkles, CheckCircle2 } from 'lucide-react';
import { MASCOT } from '../data/curriculumData';
import { sounds } from '../utils/audio';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  starsCount: number;
  studentName?: string;
  studentAvatar?: string;
  totalCompletedExercises?: number;
}

const formatStarsLabel = (count: number) => {
  if (count === 1) return 'نَجْمَةٌ وَاحِدَةٌ تَقْدِيرِيَّةٌ';
  if (count === 2) return 'نَجْمَتَانِ تَقْدِيرِيَّتَانِ';
  if (count >= 3 && count <= 10) return `${count} نَجَمَاتٍ تَقْدِيرِيَّةٍ`;
  return `${count} نَجْمَةً تَقْدِيرِيَّةً`;
};

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  starsCount,
  studentName: propStudentName,
  studentAvatar = '👦',
  totalCompletedExercises = 0,
}) => {
  const [studentName, setStudentName] = useState<string>(
    propStudentName || 'بَطَلُ اللُّغَةِ العَرَبِيَّةِ'
  );

  useEffect(() => {
    if (propStudentName) {
      setStudentName(propStudentName);
    }
  }, [propStudentName]);

  if (!isOpen) return null;

  const isFeminine = studentAvatar === '👧';
  const hasCompletedAll = totalCompletedExercises >= 13;

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn print:static print:bg-white print:p-0 print:block">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 border-4 border-amber-300 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible print:shadow-none print:border-none print:p-2">
        {/* Close button (hidden on print) */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors print:hidden cursor-pointer"
          aria-label="إغلاق"
        >
          <X size={20} />
        </button>

        {/* Name Customizer (hidden on print) */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 print:hidden flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-600" />
            <span className="text-xs font-black text-amber-950">
              اكْتُبِ اسْمَ التِّلْمِيذِ / التِّلْمِيذَةِ لِلطِّبَاعَةِ:
            </span>
          </div>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-amber-300 bg-white font-black text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400 w-full sm:w-60 text-center"
            placeholder="اسْمُ التِّلْمِيذِ..."
          />
        </div>

        {/* Certificate Canvas */}
        <div className="p-6 md:p-8 rounded-2xl border-8 border-double border-amber-500 bg-gradient-to-b from-amber-50/70 via-white to-amber-50/40 text-center space-y-5 relative overflow-hidden">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-9xl">
            👑
          </div>

          <div className="space-y-1">
            <span className="inline-block text-xs font-black px-3 py-1 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
              شَهَادَةُ تَمَيُّزٍ وَتَفَوُّقٍ نَحْوِيٍّ
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-amber-950 pt-2">
              {isFeminine
                ? 'شَهَادَةُ «بَطَلَةِ الإِعْرَابِ الصَّغِيرَةِ»'
                : 'شَهَادَةُ «بَطَلِ الإِعْرَابِ الصَّغِيرِ»'}
            </h2>
            <p className="text-xs text-stone-500 font-bold">
              السَّنَة الثَّالِثَة الِابْتِدَائِيَّة • وَحْدَةُ الفَاعِلِ وَالمَفْعُولِ بِهِ
            </p>
          </div>

          <p className="text-sm text-stone-700 font-medium">
            {isFeminine
              ? 'تَشْهَدُ إِدَارَةُ مَمْلَكَةِ اللُّغَةِ العَرَبِيَّةِ أَنَّ البَطَلَةَ النَّجِيبَةَ:'
              : 'تَشْهَدُ إِدَارَةُ مَمْلَكَةِ اللُّغَةِ العَرَبِيَّةِ أَنَّ البَطَلَ النَّجِيبَ:'}
          </p>

          <div className="py-2 px-6 border-b-2 border-dashed border-amber-400 inline-block">
            <span className="text-2xl md:text-3xl font-black text-amber-900">
              {studentName || (isFeminine ? 'بَطَلَةُ الإِعْرَابِ' : 'بَطَلُ الإِعْرَابِ')}
            </span>
          </div>

          <p className="text-sm md:text-base text-stone-800 leading-relaxed font-bold max-w-lg mx-auto">
            {hasCompletedAll
              ? isFeminine
                ? 'قَدْ أَتَمَّتْ بِنَجَاحٍ وَتَفَوُّقٍ بَاهِرٍ دِرَاسَةَ وَحْدَةِ الإِعْرَابِ، وَأَتْقَنَتِ التَّمْيِيزَ بَيْنَ الفَاعِلِ المَرْفُوعِ بِالضَّمَّةِ ُ وَالمَفْعُولِ بِهِ المَنْصُوبِ بِالفَتْحَةِ َ ، وَحَلَّتْ كَافَّةَ التَّمَارِينِ بِذَكَاءٍ وَاقْتِدَارٍ!'
                : 'قَدْ أَتَمَّ بِنَجَاحٍ وَتَفَوُّقٍ بَاهِرٍ دِرَاسَةَ وَحْدَةِ الإِعْرَابِ، وَأَتْقَنَ التَّمْيِيزَ بَيْنَ الفَاعِلِ المَرْفُوعِ بِالضَّمَّةِ ُ وَالمَفْعُولِ بِهِ المَنْصُوبِ بِالفَتْحَةِ َ ، وَحَلَّ كَافَّةَ التَّمَارِينِ بِذَكَاءٍ وَاقْتِدَارٍ!'
              : isFeminine
              ? `قَدْ شَارَكَتْ بِجِدٍّ وَاجْتِهَادٍ فِي دِرَاسَةِ وَحْدَةِ الإِعْرَابِ (الفَاعِلِ المَرْفُوعِ بِالضَّمَّةِ ُ وَالمَفْعُولِ بِهِ المَنْصُوبِ بِالفَتْحَةِ َ ) وَأَنْجَزَتْ ${totalCompletedExercises} مِنْ أَصْلِ 13 تَمْرِيناً بِمَهَارَةٍ!`
              : `قَدْ شَارَكَ بِجِدٍّ وَاجْتِهَادٍ فِي دِرَاسَةِ وَحْدَةِ الإِعْرَابِ (الفَاعِلِ المَرْفُوعِ بِالضَّمَّةِ ُ وَالمَفْعُولِ بِهِ المَنْصُوبِ بِالفَتْحَةِ َ ) وَأَنْجَزَ ${totalCompletedExercises} مِنْ أَصْلِ 13 تَمْرِيناً بِمَهَارَةٍ!`}
          </p>

          {/* Stars & Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-2xl border border-amber-300 font-black text-sm">
              <span>⭐</span>
              <span>{formatStarsLabel(starsCount)}</span>
            </div>
            <div className="bg-emerald-100 text-emerald-900 px-3.5 py-1.5 rounded-2xl border border-emerald-300 font-black text-xs flex items-center gap-1">
              <CheckCircle2 size={14} />
              <span>
                {hasCompletedAll
                  ? isFeminine
                    ? 'مُتَفَوِّقَةٌ جِدّاً'
                    : 'مُتَفَوِّقٌ جِدّاً'
                  : isFeminine
                  ? 'مُجْتَهِدَةٌ وَمُتَمَيِّزَةٌ'
                  : 'مُجْتَهِدٌ وَمُتَمَيِّزٌ'}
              </span>
            </div>
          </div>

          {/* Footer of certificate */}
          <div className="flex items-end justify-between pt-6 border-t border-amber-200 text-xs">
            <div className="text-right space-y-1">
              <span className="text-stone-400 block font-medium">خَاتَمُ المَمْلَكَةِ:</span>
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-amber-500 bg-amber-100 flex items-center justify-center text-xs font-black text-amber-900 rotate-[-12deg] shadow-xs">
                مُعْتَمَدٌ 🌟
              </div>
            </div>

            <div className="text-left space-y-1">
              <span className="text-stone-400 block font-medium">تَوْقِيعُ المُعَلِّمِ:</span>
              <div className="font-black text-stone-800 text-sm flex items-center gap-1">
                <span>{MASCOT.name}</span>
                <span>🦉</span>
              </div>
            </div>
          </div>
        </div>

        {/* Print / Action Buttons */}
        <div className="flex justify-center gap-3 pt-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
          >
            <Printer size={18} />
            <span>طِبَاعَةُ الشَّهَادَةِ فَوْراً</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-black text-sm transition-all cursor-pointer"
          >
            إِغْلَاقٌ
          </button>
        </div>
      </div>
    </div>
  );
};
