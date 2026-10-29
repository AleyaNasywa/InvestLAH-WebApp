import React, { useState } from 'react';

interface Tab1Props {
  onNextTab: () => void;
}

interface PopBurst {
  id: number;
  cardIndex: number;
  emoji: string;
}

const YEAR_DATA: Record<
  number,
  {
    bobaCount: number;
    pricePerCup: string;
    statusText: string;
    subText: string;
    bgTint: string;
  }
> = {
  2019: {
    bobaCount: 10,
    pricePerCup: 'RM 5.00',
    statusText: '2019: RM50 dapat 10 cawan boba! Satu geng boleh minum.',
    subText: 'Masa ni nilai RM50 memang besar gila.',
    bgTint: 'bg-[#A7F3D0]',
  },
  2020: {
    bobaCount: 9,
    pricePerCup: 'RM 5.50',
    statusText: '2020: Tinggal 9 cawan. Satu cawan dah kena telan inflasi.',
    subText: 'Harga barang mula naik senyap-senyap.',
    bgTint: 'bg-[#BFDBFE]',
  },
  2021: {
    bobaCount: 8,
    pricePerCup: 'RM 6.20',
    statusText: '2021: Tinggal 8 cawan je. Kuasa beli kau makin kecut.',
    subText: 'Simpan cash kosong = duit makin susut.',
    bgTint: 'bg-[#BFDBFE]',
  },
  2022: {
    bobaCount: 7,
    pricePerCup: 'RM 7.10',
    statusText: '2022: Tinggal 7 cawan. Tiga cawan dah lesap!',
    subText: 'Makan kat kafe kolej pun dah rasa mahal.',
    bgTint: 'bg-[#DDD6FE]',
  },
  2023: {
    bobaCount: 6,
    pricePerCup: 'RM 8.30',
    statusText: '2023: RM50 cuma dapat 6 cawan boba.',
    subText: 'Kalau duit tak beranak, inflasi yang makan modal kau.',
    bgTint: 'bg-[#FEF08A]',
  },
  2024: {
    bobaCount: 5,
    pricePerCup: 'RM 10.00',
    statusText: '2024: Separuh dah hilang! Dulu 10, sekarang 5 cawan je.',
    subText: 'Secawan dah RM10. Koyak poket student!',
    bgTint: 'bg-[#FBCFE8]',
  },
  2025: {
    bobaCount: 4,
    pricePerCup: 'RM 12.50',
    statusText: '2025: Tinggal 4 cawan. Enam cawan dah ghaib!',
    subText: 'Kertas RM50 sama, tapi nilai dia dah jatuh teruk.',
    bgTint: 'bg-[#FBCFE8]',
  },
  2026: {
    bobaCount: 3,
    pricePerCup: 'RM 15.90',
    statusText: '2026: Terciduk! RM50 cuma dapat 3 cawan boba je wei!',
    subText: 'Sebab tu kau wajib belajar invest sekarang untuk lawan inflasi!',
    bgTint: 'bg-[#FF4766]/25',
  },
};

const FEATURE_CARDS = [
  {
    title: '🤓 Takde Ayat Skema Nerd',
    description: 'Bahasa pasar je. Zero jargon, takde pening kepala.',
    popEmoji: '🎉',
    bgColor: 'bg-[#BFDBFE]',
    badgeText: 'Senang Hadam',
    rotation: 'md:-rotate-2',
    offset: 'md:translate-y-0',
  },
  {
    title: '🚀 Belajar Invest Dari Zero',
    description: 'Step-by-step untuk beginner. Dari noob terus reti gandakan duit!',
    popEmoji: '📈',
    bgColor: 'bg-[#A7F3D0]',
    badgeText: 'Mesra Noob',
    rotation: 'md:rotate-1',
    offset: 'md:translate-y-4',
  },
  {
    title: '💸 Reality Check (No Delulu)',
    description: 'Kira betul-betul ikut bajet student. Tolak siap-siap duit healing & Maggi.',
    popEmoji: '📉',
    bgColor: 'bg-[#FBCFE8]',
    badgeText: 'Realistik',
    rotation: 'md:-rotate-1',
    offset: 'md:translate-y-8',
  },
];

export const Tab1BaruNakUp: React.FC<Tab1Props> = ({ onNextTab }) => {
  const [year, setYear] = useState<number>(2019);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [popBursts, setPopBursts] = useState<PopBurst[]>([]);
  const [tiltState, setTiltState] = useState<Record<number, { x: number; y: number }>>({});

  const currentData = YEAR_DATA[year] || YEAR_DATA[2019];

  const handleCardClick = (idx: number, emoji: string) => {
    setActiveCard(idx);
    const burstId = Date.now() + Math.random();
    setPopBursts((prev) => [...prev, { id: burstId, cardIndex: idx, emoji }]);
    setTimeout(() => {
      setPopBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, 950);
    setTimeout(() => {
      setActiveCard((prev) => (prev === idx ? null : prev));
    }, 350);
  };

  const handleMouseMove = (idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    setTiltState((prev) => ({ ...prev, [idx]: { x, y } }));
  };

  const handleMouseLeave = (idx: number) => {
    setTiltState((prev) => ({ ...prev, [idx]: { x: 0, y: 0 } }));
  };

  return (
    <div className="space-y-12 pb-12">
      {/* 1. Header Section */}
      <section className="text-center max-w-4xl mx-auto pt-2 space-y-4">
        <div className="inline-block bg-[#FEF08A] border-3 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] rounded-2xl px-5 py-2 font-extrabold text-sm md:text-base -rotate-1">
          🧋 Time Machine Inflasi Student
        </div>
        <h1
          className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.08]"
          style={{ textWrap: 'balance' }}
        >
          Duit Sentiasa Susut Nilai.{' '}
          <span className="inline-block bg-[#10D989] px-3.5 py-1 rounded-2xl border-3 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] rotate-1 mt-1">
            Kau Sedar Tak?
          </span>
        </h1>
        <p className="text-base sm:text-lg font-bold text-slate-700 max-w-xl mx-auto">
          Tarik slider tahun kat bawah. Tengok macam mana RM50 kau makin lama makin ciput barang boleh beli!
        </p>
      </section>

      {/* 2. MASSIVE Interactive "Time Machine" Boba Visualization */}
      <section className="neo-card-lg bg-white rounded-3xl p-6 sm:p-8 md:p-10 max-w-5xl mx-auto relative overflow-hidden space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-4 border-[#0F172A]">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Kuasa Membeli RM50.00
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-1">
              Tahun:{' '}
              <span className="font-mono-num bg-[#C4B5FD] px-4 py-1 rounded-2xl border-3 border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A]">
                {year}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-[#FEF08A] border-3 border-[#0F172A] rounded-2xl px-5 py-3 shadow-[4px_4px_0px_0px_#0F172A]">
            <span className="text-4xl emoji-3d">🧋</span>
            <div>
              <div className="text-xs font-extrabold uppercase text-slate-700">Harga Secawan</div>
              <div className="font-mono-num text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                {currentData.pricePerCup}
              </div>
            </div>
          </div>
        </div>

        {/* EXTRA BIG 10 Boba Cups Visual Grid */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-display text-lg sm:text-xl font-extrabold text-[#0F172A]">
              RM50 Dapat Berapa Cawan Boba? 👇
            </span>
            <span className="font-mono-num text-xl sm:text-2xl font-extrabold bg-[#10D989] border-3 border-[#0F172A] rounded-2xl px-4 py-1 shadow-[3px_3px_0px_0px_#0F172A]">
              {currentData.bobaCount} / 10 Cawan!
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-5 p-5 sm:p-8 bg-[#F7F9F6] rounded-3xl border-4 border-[#0F172A] shadow-inner">
            {Array.from({ length: 10 }, (_, idx) => {
              const isAvailable = idx < currentData.bobaCount;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const targetYear = Math.min(2026, Math.max(2019, 2019 + (9 - idx)));
                    setYear(targetYear);
                  }}
                  title={`Cawan #${idx + 1}`}
                  className={`relative flex flex-col items-center justify-center min-h-[120px] sm:min-h-[145px] p-4 rounded-3xl border-3 border-[#0F172A] transition-all duration-300 select-none cursor-pointer ${
                    isAvailable
                      ? 'bg-[#FEF08A] shadow-[5px_5px_0px_0px_#0F172A] scale-100 hover:-translate-y-1.5 hover:bg-[#10D989]'
                      : 'bg-slate-200/70 border-dashed opacity-40 scale-90 rotate-6 shadow-none'
                  }`}
                >
                  <span
                    className={`text-5xl sm:text-6xl md:text-7xl transition-transform duration-300 ${
                      isAvailable ? 'emoji-3d scale-105' : 'grayscale scale-75'
                    }`}
                  >
                    {isAvailable ? '🧋' : '💥'}
                  </span>
                  <span className="font-mono-num text-xs sm:text-sm font-extrabold mt-2 px-2.5 py-0.5 rounded-lg bg-white border-2 border-[#0F172A] text-[#0F172A]">
                    {isAvailable ? `Cawan #${idx + 1}` : 'Lesap!'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Range Slider (2019 to 2026) */}
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center text-xs sm:text-base font-extrabold font-mono-num px-1">
            {[2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setYear(yr)}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl border-2 transition-all cursor-pointer ${
                  year === yr
                    ? 'bg-[#0F172A] text-[#10D989] border-[#0F172A] -translate-y-1 shadow-[3px_3px_0px_0px_#10D989]'
                    : 'bg-white text-[#0F172A] border-[#0F172A]/30 hover:border-[#0F172A]'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          <input
            type="range"
            min={2019}
            max={2026}
            step={1}
            value={year}
            aria-label="Pilih tahun dari 2019 hingga 2026"
            onChange={(e) => setYear(Number(e.target.value))}
            className="neo-slider"
          />

          <div className="flex justify-between text-xs sm:text-sm font-extrabold text-slate-700">
            <span>⬅️ 2019 (Murah Meriah)</span>
            <span>GESER SLIDER TAHUN ↔️</span>
            <span>2026 (Harga Kayangan) ➡️</span>
          </div>
        </div>

        {/* Dynamic Visual Text Indicator */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border-3 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] transition-colors duration-300 ${currentData.bgTint}`}
        >
          <p className="font-display text-xl sm:text-2xl font-extrabold text-[#0F172A]">
            {currentData.statusText}
          </p>
          <p className="text-sm sm:text-base font-bold text-slate-800 mt-1">
            💡 {currentData.subText}
          </p>
        </div>
      </section>

      {/* 3. Bridge Intro + "Kenapa Kena Layan InvestLAH?" (Interactive Features Section) */}
      <section className="max-w-5xl mx-auto pt-4 space-y-8">
        {/* Natural Bridge Card so it doesn't feel "tiba-tiba" */}
        <div className="neo-card bg-[#C4B5FD] rounded-3xl p-6 sm:p-8 text-center max-w-3xl mx-auto space-y-2">
          <span className="inline-block bg-white border-2 border-[#0F172A] px-3 py-1 rounded-xl text-xs font-extrabold shadow-[2px_2px_0px_0px_#0F172A]">
            🤔 HABIS TU, MACAM MANA NAK SELAMATKAN DUIT KITA?
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#0F172A] pt-1">
            Sebab Tu Kitorang Bina <span className="underline decoration-wavy decoration-[#0F172A]">InvestLAH!</span> ⚡
          </h2>
          <p className="text-sm sm:text-base font-bold text-slate-900 max-w-xl mx-auto">
            Kat dewan kuliah takde siapa ajar cara urus PTPTN & gandakan duit. Jadi apa yang best sangat pasal app ni? Cuba tekan 3 kad kat bawah 👇
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pb-6">
          {FEATURE_CARDS.map((card, idx) => {
            const tilt = tiltState[idx] || { x: 0, y: 0 };
            const isClicked = activeCard === idx;
            const cardBursts = popBursts.filter((b) => b.cardIndex === idx);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleCardClick(idx, card.popEmoji)}
                onMouseMove={(e) => handleMouseMove(idx, e)}
                onMouseLeave={() => handleMouseLeave(idx)}
                style={{
                  transform: isClicked
                    ? 'scale(0.94) translateY(4px)'
                    : `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                }}
                className={`neo-card-lg text-left p-6 sm:p-7 rounded-3xl relative cursor-pointer select-none transition-transform duration-200 ${card.bgColor} ${card.rotation} ${card.offset} hover:z-10`}
              >
                {cardBursts.map((burst) => (
                  <span
                    key={burst.id}
                    className=" -top-6 right-6 text-5xl pointer-events-none animate-float-up z-30 emoji-3d"
                  >
                    {burst.emoji}
                  </span>
                ))}

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider bg-white border-2 border-[#0F172A] px-3 py-1 rounded-xl shadow-[2px_2px_0px_0px_#0F172A]">
                    {card.badgeText}
                  </span>
                  <span className="text-3xl emoji-3d">{card.popEmoji}</span>
                </div>

                <h3 className="font-display text-2xl font-extrabold text-[#0F172A] mb-2 leading-snug">
                  {card.title}
                </h3>

                <p className="text-base font-bold text-slate-800 leading-relaxed">
                  {card.description}
                </p>

                <div className="mt-5 pt-3 border-t-2 border-[#0F172A]/20 flex items-center justify-between text-xs font-extrabold text-[#0F172A]">
                  <span>Tap kad untuk pop!</span>
                  <span className="bg-white border-2 border-[#0F172A] rounded-lg px-2.5 py-0.5">
                    Klik {card.popEmoji}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Call-to-Action (CTA) */}
      <section className="text-center pt-2">
        <button
          type="button"
          onClick={onNextTab}
          className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-xl sm:text-2xl md:text-3xl font-extrabold px-8 sm:px-12 py-5 sm:py-6 rounded-3xl inline-flex items-center gap-3 cursor-pointer"
        >
          <span>Okay, Ajar Aku Macam Mana Nak Start!</span>
          <span className="text-3xl emoji-3d">🚀</span>
        </button>
      </section>
    </div>
  );
};
