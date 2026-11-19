import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { sounds } from '../utils/audio';

interface PWAInstallButtonProps {
  showFallbackInfo?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  showFallbackInfo = false,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Suppress button if already running as an installed standalone app
  if (isInstalled) {
    return showFallbackInfo ? (
      <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
        ✅ التَّطْبِيقُ مُثَبَّتٌ بِالفِعْلِ وَيَعْمَلُ كَبَرْنَامَجٍ مُسْتَقِلٍّ
      </span>
    ) : null;
  }

  // Chromium / Android / Desktop install flow
  if (isInstallable) {
    return (
      <button
        onClick={async () => {
          sounds.playClick();
          const accepted = await install();
          if (accepted) {
            sounds.playFanfare();
          }
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs md:text-sm shadow-sm transition-all cursor-pointer"
        title="تَثْبِيتُ التَّطْبِيقِ عَلَى الهَاتِفِ"
      >
        <Download size={16} />
        <span>تَثْبِيتُ التَّطْبِيقِ</span>
      </button>
    );
  }

  // iOS Safari guided install flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => {
            sounds.playClick();
            setShowIOSGuide(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-xs shadow-xs transition-all cursor-pointer"
          title="تَثْبِيتُ التَّطْبِيقِ عَلَى الآيْفُون أَوِ الآيْبَاد"
        >
          <Smartphone size={16} />
          <span className="hidden sm:inline">تَثْبِيتٌ عَلَى الهَاتِفِ</span>
          <span className="sm:hidden">تَثْبِيتٌ</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border-2 border-amber-300 space-y-4 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 left-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer"
                aria-label="إغلاق"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl">
                  📱
                </div>
                <div>
                  <h3 className="text-lg font-black text-amber-950">
                    تَثْبِيتُ «بَطَلُ الإِعْرَابِ»
                  </h3>
                  <p className="text-xs font-bold text-stone-500">
                    عَلَى هَاتِفِ الآيْفُون أَوِ الآيْبَاد (Safari)
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm font-bold text-stone-800 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <p className="leading-relaxed">
                    اضْغَطْ عَلَى زِرِّ{' '}
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-stone-300 text-blue-700">
                      <Share size={13} /> المُشَارَكَةِ
                    </span>{' '}
                    فِي شَرِيطِ مُتَصَفِّحِ سَفَارِي.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <p className="leading-relaxed">
                    مَرِّرْ لِلْأَسْفَلِ وَاخْتَرْ{' '}
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-stone-300 text-stone-900">
                      <PlusSquare size={13} /> إِضَافَةٌ إِلَى الشَّاشَةِ الرَّئِيسِيَّةِ
                    </span>
                    .
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <p className="leading-relaxed">
                    اضْغَطْ عَلَى <span className="text-emerald-700 font-black">«إِضَافَةٌ»</span>{' '}
                    لِيَعْمَلَ التَّطْبِيقُ كَبَرْنَامَجٍ مُسْتَقِلٍّ وَدُونَ إِنْتَرْنِت!
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  setShowIOSGuide(false);
                }}
                className="w-full rounded-2xl bg-amber-600 hover:bg-amber-700 py-2.5 text-sm font-black text-white shadow-sm transition-all cursor-pointer"
              >
                فَهِمْتُ، شُكْراً! 👍
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  if (showFallbackInfo) {
    return (
      <div className="text-xs font-bold text-emerald-900 bg-white px-3.5 py-2 rounded-xl border border-emerald-200 leading-relaxed">
        📲 لِلتَّثْبِيتِ: افْتَحِ التَّطْبِيقَ فِي مُتَصَفِّحِ الهَاتِفِ (Chrome لِلْأَنْدْرُوِيد أَوْ Safari لِلْآيْفُون) وَاخْتَرْ «إِضَافَةٌ إِلَى الشَّاشَةِ الرَّئِيسِيَّةِ».
      </div>
    );
  }

  return null;
};
