import React, { useState } from 'react';

interface Tab8Props {
  onRestartFlow: () => void;
  onTriggerConfetti: () => void;
}

const RED_FLAG_CARDS = [
  {
    id: 'riba',
    emoji: '🏦',
    title: 'No Riba (Bunga / Interest)',
    frontSub: 'Duit beranak atas angin tanpa bisnes sebenar.',
    bgFront: 'bg-[#FBCFE8]',
    bgBack: 'bg-[#FEF08A]',
    bullets: [
      '❌ Haram ambil untung tetap daripada pinjaman faedah (konvensional FD/bon).',
      '✅ Tukar ke Akaun Islamik, Sukuk, ASB, atau Tabung Haji yang guna akad Syariah!',
    ],
  },
  {
    id: 'maysir',
    emoji: '🎰',
    title: 'No Maysir (Unsur Judi)',
    frontSub: 'Main tikam nasib macam kasino, zero analisis.',
    bgFront: 'bg-[#C4B5FD]',
    bgBack: 'bg-[#A7F3D0]',
    bullets: [
      '❌ Binary option, leverage melampau & tikam meme coin tanpa asas bisnes tu judi.',
      '✅ Melabur kena ada aset sebenar, laporan kewangan jelas & nilai ekonomi!',
    ],
  },
  {
    id: 'gharar',
    emoji: '🌫️',
    title: 'No Gharar (Kabur / Scam)',
    frontSub: 'Kontrak samar-samar, tak tahu duit pergi mana.',
    bgFront: 'bg-[#BFDBFE]',
    bgBack: 'bg-[#FBCFE8]',
    bullets: [
      '❌ Skim "pakej gandakan duit" kat Telegram yang janji bulan bintang tapi bisnes misteri.',
      '✅ Hanya guna platform berdaftar Suruhanjaya Sekuriti (SC) Malaysia!',
    ],
  },
  {
    id: 'sektor',
    emoji: '🚩',
    title: 'Red Flag 🚩 (Sektor Haram)',
    frontSub: 'Syarikat jual benda terlarang walaupun untung besar.',
    bgFront: 'bg-[#FEF08A]',
    bgBack: 'bg-[#BFDBFE]',
    bullets: [
      '❌ Elak saham arak, kasino/judi, rokok, senjata & bank konvensional.',
      '✅ Aktifkan "Shariah Mode" dalam broker supaya tapis saham patuh Syariah automatik!',
    ],
  },
];

interface BrokerPort {
  id: string;
  name: string;
  category: 'cash' | 'robo' | 'saham';
  categoryLabel: string;
  tier: string;
  emoji: string;
  bg: string;
  minModal: string;
  estReturn: string;
  regulator: string;
  bestFor: string;
  features: string[];
  url: string;
}

const PORT_GEMPAK_LIST: BrokerPort[] = [
  {
    id: 'asnb-th',
    name: 'ASNB (ASB) & Tabung Haji',
    category: 'cash',
    categoryLabel: 'Simpanan Kebal',
    tier: 'S-TIER · WAJIB ADA',
    emoji: '🛡️',
    bg: 'bg-[#A7F3D0]',
    minModal: 'RM 10',
    estReturn: '3.1% – 5.5% setahun',
    regulator: 'Dijamin Kerajaan / PNB',
    bestFor: 'Student baru nak bina Emergency Fund tanpa risiko modal lebur.',
    features: ['Harga tetap RM1 seunit', 'Zero caj tersembunyi', 'TH siap tolak zakat automatik'],
    url: 'https://www.myasnb.com.my',
  },
  {
    id: 'versa',
    name: 'Versa Islamic (Versa Cash-i)',
    category: 'cash',
    categoryLabel: 'Money Market Islamik',
    tier: 'S-TIER · DAILY PROFIT',
    emoji: '🌙',
    bg: 'bg-[#BFDBFE]',
    minModal: 'RM 10',
    estReturn: '~3.6% – 4.0% setahun',
    regulator: 'Berlesen SC Malaysia',
    bestFor: 'Park duit PTPTN/elaun sementara tunggu nak guna, cair cepat macam bank biasa!',
    features: ['100% Patuh Syariah', 'Tiada lock-in period', 'Boleh withdraw bila-bila masa'],
    url: 'https://versa.com.my',
  },
  {
    id: 'wahed',
    name: 'Wahed Invest',
    category: 'robo',
    categoryLabel: 'Robo-Advisor Syariah',
    tier: 'S-TIER · AUTO-INVEST',
    emoji: '🤖',
    bg: 'bg-[#FEF08A]',
    minModal: 'RM 100',
    estReturn: '6% – 11% setahun (Ikut Portfolio)',
    regulator: 'Berlesen SC Malaysia',
    bestFor: 'Student sibuk assignment yang nak AI tolong bancuhkan ETF US, Saham Malaysia & Emas!',
    features: ['Siap tapis Syariah automatik', 'Ada laporan Detox Dividen tahunan', 'Pilih tahap risiko ikut suka'],
    url: 'https://www.wahedinvest.com',
  },
  {
    id: 'moomoo',
    name: 'Moomoo Malaysia',
    category: 'saham',
    categoryLabel: 'Broker Saham & ETF',
    tier: 'A-TIER · DIY INVESTOR',
    emoji: '🐮',
    bg: 'bg-[#FBCFE8]',
    minModal: 'RM 50 – RM 100',
    estReturn: 'Ikut Pilihan Saham / ETF',
    regulator: 'Berlesen SC Malaysia',
    bestFor: 'Yang nak beli saham Bursa Malaysia & US (Apple, Nvidia) sendiri guna Shariah Screener!',
    features: ['Ada butang khas Shariah Screener', 'Caj broker sangat murah', 'Akaun CDS siap dalam 1 hari'],
    url: 'https://www.moomoo.com/my',
  },
  {
    id: 'rakuten',
    name: 'Rakuten Trade',
    category: 'saham',
    categoryLabel: 'Broker Saham Tempatan & US',
    tier: 'A-TIER · MESRA PEMULA',
    emoji: '⚡',
    bg: 'bg-[#C4B5FD]',
    minModal: 'RM 100',
    estReturn: 'Ikut Pilihan Saham / ETF',
    regulator: 'Berlesen SC Malaysia',
    bestFor: 'Student yang nak kumpul mata ganjaran sambil beli kaunter saham bertanda "S" (Syariah).',
    features: ['Icon khas untuk kaunter Syariah', 'Boleh beli fractional shares US', 'Riset percuma tiap hari'],
    url: 'https://www.rakutentrade.my',
  },
  {
    id: 'kdi',
    name: 'RIA by ASNB / KDI',
    category: 'robo',
    categoryLabel: 'Micro-Investing App',
    tier: 'B-TIER · ALTERNATIF',
    emoji: '📱',
    bg: 'bg-[#BFDBFE]',
    minModal: 'RM 100',
    estReturn: '4% – 8% setahun',
    regulator: 'Berlesen SC Malaysia',
    bestFor: 'Student yang suka auto-debit bulanan konsisten terus daripada akaun bank.',
    features: ['Antaramuka moden & ringkas', 'Kawal selia ketat SC Malaysia', 'Sesuai untuk DCA bulanan'],
    url: 'https://www.myasnb.com.my/ria',
  },
];

const HALAL_GAME_QUESTIONS = [
  {
    id: 1,
    scenario: 'Syarikat A buat bisnes teknologi cloud & AI, lulus tapisan Majlis Penasihat Syariah SC Malaysia.',
    emoji: '💻☁️',
    answer: 'halal' as const,
    winPhrase: 'Mantap! W Rizz 🔥',
    winMeme: 'STONKS 📈 · Saham Patuh Syariah Legit!',
    losePhrase: 'Terciduk! 💀 L Move',
  },
  {
    id: 2,
    scenario: 'Member ajak masuk "Tabung Gandakan Duit" kat Telegram — masuk RM100 esok dapat RM500, bisnes rahsia.',
    emoji: '🕵️‍♂️💸',
    answer: 'haram' as const,
    winPhrase: 'Cooked perfectly 🍳',
    winMeme: 'STONKS 📈 · Selamat daripada Gharar & Scam!',
    losePhrase: 'GGWK. Kena scam 📉',
  },
  {
    id: 3,
    scenario: 'Beli saham syarikat resort yang 75% pendapatan dia datang daripada kasino & kelab malam.',
    emoji: '🎰🍸',
    answer: 'haram' as const,
    winPhrase: 'Stonks 📈',
    winMeme: 'W RIZZ 🔥 · Kau berjaya elak Red Flag 🚩 (Sektor Haram)!',
    losePhrase: 'Alamak bro 🚩',
  },
];

export const Tab8HalalOrNah: React.FC<Tab8Props> = ({ onRestartFlow, onTriggerConfetti }) => {
  const [subtab, setSubtab] = useState<1 | 2 | 3>(1);

  // Subtab 1 Flip Card State
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  // Subtab 2 Detox Dividen State
  const [totalDividend, setTotalDividend] = useState<number>(500);
  const [dirtyPct, setDirtyPct] = useState<number>(8);

  // Subtab 3 Filter & Mini-Game State
  const [portFilter, setPortFilter] = useState<'all' | 'cash' | 'robo' | 'saham'>('all');
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameIdx, setGameIdx] = useState<number>(0);
  const [gameResult, setGameResult] = useState<{
    correct: boolean;
    phrase: string;
    meme: string;
  } | null>(null);
  const [wastedOverlay, setWastedOverlay] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [gameComplete, setGameComplete] = useState<boolean>(false);

  const sedekahAmount = Number(((totalDividend * dirtyPct) / 100).toFixed(2));
  const halalWalletAmount = Number((totalDividend - sedekahAmount).toFixed(2));

  const filteredPorts =
    portFilter === 'all'
      ? PORT_GEMPAK_LIST
      : PORT_GEMPAK_LIST.filter((p) => p.category === portFilter);

  const handleCardFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGameChoice = (choice: 'halal' | 'haram') => {
    if (gameResult) return;
    const current = HALAL_GAME_QUESTIONS[gameIdx];
    const isCorrect = choice === current.answer;

    if (isCorrect) {
      setScore((s) => s + 1);
      onTriggerConfetti();
      setGameResult({
        correct: true,
        phrase: current.winPhrase,
        meme: current.winMeme,
      });
    } else {
      setWastedOverlay(true);
      setTimeout(() => setWastedOverlay(false), 1100);
      setGameResult({
        correct: false,
        phrase: current.losePhrase,
        meme: 'WOMP WOMP 💀 · WASTED! Baca balik Red Flags 🚩 kat Subtab 1.',
      });
    }

    setTimeout(() => {
      setGameResult(null);
      if (gameIdx < HALAL_GAME_QUESTIONS.length - 1) {
        setGameIdx((p) => p + 1);
      } else {
        setGameComplete(true);
        onTriggerConfetti();
      }
    }, 1450);
  };

  return (
    <div
      className={`space-y-8 pb-12 max-w-5xl mx-auto transition-all duration-300 ${
        wastedOverlay ? 'grayscale contrast-125 animate-neo-shake' : ''
      }`}
    >
      {/* Sticky Pill-Shaped Horizontal Subtab Bar */}
      <div className="sticky top-4 z-30 flex justify-center">
        <div className="neo-card bg-white rounded-full p-1.5 flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full">
          {[
            { id: 1, label: 'Red Flags 🚩' },
            { id: 2, label: 'Detox Dividen 🧼' },
            { id: 3, label: 'Port Gempak & Play 🎮' },
          ].map((t) => {
            const active = subtab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSubtab(t.id as 1 | 2 | 3)}
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

      {/* SUBTAB 1: RED FLAGS 🚩 (4 3D FLIP CARDS) */}
      {subtab === 1 && (
        <section className="space-y-8 animate-fadeIn">
          <div className="text-center space-y-2">
            <span className="inline-block bg-[#FBCFE8] border-2 border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] rounded-xl px-3.5 py-1 text-xs font-extrabold">
              🕋 ASAS PELABURAN PATUH SYARIAH
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0F172A]">
              4 Red Flags 🚩 Wajib Elak Bila Melabur
            </h1>
            <p className="text-base font-bold text-slate-700">
              Nak berkat & tenang hati? Tekan butang "Spill the Tea ☕" kat setiap kad untuk flip!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {RED_FLAG_CARDS.map((card) => {
              const isFlipped = !!flippedCards[card.id];
              return (
                <div
                  key={card.id}
                  onClick={() => handleCardFlip(card.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardFlip(card.id);
                    }
                  }}
                  className="perspective-1000 h-64 sm:h-68 cursor-pointer select-none"
                >
                  <div
                    className={`w-full h-full relative transform-style-3d ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* FRONT OF CARD */}
                    <div
                      className={` inset-0 backface-hidden neo-card-lg ${card.bgFront} rounded-3xl p-6 flex flex-col justify-between`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-white border-2 border-[#0F172A] px-3 py-1 rounded-xl text-xs font-extrabold shadow-[2px_2px_0px_0px_#0F172A]">
                          PANTANG LARANG SYARIAH
                        </span>
                        <span className="text-4xl emoji-3d">{card.emoji}</span>
                      </div>

                      <div className="my-auto space-y-1.5">
                        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                          {card.title}
                        </h2>
                        <p className="text-sm font-bold text-slate-800">{card.frontSub}</p>
                      </div>

                      <div>
                        <span className="inline-flex items-center gap-2 bg-white border-2 border-[#0F172A] px-4 py-2 rounded-xl font-display text-xs sm:text-sm font-extrabold shadow-[3px_3px_0px_0px_#0F172A]">
                          Spill the Tea ☕
                        </span>
                      </div>
                    </div>

                    {/* BACK OF CARD */}
                    <div
                      className={` inset-0 backface-hidden rotate-y-180 neo-card-lg ${card.bgBack} rounded-3xl p-6 flex flex-col justify-between`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-[#0F172A] text-white px-3 py-1 rounded-xl text-xs font-extrabold">
                          ☕ THE TEA: {card.title}
                        </span>
                        <span className="text-2xl emoji-3d">{card.emoji}</span>
                      </div>

                      <ul className="space-y-3 my-auto">
                        {card.bullets.map((b, i) => (
                          <li
                            key={i}
                            className="bg-white/90 border-2 border-[#0F172A] rounded-2xl p-3 text-xs sm:text-sm font-extrabold text-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A]"
                          >
                            {b}
                          </li>
                        ))}
                      </ul>

                      <div className="text-right text-xs font-extrabold text-slate-700">
                        Tap untuk pusing balik 🔄
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setSubtab(2)}
              className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-xl font-extrabold px-8 py-4 rounded-2xl cursor-pointer"
            >
              Next: Cuba Kalkulator Detox Dividen 🧼 ➡️
            </button>
          </div>
        </section>
      )}

      {/* SUBTAB 2: DETOX DIVIDEN 🧼 (WITH CLICKABLE REAL BAITULMAL & ISLAMIC RELIEF LINKS) */}
      {subtab === 2 && (
        <section className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <span className="inline-block bg-[#A7F3D0] border-2 border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] rounded-xl px-3.5 py-1 text-xs font-extrabold">
              🧼 KALKULATOR PENYUCIAN DIVIDEN
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0F172A]">
              Detox Dividen 🧼
            </h1>
            <p className="text-base font-bold text-slate-700">
              Kira berapa peratus dividen kotor kena buang & terus klik link rasmi kat bawah untuk salurkan!
            </p>
          </div>

          <div className="neo-card-lg bg-white rounded-3xl p-6 sm:p-8 space-y-8">
            <div className="bg-[#BFDBFE] border-3 border-[#0F172A] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#0F172A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block font-display text-lg font-extrabold text-[#0F172A]">
                  💰 Total Dividen Kau Dapat (RM)
                </label>
                <span className="text-xs font-bold text-slate-700">
                  Masukkan jumlah dividen yang masuk akaun broker kau
                </span>
              </div>
              <input
                type="number"
                min={10}
                step={50}
                value={totalDividend}
                onChange={(e) => setTotalDividend(Math.max(0, Number(e.target.value)))}
                className="w-full sm:w-48 bg-white border-3 border-[#0F172A] rounded-xl px-4 py-3 font-mono-num text-2xl font-extrabold text-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] text-right"
              />
            </div>

            <div className="space-y-3 bg-[#F7F9F6] border-3 border-[#0F172A] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#0F172A]">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-extrabold text-[#0F172A]">
                  ☣️ Peratusan Income Kotor (Non-Shariah %):
                </span>
                <span className="font-mono-num text-xl font-extrabold bg-[#FF4766] text-white border-2 border-[#0F172A] px-3.5 py-1 rounded-xl shadow-[2px_2px_0px_0px_#0F172A]">
                  {dirtyPct}%
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={50}
                step={1}
                value={dirtyPct}
                onChange={(e) => setDirtyPct(Number(e.target.value))}
                className="neo-slider neo-slider-coral"
              />

              <div className="flex justify-between text-xs font-extrabold text-slate-600">
                <span>0% (100% Bersih)</span>
                <span>5% (Had SC)</span>
                <span>25%</span>
                <span>50% (Tinggi Teruk!)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Sedekah / Buang Card WITH REAL CLICKABLE LINKS */}
              <div className="neo-card bg-[#FBCFE8] rounded-3xl p-6 space-y-4 relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-white border-2 border-[#0F172A] px-3 py-1 rounded-xl text-xs font-extrabold">
                      WAJIB CUCI / BUANG
                    </span>
                    <div className="flex items-center gap-1 text-3xl select-none">
                      <span className="emoji-3d inline-block animate-bounce">🗑️</span>
                      <span className="emoji-3d inline-block animate-pulse">📦</span>
                    </div>
                  </div>
                  <div className="text-sm font-extrabold text-[#0F172A]">
                    Sedekah / Buang ({dirtyPct}%):
                  </div>
                  <div className="font-mono-num text-3xl sm:text-4xl font-extrabold text-[#FF4766] bg-white border-3 border-[#0F172A] rounded-2xl p-3.5 shadow-[4px_4px_0px_0px_#0F172A]">
                    RM {sedekahAmount.toFixed(2)}
                  </div>
                </div>

                {/* Clickable Links to Real Websites (Baitulmal & Islamic Relief) */}
                <div className="space-y-2 pt-2 border-t-2 border-[#0F172A]/20">
                  <div className="text-xs font-extrabold text-[#0F172A]">
                    🔗 Klik Terus Website Rasmi Untuk Buang / Salurkan:
                  </div>
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://www.maiwp.gov.my"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neo-btn bg-white hover:bg-[#FEF08A] text-[#0F172A] px-3.5 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-between"
                    >
                      <span>🏛️ Baitulmal (MAIWP)</span>
                      <span>Salur Sekarang ↗️</span>
                    </a>
                    <a
                      href="https://islamic-relief.org.my"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neo-btn bg-white hover:bg-[#FEF08A] text-[#0F172A] px-3.5 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-between"
                    >
                      <span>🌍 Islamic Relief Malaysia</span>
                      <span>Salur Sekarang ↗️</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Dompet Halal Card */}
              <div className="neo-card bg-[#A7F3D0] rounded-3xl p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-white border-2 border-[#0F172A] px-3 py-1 rounded-xl text-xs font-extrabold">
                      100% BERSIH & BERKAT
                    </span>
                    <span className="text-3xl emoji-3d">✨🕋</span>
                  </div>
                  <div className="text-sm font-extrabold text-[#0F172A]">
                    Dompet Halal ({100 - dirtyPct}%):
                  </div>
                  <div className="font-mono-num text-3xl sm:text-4xl font-extrabold text-[#10D989] bg-[#0F172A] border-3 border-[#0F172A] rounded-2xl p-3.5 shadow-[0_0_22px_rgba(16,217,137,0.65)]">
                    RM {halalWalletAmount.toFixed(2)}
                  </div>
                </div>

                <div className="bg-white/90 border-2 border-[#0F172A] rounded-2xl p-3.5 text-xs font-bold text-slate-800">
                  ✅ Duit ni dah siap detox! Boleh guna makan sedap atau reinvest semula dengan hati tenang.
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setSubtab(3)}
              className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-xl font-extrabold px-8 py-4 rounded-2xl cursor-pointer"
            >
              Next: Port Gempak & Mini-Game 🎮 ➡️
            </button>
          </div>
        </section>
      )}

      {/* SUBTAB 3: PORT GEMPAK & PLAY 🎮 (UPGRADED INTERACTIVE SHOWCASE + MINI-GAME) */}
      {subtab === 3 && (
        <section className="space-y-12 animate-fadeIn">
          {/* PORT GEMPAK NAK MULA MELABUR SHOWCASE */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-block bg-[#FEF08A] border-2 border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] rounded-xl px-3.5 py-1 text-xs font-extrabold">
                🚀 PANDUAN PLATFORM SAH & PATUH SYARIAH
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0F172A]">
                Port Gempak Nak Mula Melabur 🚀
              </h2>
              <p className="text-base font-bold text-slate-700 max-w-2xl mx-auto">
                Semua port kat bawah ni berdaftar dengan SC Malaysia / Kerajaan. Pilih ikut modal & gaya kau!
              </p>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {[
                { id: 'all', label: '🔥 Semua Port (6)' },
                { id: 'cash', label: '🛡️ Simpanan & Cash Kebal' },
                { id: 'robo', label: '🤖 Robo-Advisor (Auto)' },
                { id: 'saham', label: '📈 Broker Saham & ETF' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setPortFilter(btn.id as 'all' | 'cash' | 'robo' | 'saham')}
                  className={`neo-btn px-4 py-2.5 rounded-2xl font-display font-extrabold text-xs sm:text-sm cursor-pointer ${
                    portFilter === btn.id ? 'bg-[#10D989] text-[#0F172A]' : 'bg-white text-slate-700'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Rich Broker / Platform Showcase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPorts.map((port) => (
                <div
                  key={port.id}
                  className={`neo-card-lg ${port.bg} rounded-3xl p-6 flex flex-col justify-between space-y-5`}
                >
                  <div className="space-y-4">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-[#0F172A] text-[#10D989] px-3 py-1 rounded-xl text-[11px] font-extrabold">
                        {port.tier}
                      </span>
                      <span className="bg-white border-2 border-[#0F172A] px-2.5 py-0.5 rounded-xl text-[11px] font-extrabold">
                        ✅ {port.regulator}
                      </span>
                    </div>

                    {/* Title & Emoji */}
                    <div className="flex items-center gap-3.5">
                      <span className="text-4xl emoji-3d bg-white border-3 border-[#0F172A] p-3 rounded-2xl shadow-[3px_3px_0px_0px_#0F172A]">
                        {port.emoji}
                      </span>
                      <div>
                        <span className="text-xs font-extrabold uppercase text-slate-700">
                          {port.categoryLabel}
                        </span>
                        <h3 className="font-display text-2xl font-extrabold text-[#0F172A] leading-tight">
                          {port.name}
                        </h3>
                      </div>
                    </div>

                    {/* Key Metrics Box */}
                    <div className="grid grid-cols-2 gap-2.5 bg-white border-3 border-[#0F172A] rounded-2xl p-3 shadow-[3px_3px_0px_0px_#0F172A]">
                      <div>
                        <div className="text-[10px] font-extrabold uppercase text-slate-500">
                          Modal Mula
                        </div>
                        <div className="font-mono-num text-base font-extrabold text-[#0F172A]">
                          {port.minModal}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-extrabold uppercase text-slate-500">
                          Potensi Pulangan
                        </div>
                        <div className="font-mono-num text-xs font-extrabold text-emerald-700">
                          {port.estReturn}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-[#0F172A]">
                      🎯 <strong>Sesuai Untuk:</strong> {port.bestFor}
                    </p>

                    <ul className="space-y-1.5">
                      {port.features.map((f, i) => (
                        <li
                          key={i}
                          className="text-xs font-extrabold bg-white/80 border-2 border-[#0F172A] rounded-xl px-3 py-1.5"
                        >
                          ✓ {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={port.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neo-btn bg-white hover:bg-[#FEF08A] text-[#0F172A] font-display text-sm font-extrabold py-3 px-4 rounded-2xl text-center block"
                  >
                    Usha Website Rasmi ↗️
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* MINI-GAME: "HALAL KE HARAM BRO?" WITH "LET'S START" SCREEN & MASSIVE BADGE */}
          <div className="space-y-6 pt-6 border-t-4 border-[#0F172A]">
            <div className="text-center space-y-2">
              <span className="inline-block bg-[#C4B5FD] border-2 border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] rounded-xl px-3.5 py-1 text-xs font-extrabold">
                🎮 FINAL BOSS MINI-GAME
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
                Halal ke Haram Bro? 🕋 vs 🚩
              </h2>
            </div>

            {/* "LET'S START!" INTRO SCREEN */}
            {!gameStarted && !gameComplete && (
              <div className="neo-card-lg bg-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
                <div className="text-6xl sm:text-7xl emoji-3d animate-bounce">🎮🕋🚩</div>
                <h3 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0F172A]">
                  Ready Nak Tapis Pelaburan Halal vs Scam?
                </h3>
                <p className="text-base sm:text-lg font-bold text-slate-700 max-w-lg mx-auto">
                  Uji ilmu Syariah kau dengan 3 situasi pelaburan sebenar & loot Lencana Halal Legend!
                </p>
                <button
                  type="button"
                  onClick={() => setGameStarted(true)}
                  className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-2xl sm:text-3xl font-extrabold px-10 py-5 rounded-3xl cursor-pointer shadow-[0_0_25px_rgba(16,217,137,0.5)]"
                >
                  Let's Start Mini-Game! 🚀
                </button>
              </div>
            )}

            {/* ACTIVE MINI-GAME */}
            {gameStarted && !gameComplete && (
              <div className="neo-card-lg bg-white rounded-3xl p-6 sm:p-10 text-center space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="bg-[#FEF08A] border-2 border-[#0F172A] px-3.5 py-1 rounded-xl text-xs font-extrabold">
                    Situasi {gameIdx + 1} / {HALAL_GAME_QUESTIONS.length}
                  </span>
                  <span className="font-mono-num text-xs font-extrabold bg-[#A7F3D0] border-2 border-[#0F172A] px-3 py-1 rounded-xl">
                    Halal Vibe Check
                  </span>
                </div>

                <div className="text-5xl emoji-3d">{HALAL_GAME_QUESTIONS[gameIdx].emoji}</div>

                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] max-w-2xl mx-auto">
                  "{HALAL_GAME_QUESTIONS[gameIdx].scenario}"
                </h3>

                {gameResult && (
                  <div
                    className={`p-5 rounded-3xl border-4 border-[#0F172A] shadow-[6px_6px_0px_0px_#0F172A] ${
                      gameResult.correct
                        ? 'bg-[#10D989] text-[#0F172A]'
                        : 'bg-[#0F172A] text-[#FF4766]'
                    }`}
                  >
                    <div className="font-display text-3xl font-extrabold">{gameResult.phrase}</div>
                    <div className="text-sm sm:text-base font-extrabold mt-1 text-white bg-[#0F172A] inline-block px-4 py-1 rounded-xl">
                      {gameResult.meme}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <button
                    type="button"
                    onClick={() => handleGameChoice('halal')}
                    className="neo-btn bg-[#A7F3D0] hover:bg-[#10D989] text-[#0F172A] font-display text-2xl font-extrabold py-5 px-6 rounded-3xl cursor-pointer"
                  >
                    ✅ Halal Vibes (Onz!)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGameChoice('haram')}
                    className="neo-btn bg-[#FBCFE8] hover:bg-[#FF4766] hover:text-white text-[#0F172A] font-display text-2xl font-extrabold py-5 px-6 rounded-3xl cursor-pointer"
                  >
                    🚩 Red Flag (Haram / Scam!)
                  </button>
                </div>
              </div>
            )}

            {/* MASSIVE BADGE REVEAL AFTER FINISHING */}
            {gameComplete && (
              <div className="neo-card-lg bg-[#FEF08A] rounded-3xl p-8 sm:p-12 text-center space-y-8 animate-fadeIn">
                <div className="max-w-lg mx-auto bg-[#10D989] border-4 border-[#0F172A] shadow-[10px_10px_0px_0px_#0F172A] rounded-3xl p-8 -rotate-1 space-y-3">
                  <div className="inline-block bg-white border-2 border-[#0F172A] px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                    👑 ULTIMATE BADGE UNLOCKED!
                  </div>
                  <div className="text-7xl sm:text-8xl emoji-3d py-2 animate-bounce">👑🕋📈</div>
                  <h3 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0F172A] leading-none">
                    HALAL INVESTOR LEGEND!
                  </h3>
                  <p className="text-sm font-extrabold text-[#0F172A]">
                    100% Bebas Riba, Maysir, Gharar & Scam · W Rizz 🔥
                  </p>
                </div>

                <p className="text-base sm:text-lg font-bold text-slate-900 max-w-xl mx-auto">
                  Tahniah bro! Kau dah tamatkan kesemua 8 modul InvestLAH. Sekarang kau dah ready nak bina kekayaan cara berkat!
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGameIdx(0);
                      setScore(0);
                      setGameComplete(false);
                      setGameStarted(false);
                    }}
                    className="neo-btn bg-white px-6 py-4 rounded-2xl font-extrabold text-sm cursor-pointer"
                  >
                    🔄 Main Semula Mini-Game
                  </button>
                  <button
                    type="button"
                    onClick={onRestartFlow}
                    className="neo-btn bg-[#10D989] hover:bg-white text-[#0F172A] font-display text-xl font-extrabold px-8 py-4 rounded-2xl cursor-pointer"
                  >
                    🏠 Kembali Ke Modul 1
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
