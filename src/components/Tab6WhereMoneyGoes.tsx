import React, { useState } from 'react';

interface Tab6Props {
  onNextTab: () => void;
  onTriggerConfetti: () => void;
}

interface AssetGuideItem {
  id: string;
  name: string;
  emoji: string;
  category: 'kebal' | 'risky';
  returnRange: string;
  riskLevel: string;
  whyText: string;
  example: string;
}

const ASSET_ITEMS: AssetGuideItem[] = [
  {
    id: 'asb',
    name: 'ASB (Amanah Saham Bumiputera)',
    emoji: '🛡️',
    category: 'kebal',
    returnRange: '~5.0% – 5.5% setahun',
    riskLevel: 'Zero Risiko Modal Susut',
    whyText: 'Harga tetap RM1.00 seunit! Takkan jatuh jadi RM0.80 walaupun ekonomi gawat.',
    example: 'Sesuai park duit kecemasan & simpanan wajib.',
  },
  {
    id: 'th',
    name: 'Tabung Haji (TH)',
    emoji: '🕋',
    category: 'kebal',
    returnRange: '~3.1% setahun (Siap Zakat)',
    riskLevel: 'Dijamin Kerajaan',
    whyText: 'Simpanan dijamin kerajaan & 100% patuh Syariah. Duit pokok takkan lebur.',
    example: 'Port paling selamat untuk kumpul modal haji & backup.',
  },
  {
    id: 'fd',
    name: 'Fixed Deposit Islamik / Cash App',
    emoji: '🏦',
    category: 'kebal',
    returnRange: '~3.5% – 4.0% setahun',
    riskLevel: 'Sangat Rendah (Dilindungi PIDM)',
    whyText: 'Kadar keuntungan dah tetap awal-awal. Confirm dapat untung tanpa drama chart merah.',
    example: 'Contoh: Versa Cash-i, KDI Save, FD Bank Islam.',
  },
  {
    id: 'etf',
    name: 'ETF (Exchange-Traded Fund)',
    emoji: '🧺',
    category: 'risky',
    returnRange: '~8% – 11% setahun (Purata)',
    riskLevel: 'Sederhana – Tinggi (Turun Naik)',
    whyText: 'Beli sebakul saham syarikat gergasi. Harga naik turun ikut pasaran saham dunia.',
    example: 'Contoh: Wahed FTSE USA Shariah ETF, MyETF.',
  },
  {
    id: 'saham',
    name: 'Saham Syarikat (Individual Stocks)',
    emoji: '📈',
    category: 'risky',
    returnRange: '-30% hingga +50% setahun',
    riskLevel: 'Tinggi (Bergantung Prestasi Syarikat)',
    whyText: 'Kalau bisnes untung besar saham meroket, kalau syarikat rugi harga saham boleh junam!',
    example: 'Contoh: Saham Tenaga, Maybank, Apple, Nvidia.',
  },
  {
    id: 'crypto',
    name: 'Kripto / Digital Assets',
    emoji: '🎢',
    category: 'risky',
    returnRange: '-70% hingga +100%+',
    riskLevel: 'Ekstrem Tinggi (Rollercoaster Gila!)',
    whyText: 'Tiada jaminan modal. Hari ni boleh naik 30%, esok boleh crash 50% sekelip mata!',
    example: 'Hanya guna duit lebihan yang sanggup lebur (Luno Malaysia).',
  },
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Q1: ASB & Tabung Haji dikira Aset Kebal sebab harga unit tetap & modal tak lebur.',
    answer: 'fact' as const,
    explanation: 'Fact 📠! ASB kekal RM1 seunit — confirm tidur lena!',
  },
  {
    id: 2,
    question: 'Q2: Beli saham & kripto confirm untung tiap bulan tanpa risiko rugi.',
    answer: 'cap' as const,
    explanation: 'Cap 🧢! Itu Aset Rollercoaster — harga boleh naik laju tapi boleh crash juga!',
  },
  {
    id: 3,
    question: 'Q3: Diversify tu maksudnya bancuh Aset Kebal (backup) dengan Aset Berisiko (growth).',
    answer: 'fact' as const,
    explanation: 'Fact 📠! Kombo 80% Kebal + 20% Attack buat duit selamat tapi tetap berkembang!',
  },
];

export const Tab6WhereMoneyGoes: React.FC<Tab6Props> = ({ onNextTab, onTriggerConfetti }) => {
  const [subtab, setSubtab] = useState<'bancuh' | 'quiz'>('bancuh');

  // Interactive Asset Filter & Sorting Game State
  const [selectedAsset, setSelectedAsset] = useState<AssetGuideItem>(ASSET_ITEMS[0]);
  const [sortedMap, setSortedMap] = useState<Record<string, 'kebal' | 'risky'>>({});
  const [sortFeedback, setSortFeedback] = useState<string | null>(null);

  // Portfolio Mixer Slider State (0 = 100% Kebal, 100 = 100% Rollercoaster)
  const [riskyPct, setRiskyPct] = useState<number>(20);

  // Quiz State (With "Let's Start" Intro Screen & Massive Badge Reveal)
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<{ status: 'correct' | 'wrong'; text: string } | null>(null);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [cardShake, setCardShake] = useState<boolean>(false);

  const kebalPct = 100 - riskyPct;
  const isSweetSpot = riskyPct >= 15 && riskyPct <= 25;
  const isFullKebal = riskyPct < 15;

  const handleSliderChange = (val: number) => {
    const prevSweet = riskyPct >= 15 && riskyPct <= 25;
    setRiskyPct(val);
    const nowSweet = val >= 15 && val <= 25;
    if (!prevSweet && nowSweet) {
      onTriggerConfetti();
    }
  };

  const handleSortGuess = (asset: AssetGuideItem, guess: 'kebal' | 'risky') => {
    if (guess === asset.category) {
      const next = { ...sortedMap, [asset.id]: guess };
      setSortedMap(next);
      setSortFeedback(`✅ Ngam! ${asset.name} memang ${guess === 'kebal' ? 'Aset Kebal 🛡️' : 'Aset Rollercoaster 🎢'}!`);
      if (Object.keys(next).length === ASSET_ITEMS.length) {
        onTriggerConfetti();
      }
    } else {
      setSortFeedback(`❌ Oops! Cuba tengok balik ciri-ciri ${asset.name} kat atas bro.`);
    }
  };

  const handleQuizAnswer = (choice: 'cap' | 'fact') => {
    if (quizFeedback) return;
    const currentQ = QUIZ_QUESTIONS[quizIdx];
    const isCorrect = choice === currentQ.answer;

    setCardShake(true);
    setTimeout(() => setCardShake(false), 450);

    setQuizFeedback({
      status: isCorrect ? 'correct' : 'wrong',
      text: isCorrect ? `Mantap! 🔥 ${currentQ.explanation}` : `Koyak! 💀 ${currentQ.explanation}`,
    });

    setTimeout(() => {
      setQuizFeedback(null);
      if (quizIdx < QUIZ_QUESTIONS.length - 1) {
        setQuizIdx((p) => p + 1);
      } else {
        setQuizFinished(true);
        onTriggerConfetti();
      }
    }, 1150);
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Sticky Subtab Navigation (Comic removed as requested) */}
      <div className="sticky top-4 z-30 flex justify-center">
        <div className="neo-card bg-white rounded-full p-1.5 flex items-center gap-2 overflow-x-auto max-w-full">
          {[
            { id: 'bancuh', label: '1️⃣ Bancuh Portfolio 🧪 (Kenal Aset)' },
            { id: 'quiz', label: '2️⃣ Vibe Check 🧠 (Brain Test)' },
          ].map((t) => {
            const active = subtab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSubtab(t.id as 'bancuh' | 'quiz')}
                className={`px-5 sm:px-7 py-2.5 rounded-full font-display font-extrabold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shrink-0 border-2 ${
                  active
                    ? 'bg-[#10D989] text-[#0F172A] border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] -translate-y-0.5'
                    : 'bg-transparent text-slate-700 border-transparent hover:bg-[#F7F9F6]'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: BANCUH PORTFOLIO & KENAL BEZA RISK-FREE VS RISKY ASSET */}
      {subtab === 'bancuh' && (
        <div className="space-y-10 animate-fadeIn">
          {/* Header */}
          <div className="text-center space-y-2">
            <span className="inline-block bg-[#FEF08A] border-2 border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] rounded-xl px-3.5 py-1 text-xs font-extrabold">
              🧪 KENAL DULU BARU BANCUH!
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0F172A]">
              Apa Beza <span className="bg-[#BFDBFE] px-3 py-0.5 rounded-2xl border-3 border-[#0F172A]">Aset Kebal</span> vs <span className="bg-[#FBCFE8] px-3 py-0.5 rounded-2xl border-3 border-[#0F172A]">Aset Rollercoaster</span>? 👀
            </h1>
            <p className="text-base font-bold text-slate-700 max-w-2xl mx-auto">
              Ramai student terciduk sebab tak reti beza mana satu tempat simpan selamat & mana satu boleh lebur. Jom fahamkan 2 geng aset ni dulu!
            </p>
          </div>

          {/* PART A: SIDE-BY-SIDE CHEAT SHEET (RISK-FREE VS RISKY) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk-Free Bucket */}
            <div className="neo-card-lg bg-[#BFDBFE] rounded-3xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-white border-2 border-[#0F172A] px-3 py-1 rounded-xl text-xs font-extrabold shadow-[2px_2px_0px_0px_#0F172A]">
                  🛡️ RISK-FREE / LOW RISK
                </span>
                <span className="text-4xl emoji-3d">🛌🛡️</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                Aset Kebal (Modal Selamat)
              </h2>
              <ul className="space-y-2 text-sm font-bold text-slate-900">
                <li className="bg-white/90 border-2 border-[#0F172A] rounded-xl p-3">
                  ✅ <strong>Duit Pokok Tak Susut:</strong> Letak RM1,000, esok tetap ada RM1,000+.
                </li>
                <li className="bg-white/90 border-2 border-[#0F172A] rounded-xl p-3">
                  ✅ <strong>Pulangan Stabil:</strong> Dapat dividen ~3% ke 5.5% setahun dengan tenang.
                </li>
                <li className="bg-white/90 border-2 border-[#0F172A] rounded-xl p-3">
                  📌 <strong>Contoh:</strong> ASB, Tabung Haji, Fixed Deposit (FD) Islamik, Versa Cash-i.
                </li>
              </ul>
            </div>

            {/* Risky Bucket */}
            <div className="neo-card-lg bg-[#FBCFE8] rounded-3xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-white border-2 border-[#0F172A] px-3 py-1 rounded-xl text-xs font-extrabold shadow-[2px_2px_0px_0px_#0F172A]">
                  🎢 RISKY / HIGH VOLATILITY
                </span>
                <span className="text-4xl emoji-3d">🎢🚀</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                Aset Rollercoaster (Berisiko)
              </h2>
              <ul className="space-y-2 text-sm font-bold text-slate-900">
                <li className="bg-white/90 border-2 border-[#0F172A] rounded-xl p-3">
                  ⚠️ <strong>Harga Turun Naik:</strong> Nilai ikut pasaran, boleh naik laju & boleh drop!
                </li>
                <li className="bg-white/90 border-2 border-[#0F172A] rounded-xl p-3">
                  🚀 <strong>Potensi Untung Besar:</strong> Boleh cecah 8% ke 20%+ setahun untuk jangka panjang.
                </li>
                <li className="bg-white/90 border-2 border-[#0F172A] rounded-xl p-3">
                  📌 <strong>Contoh:</strong> Saham (Bursa/US), ETF, Unit Trust Ekuiti, Kripto.
                </li>
              </ul>
            </div>
          </div>

          {/* PART B: INTERACTIVE 6-ASSET INSPECTOR & SORTING MINI-LAB */}
          <div className="neo-card-lg bg-white rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-3 border-[#0F172A] pb-4">
              <div>
                <h3 className="font-display text-2xl font-extrabold text-[#0F172A]">
                  🔍 Klik & Uji: Aset Ni Kebal Ke Rollercoaster?
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-600">
                  Klik mana-mana aset kat bawah untuk baca rahsia dia & teka kategori dia!
                </p>
              </div>
              <span className="font-mono-num text-xs font-extrabold bg-[#A7F3D0] border-2 border-[#0F172A] px-3 py-1.5 rounded-xl shrink-0">
                Berjaya Klasifikasi: {Object.keys(sortedMap).length} / 6 Aset
              </span>
            </div>

            {/* 6 Clickable Asset Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {ASSET_ITEMS.map((item) => {
                const isSelected = selectedAsset.id === item.id;
                const isSorted = sortedMap[item.id] !== undefined;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedAsset(item);
                      setSortFeedback(null);
                    }}
                    className={`neo-btn p-3.5 rounded-2xl flex flex-col items-center text-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#FEF08A] -translate-y-1 ring-3 ring-[#0F172A]'
                        : isSorted
                        ? 'bg-[#A7F3D0]'
                        : 'bg-[#F7F9F6]'
                    }`}
                  >
                    <span className="text-3xl emoji-3d">{item.emoji}</span>
                    <span className="font-display text-xs font-extrabold text-[#0F172A] leading-tight">
                      {item.name.split(' ')[0]} {item.name.split(' ')[1] || ''}
                    </span>
                    {isSorted && (
                      <span className="text-[10px] font-extrabold bg-white border border-[#0F172A] px-1.5 py-0.5 rounded-md">
                        {sortedMap[item.id] === 'kebal' ? '🛡️ Kebal' : '🎢 Risky'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Asset Spotlight + Interactive Categorization Buttons */}
            <div className="bg-[#F7F9F6] border-3 border-[#0F172A] rounded-3xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#0F172A] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl emoji-3d bg-white border-2 border-[#0F172A] p-2.5 rounded-2xl">
                    {selectedAsset.emoji}
                  </span>
                  <div>
                    <h4 className="font-display text-xl sm:text-2xl font-extrabold text-[#0F172A]">
                      {selectedAsset.name}
                    </h4>
                    <span className="text-xs font-extrabold text-slate-600">
                      Pulangan: {selectedAsset.returnRange} · Tahap Risiko: {selectedAsset.riskLevel}
                    </span>
                  </div>
                </div>

                {/* Quick Sort Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSortGuess(selectedAsset, 'kebal')}
                    className="neo-btn bg-[#BFDBFE] hover:bg-[#93C5FD] px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer"
                  >
                    🛡️ Ini Aset Kebal!
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSortGuess(selectedAsset, 'risky')}
                    className="neo-btn bg-[#FBCFE8] hover:bg-[#FF4766] hover:text-white px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer"
                  >
                    🎢 Ini Rollercoaster!
                  </button>
                </div>
              </div>

              <p className="text-sm sm:text-base font-bold text-[#0F172A] bg-white border-2 border-[#0F172A] rounded-2xl p-4">
                💡 <strong>Kenapa?</strong> {selectedAsset.whyText} <br />
                <span className="text-xs text-slate-600">{selectedAsset.example}</span>
              </p>

              {sortFeedback && (
                <div className="bg-[#FEF08A] border-2 border-[#0F172A] rounded-xl px-4 py-2.5 font-extrabold text-xs sm:text-sm text-[#0F172A]">
                  {sortFeedback}
                </div>
              )}
            </div>
          </div>

          {/* PART C: THE VIBE SLIDER (BANCUH PORTFOLIO 80/20 SWEET SPOT) */}
          <div
            className={`neo-card-lg rounded-3xl p-6 sm:p-10 transition-colors duration-300 space-y-6 ${
              isSweetSpot
                ? 'bg-[#10D989] shadow-[0_0_30px_rgba(16,217,137,0.45)]'
                : isFullKebal
                ? 'bg-[#BFDBFE]'
                : 'bg-[#FBCFE8] animate-neo-shake'
            }`}
          >
            <div className="text-center space-y-1">
              <span className="bg-white border-2 border-[#0F172A] px-3 py-1 rounded-xl text-xs font-extrabold">
                🧪 SIMULASI BANCUH PORTFOLIO
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-[#0F172A] pt-1">
                Cuba Tarik Slider & Cari Sweet Spot 80/20!
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border-3 border-[#0F172A] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#0F172A] text-center">
                <div className="text-xs font-extrabold uppercase text-slate-600">
                  🛡️ Aset Kebal (ASB / TH / FD)
                </div>
                <div className="font-mono-num text-3xl sm:text-5xl font-extrabold text-[#0F172A] mt-1">
                  {kebalPct}%
                </div>
              </div>

              <div className="bg-white border-3 border-[#0F172A] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#0F172A] text-center">
                <div className="text-xs font-extrabold uppercase text-slate-600">
                  🎢 Aset Rollercoaster (Saham / ETF)
                </div>
                <div className="font-mono-num text-3xl sm:text-5xl font-extrabold text-[#FF4766] mt-1">
                  {riskyPct}%
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleSliderChange(0)}
                className="neo-btn bg-white px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer"
              >
                🛌 100% Kebal
              </button>
              <button
                type="button"
                onClick={() => handleSliderChange(20)}
                className="neo-btn bg-[#FEF08A] px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer"
              >
                🔥 80% Kebal / 20% Attack (Sweet Spot)
              </button>
              <button
                type="button"
                onClick={() => handleSliderChange(100)}
                className="neo-btn bg-white px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer"
              >
                🎢 100% Rollercoaster
              </button>
            </div>

            <div className="bg-white border-3 border-[#0F172A] rounded-3xl p-5 shadow-[4px_4px_0px_0px_#0F172A] space-y-3">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={riskyPct}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="neo-slider"
              />
              <div className="flex justify-between text-xs sm:text-sm font-extrabold text-[#0F172A]">
                <span>⬅️ 100% Aset Kebal</span>
                <span className="text-emerald-700">🎯 80/20 Sweet Spot</span>
                <span>100% Aset Rollercoaster ➡️</span>
              </div>
            </div>

            <div className="bg-white border-4 border-[#0F172A] rounded-3xl p-6 text-center shadow-[6px_6px_0px_0px_#0F172A] space-y-2">
              <p className="font-display text-xl sm:text-2xl font-extrabold text-[#0F172A]">
                {isSweetSpot
                  ? 'SMART COMBO 🔥! 80% backup kebal kat ASB/TH, 20% attack kat ETF/Saham. Chill tapi masyuk!'
                  : isFullKebal
                  ? '100% ASB/FD. Boring sikit ngl, tapi confirm duit tak lebur. Tidur lena bro.'
                  : '100% Kripto/Saham. Jantung kena kental! Boleh kaya cepat, tapi kalau crash memang melopong.'}
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setSubtab('quiz')}
              className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-xl sm:text-2xl font-extrabold px-8 sm:px-10 py-5 rounded-3xl cursor-pointer shadow-[0_0_25px_rgba(16,217,137,0.45)]"
            >
              Next: Test Otak Skit 🧠 (Vibe Check)
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 2: VIBE CHECK QUIZ (WITH "LET'S START" SCREEN & MASSIVE BADGE) */}
      {subtab === 'quiz' && (
        <section className="space-y-8 animate-fadeIn">
          {/* "LET'S START!" INTRO SCREEN BEFORE ANSWERING */}
          {!quizStarted && !quizFinished && (
            <div className="neo-card-lg bg-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
              <div className="inline-block bg-[#FBCFE8] border-2 border-[#0F172A] px-4 py-1.5 rounded-xl text-xs font-extrabold shadow-[2px_2px_0px_0px_#0F172A]">
                🧠 ASSET VIBE CHECK · 3 SOALAN PANTAS
              </div>
              <div className="text-6xl sm:text-7xl emoji-3d animate-bounce">🧢⚡📠</div>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0F172A]">
                Ready Nak Uji Otak Pasal Aset?
              </h2>
              <p className="text-base sm:text-lg font-bold text-slate-700 max-w-lg mx-auto">
                Tekan Fact atau Cap untuk 3 penyataan ni & unlock Lencana Asset Master kau!
              </p>
              <button
                type="button"
                onClick={() => setQuizStarted(true)}
                className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-2xl sm:text-3xl font-extrabold px-10 py-5 rounded-3xl cursor-pointer shadow-[0_0_25px_rgba(16,217,137,0.5)]"
              >
                Let's Start Quiz! 🚀
              </button>
            </div>
          )}

          {/* ACTIVE QUIZ QUESTIONS */}
          {quizStarted && !quizFinished && (
            <div
              className={`neo-card-lg bg-white rounded-3xl p-6 sm:p-10 text-center space-y-8 ${
                cardShake ? 'animate-neo-shake' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="bg-[#FEF08A] border-2 border-[#0F172A] px-3.5 py-1 rounded-xl text-xs font-extrabold">
                  Soalan {quizIdx + 1} / {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-3xl emoji-3d">🧐</span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#0F172A] py-4">
                {QUIZ_QUESTIONS[quizIdx].question}
              </h2>

              {quizFeedback && (
                <div
                  className={`p-4 rounded-2xl border-3 border-[#0F172A] font-display text-xl font-extrabold shadow-[4px_4px_0px_0px_#0F172A] ${
                    quizFeedback.status === 'correct' ? 'bg-[#10D989]' : 'bg-[#FF4766] text-white'
                  }`}
                >
                  {quizFeedback.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <button
                  type="button"
                  onClick={() => handleQuizAnswer('cap')}
                  className="neo-btn bg-[#FBCFE8] hover:bg-[#FF4766] hover:text-white text-[#0F172A] font-display text-2xl font-extrabold py-5 px-6 rounded-3xl cursor-pointer"
                >
                  Cap 🧢 (Mitos)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuizAnswer('fact')}
                  className="neo-btn bg-[#A7F3D0] hover:bg-[#10D989] text-[#0F172A] font-display text-2xl font-extrabold py-5 px-6 rounded-3xl cursor-pointer"
                >
                  Fact 📠 (Legit)
                </button>
              </div>
            </div>
          )}

          {/* MASSIVE BADGE REVEAL AFTER FINISHING */}
          {quizFinished && (
            <div className="neo-card-lg bg-[#FEF08A] rounded-3xl p-8 sm:p-12 text-center space-y-8 animate-fadeIn">
              {/* Oversized Giant Badge */}
              <div className="max-w-lg mx-auto bg-[#10D989] border-4 border-[#0F172A] shadow-[10px_10px_0px_0px_#0F172A] rounded-3xl p-8 -rotate-1 space-y-3">
                <div className="inline-block bg-white border-2 border-[#0F172A] px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                  🏆 LENCANA RASMI TER-LOOT!
                </div>
                <div className="text-7xl sm:text-8xl emoji-3d py-2 animate-bounce">🛡️👑🎢</div>
                <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0F172A] leading-none">
                  ASSET MIXER MASTER!
                </h2>
                <p className="text-sm font-extrabold text-[#0F172A]">
                  Certified Pro: Bijak Beza Aset Kebal vs Aset Berisiko ✅
                </p>
              </div>

              <p className="text-base sm:text-lg font-bold text-slate-800 max-w-xl mx-auto">
                Mantap wei! Sekarang kau dah tahu bila nak guna ASB/Tabung Haji & bila nak guna ETF/Saham.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setQuizIdx(0);
                    setQuizFinished(false);
                    setQuizStarted(false);
                  }}
                  className="neo-btn bg-white px-6 py-4 rounded-2xl font-extrabold text-sm cursor-pointer"
                >
                  🔄 Main Semula Quiz
                </button>
                <button
                  type="button"
                  onClick={onNextTab}
                  className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-xl sm:text-2xl font-extrabold px-8 sm:px-10 py-5 rounded-3xl cursor-pointer shadow-[0_0_25px_rgba(16,217,137,0.5)]"
                >
                  Onz! Proceed to Kamus Lingo ☕ 🚀
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
