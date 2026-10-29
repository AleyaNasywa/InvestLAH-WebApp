import React, { useState } from 'react';

interface Tab2Props {
  onNextTab: () => void;
  onTriggerConfetti: () => void;
}

interface RiskQuestion {
  id: number;
  emoji: string;
  dimension: string;
  question: string;
  options: {
    label: string;
    level: 'low' | 'mid' | 'high';
    vibe: string;
  }[];
}

const QUESTIONS: RiskQuestion[] = [
  {
    id: 1,
    emoji: '⏳',
    dimension: 'Time Horizon (Tempoh Masa)',
    question: '1. Bila kau plan nak guna balik duit yang kau invest ni?',
    options: [
      { label: 'Kejap je, bawah 1 tahun dah nak pakai.', level: 'low', vibe: 'Short-term' },
      { label: 'Dalam 2 ke 4 tahun lepas konvo nanti.', level: 'mid', vibe: 'Mid-term' },
      { label: '5 tahun ke atas! Biar duit beranak lama.', level: 'high', vibe: 'Long Game' },
    ],
  },
  {
    id: 2,
    emoji: '📉',
    dimension: 'Loss Reaction (Reaksi Bila Jatuh)',
    question: '2. Buka app tengok portfolio drop -20%. Apa reaksi sponton kau?',
    options: [
      { label: 'Jual semua terus! Tak sanggup tengok lebur.', level: 'low', vibe: 'Cepat Cuak' },
      { label: 'Tutup app, pergi minum kopi & tunggu pulih.', level: 'mid', vibe: 'Chill Mode' },
      { label: 'Harga diskaun ni bro! Topup beli lagi.', level: 'high', vibe: 'Buy The Dip' },
    ],
  },
  {
    id: 3,
    emoji: '🛡️',
    dimension: 'Safety Cushion (Tabung Backup)',
    question: '3. Kalau tiba-tiba laptop rosak esok, ada duit kecemasan tak?',
    options: [
      { label: 'Zero wei. Memang tengah pokai hujung bulan.', level: 'low', vibe: 'No Backup' },
      { label: 'Ada la simpanan sikit cukup 1-2 bulan.', level: 'mid', vibe: 'Separuh Ready' },
      { label: 'Mantap, dah asing siap-siap 3-6 bulan backup!', level: 'high', vibe: 'Kebal' },
    ],
  },
  {
    id: 4,
    emoji: '💰',
    dimension: 'Cashflow Stability (Kestabilan Duit Masuk)',
    question: '4. Duit belanja bulanan kau sekarang jenis macam mana?',
    options: [
      { label: 'Bergantung 100% kat PTPTN / elaun semata-mata.', level: 'low', vibe: 'Ngam-ngam' },
      { label: 'Ada elaun tetap + kadang-kadang buat part-time.', level: 'mid', vibe: 'Stabil' },
      { label: 'Ada biasiswa + side hustle masyuk tiap bulan!', level: 'high', vibe: 'Extra Bag' },
    ],
  },
  {
    id: 5,
    emoji: '🧠',
    dimension: 'Investment Literacy (Tahap Ilmu)',
    question: '5. Jujur cakap, sejauh mana kau faham pasal pelaburan?',
    options: [
      { label: 'Baru kenal ASB & Tabung Haji je.', level: 'low', vibe: 'Freshie' },
      { label: 'Faham beza saham, ETF & unit trust sikit-sikit.', level: 'mid', vibe: 'Boleh Tahan' },
      { label: 'Dah biasa baca chart & diversify portfolio.', level: 'high', vibe: 'Celaru Pro' },
    ],
  },
  {
    id: 6,
    emoji: '🎯',
    dimension: 'Primary Goal (Fokus Utama)',
    question: '6. Apa benda paling penting bila kau park duit?',
    options: [
      { label: 'Janji modal tak hilang langsung walau RM1.', level: 'low', vibe: 'Modal Kebal' },
      { label: 'Nak balance antara dividen steady & growth.', level: 'mid', vibe: 'Seimbang' },
      { label: 'Nak untung paling tinggi! Turun naik belakang kira.', level: 'high', vibe: 'Max Stonks' },
    ],
  },
  {
    id: 7,
    emoji: '🔥',
    dimension: 'FOMO & Hype Tolerance',
    question: '7. Member hasut masuk saham / kripto tengah viral kat TikTok. Kau?',
    options: [
      { label: 'Auto pass! Takut kena scam atau terciduk.', level: 'low', vibe: 'Anti-Risiko' },
      { label: 'Kaji dulu, kalau legit baru test RM50.', level: 'mid', vibe: 'Smart Filter' },
      { label: 'Onz terus! Tak nak tertinggal kereta api.', level: 'high', vibe: 'High Thrill' },
    ],
  },
  {
    id: 8,
    emoji: '🔒',
    dimension: 'Liquidity Need (Kecairan Tunai)',
    question: '8. Okay tak kalau duit tu kena perap lama tak boleh usik?',
    options: [
      { label: 'Tak boleh! Kena boleh withdraw bila-bila masa.', level: 'low', vibe: 'Instant Cash' },
      { label: 'Separuh boleh perap, separuh kena standby.', level: 'mid', vibe: 'Fleksibel' },
      { label: 'Tak kisah langsung, memang duit lebihan.', level: 'high', vibe: 'Diamond Hands' },
    ],
  },
  {
    id: 9,
    emoji: '🎢',
    dimension: 'Risk-Return Tradeoff (Pilihan Pulangan)',
    question: '9. Pilih satu situasi pulangan setahun yang paling ngam:',
    options: [
      { label: 'Confirm dapat +5% setahun, zero risiko rugi.', level: 'low', vibe: 'Tidur Lena' },
      { label: 'Peluang untung +10%, tapi boleh turun -5%.', level: 'mid', vibe: 'Balanced' },
      { label: 'Peluang roket +25%, tapi boleh jatuh -15%.', level: 'high', vibe: 'Rollercoaster' },
    ],
  },
  {
    id: 10,
    emoji: '😴',
    dimension: 'Sleep-At-Night Test (Ujian Tidur Malam)',
    question: '10. Kalau market tengah merah seminggu, boleh fokus study tak?',
    options: [
      { label: 'Tak boleh wei! Stress fikir duit susut.', level: 'low', vibe: 'Overthinker' },
      { label: 'Rasa ralat sikit, tapi hidup jalan macam biasa.', level: 'mid', vibe: 'Tenang' },
      { label: 'Tidur berdengkur! Market merah = waktu borong.', level: 'high', vibe: 'Hati Kering' },
    ],
  },
];

export const Tab2RiskProfile: React.FC<Tab2Props> = ({ onNextTab, onTriggerConfetti }) => {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<number, 'low' | 'mid' | 'high'>>({});
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  const answeredCount = Object.keys(answers).length;
  const isCompleted = answeredCount === QUESTIONS.length;

  const handleSelectOption = (qId: number, level: 'low' | 'mid' | 'high') => {
    const nextAnswers = { ...answers, [qId]: level };
    setAnswers(nextAnswers);

    if (Object.keys(nextAnswers).length === QUESTIONS.length) {
      onTriggerConfetti();
    } else if (currentIdx < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentIdx((prev) => Math.min(QUESTIONS.length - 1, prev + 1));
      }, 160);
    }
  };

  // Determine Persona without displaying raw score numbers
  const getPersona = () => {
    const vals = Object.values(answers);
    const highCount = vals.filter((v) => v === 'high').length;
    const lowCount = vals.filter((v) => v === 'low').length;

    if (lowCount >= 5) {
      return {
        code: 'COZY GUARDIAN 🛡️',
        title: 'Si Tidur Lena (Low Risk · Safe Vibes)',
        emoji: '🛌🛡️🧋',
        bg: 'bg-[#BFDBFE]',
        accentBg: 'bg-[#93C5FD]',
        vibeQuote: '"Biar untung slow, janji modal aku tak lebur walau satu sen!"',
        desc: 'Kau utamakan ketenangan jiwa. Tak suka drama chart merah masa minggu exam.',
        starterPack: ['ASB / ASM', 'Tabung Haji', 'Versa Cash-i / FD Islamik'],
        allocation: [
          { label: 'Aset Kebal (ASB / TH / FD)', pct: 85, color: 'bg-[#10D989]' },
          { label: 'Unit Trust / Sukuk Stabil', pct: 15, color: 'bg-[#C4B5FD]' },
        ],
        vibeStats: [
          { name: 'Tahap Chill Tidur Malam', val: '99%' },
          { name: 'Ketahanan Hadap Chart Merah', val: '25%' },
          { name: 'Potensi Lawan Inflasi', val: 'Stabil (~5%)' },
        ],
      };
    }

    if (highCount >= 5) {
      return {
        code: 'MAIN CHARACTER ENERGY 🚀',
        title: 'Si Jantung Kental (High Risk · Aggressive)',
        emoji: '🚀🔥💎',
        bg: 'bg-[#FBCFE8]',
        accentBg: 'bg-[#FF4766]',
        vibeQuote: '"Market crash tu diskaun! Kita perap 5–10 tahun biar compounding meletup!"',
        desc: 'Jiwa kental & berani ambil risiko tinggi untuk kejar pulangan maksimum jangka panjang.',
        starterPack: ['ETF Global / S&P 500 Syariah', 'Saham Growth Bursa & US', 'Emas & Digital Assets (Lulus SC)'],
        allocation: [
          { label: 'Saham Growth & ETF Global', pct: 65, color: 'bg-[#FF4766]' },
          { label: 'Aset Alternatif / Emas', pct: 20, color: 'bg-[#FEF08A]' },
          { label: 'Cash Backup (ASB)', pct: 15, color: 'bg-[#10D989]' },
        ],
        vibeStats: [
          { name: 'Tahap Hati Kering', val: '98%' },
          { name: 'Selera Rollercoaster', val: '95%' },
          { name: 'Sasaran Pulangan Tahunan', val: 'Tinggi (10%+)' },
        ],
      };
    }

    return {
      code: 'SMART BALANCED CEO ⚖️',
      title: 'Si Bijak Bancuh (Moderate · Sweet Spot)',
      emoji: '⚖️🧪✨',
      bg: 'bg-[#A7F3D0]',
      accentBg: 'bg-[#10D989]',
      vibeQuote: '"Sebelah kaki pijak tanah kebal, sebelah kaki lagi kayuh roket!"',
      desc: 'Kau pandai imbang risiko! Ada tabung kebal untuk kecemasan, tapi tetap berani invest kat ETF & saham.',
      starterPack: ['50% ASB / Tabung Haji', '35% ETF & Saham Patuh Syariah', '15% Emas / Wahed Robo'],
      allocation: [
        { label: 'Aset Kebal (ASB / TH)', pct: 50, color: 'bg-[#10D989]' },
        { label: 'ETF & Saham Syariah', pct: 35, color: 'bg-[#93C5FD]' },
        { label: 'Emas / REITs', pct: 15, color: 'bg-[#FEF08A]' },
      ],
      vibeStats: [
        { name: 'Keseimbangan Hidup & Invest', val: '95%' },
        { name: 'Tahap Kawal Emosi', val: '85%' },
        { name: 'Sasaran Pulangan Tahunan', val: 'Padu (7%–9%)' },
      ],
    };
  };

  const persona = getPersona();
  const currentQ = QUESTIONS[currentIdx];

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* SCREEN 1: "ARE YOU READY?" INTRO SCREEN */}
      {!hasStarted && (
        <section className="neo-card-lg bg-white rounded-3xl p-8 sm:p-12 text-center space-y-8 animate-fadeIn">
          <div className="inline-block bg-[#C4B5FD] border-3 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] rounded-2xl px-5 py-2 font-extrabold text-sm -rotate-1">
            🎲 UJIAN PERSONALITI PELABUR · 10 SOALAN PANTAS
          </div>

          <div className="text-6xl sm:text-7xl emoji-3d animate-bounce">👀🔥🎯</div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#0F172A] leading-tight">
              Are You Ready?! <br />
              <span className="bg-[#10D989] px-4 py-1 rounded-2xl border-3 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] inline-block rotate-1 mt-2">
                Check Jiwa Pelabur Kau!
              </span>
            </h1>
            <p className="text-base sm:text-lg font-bold text-slate-700 pt-2">
              Jangan main ikut member je bila melabur. Jawab 10 soalan santai ni untuk tengok kau geng <span className="underline">Tidur Lena</span>, <span className="underline">Balanced CEO</span>, atau <span className="underline">Jantung Kental</span>!
            </p>
          </div>

          <button
            type="button"
            onClick={() => setHasStarted(true)}
            className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-2xl sm:text-3xl font-extrabold px-10 py-5 rounded-3xl cursor-pointer shadow-[0_0_25px_rgba(16,217,137,0.45)]"
          >
            Let's Go! Start Vibe Check 🚀
          </button>

          {/* Academic & Regulatory Reference Box */}
          <div className="bg-[#F7F9F6] border-3 border-[#0F172A] rounded-2xl p-4 sm:p-5 text-left max-w-2xl mx-auto shadow-[4px_4px_0px_0px_#0F172A] space-y-1.5">
            <div className="text-xs font-extrabold uppercase text-[#0F172A] flex items-center gap-2">
              <span>📚 Rujukan & Metodologi Ujian (References):</span>
            </div>
            <ul className="text-xs font-bold text-slate-700 space-y-1 list-disc list-inside">
              <li>
                Diadaptasi daripada <strong>Grable & Lytton (1999)</strong> <em>Financial Risk Tolerance Scale</em> (10 dimensi psikologi & kapasiti risiko).
              </li>
              <li>
                Selaras dengan garis panduan <strong>Suruhanjaya Sekuriti Malaysia (SC)</strong> <em>Investor Suitability Assessment</em> & rangka kerja <strong>AKPK</strong> untuk pelajar IPT.
              </li>
            </ul>
          </div>
        </section>
      )}

      {/* SCREEN 2: 10 QUESTIONS INTERACTIVE DECK */}
      {hasStarted && !isCompleted && (
        <div className="space-y-6 animate-fadeIn">
          {/* Progress Bar */}
          <div className="neo-card bg-white rounded-3xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold">
              <span>Progress Vibe Check: {answeredCount} / 10 Dijawab</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const demo: Record<number, 'low' | 'mid' | 'high'> = {
                      1: 'mid',
                      2: 'mid',
                      3: 'mid',
                      4: 'mid',
                      5: 'mid',
                      6: 'high',
                      7: 'mid',
                      8: 'mid',
                      9: 'mid',
                      10: 'high',
                    };
                    setAnswers(demo);
                    onTriggerConfetti();
                  }}
                  className="neo-btn bg-[#FEF08A] px-3 py-1 rounded-xl text-xs font-extrabold cursor-pointer"
                >
                  ⚡ Demo Siap Terus
                </button>
              </div>
            </div>
            <div className="w-full h-4 bg-[#F7F9F6] rounded-full border-3 border-[#0F172A] overflow-hidden">
              <div
                className="h-full bg-[#10D989] transition-all duration-300"
                style={{ width: `${(answeredCount / 10) * 100}%` }}
              />
            </div>

            {/* Number Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {QUESTIONS.map((q, idx) => {
                const isAns = answers[q.id] !== undefined;
                const isCur = idx === currentIdx;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-9 h-9 rounded-xl font-mono-num font-extrabold text-xs border-2 border-[#0F172A] transition-all cursor-pointer ${
                      isCur
                        ? 'bg-[#0F172A] text-[#10D989] -translate-y-0.5'
                        : isAns
                        ? 'bg-[#10D989] text-[#0F172A]'
                        : 'bg-[#F7F9F6] text-slate-700'
                    }`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Question Card */}
          <section className="neo-card-lg bg-white rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between gap-2">
              <span className="bg-[#DDD6FE] border-2 border-[#0F172A] px-3.5 py-1 rounded-xl text-xs font-extrabold shadow-[2px_2px_0px_0px_#0F172A]">
                Dimensi #{currentQ.id}: {currentQ.dimension}
              </span>
              <span className="text-4xl emoji-3d">{currentQ.emoji}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
              {currentQ.question}
            </h2>

            <div className="grid grid-cols-1 gap-3.5">
              {currentQ.options.map((opt) => {
                const selected = answers[currentQ.id] === opt.level;
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, opt.level)}
                    className={`neo-btn text-left p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-4 cursor-pointer ${
                      selected
                        ? 'bg-[#10D989] text-[#0F172A]'
                        : 'bg-[#F7F9F6] hover:bg-[#FEF08A] text-[#0F172A]'
                    }`}
                  >
                    <span className="font-bold text-base sm:text-lg">{opt.label}</span>
                    <span className="text-xs font-extrabold bg-white border-2 border-[#0F172A] px-3 py-1 rounded-xl shrink-0">
                      {opt.vibe}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t-3 border-[#0F172A]">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                className="neo-btn bg-white disabled:opacity-40 px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm cursor-pointer"
              >
                ⬅️ Soalan Lepas
              </button>
              <span className="text-[11px] font-bold text-slate-500">
                Rujukan: SC Malaysia & Grable-Lytton Scale
              </span>
              <button
                type="button"
                disabled={currentIdx === QUESTIONS.length - 1}
                onClick={() => setCurrentIdx((p) => Math.min(QUESTIONS.length - 1, p + 1))}
                className="neo-btn bg-[#BFDBFE] disabled:opacity-40 px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm cursor-pointer"
              >
                Seterusnya ➡️
              </button>
            </div>
          </section>
        </div>
      )}

      {/* SCREEN 3: MASSIVE GEN Z-CODED RESULT SCREEN (NO SCORE NUMBER!) */}
      {hasStarted && isCompleted && (
        <section className={`neo-card-lg rounded-3xl p-6 sm:p-10 ${persona.bg} space-y-8 animate-fadeIn`}>
          {/* Giant Persona Reveal Header */}
          <div className="bg-white border-4 border-[#0F172A] rounded-3xl p-6 sm:p-8 text-center shadow-[8px_8px_0px_0px_#0F172A] space-y-4">
            <div className="inline-block bg-[#FEF08A] border-2 border-[#0F172A] px-4 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-[2px_2px_0px_0px_#0F172A]">
              ✨ RISK VIBE UNLOCKED · {persona.code}
            </div>

            <div className="text-6xl sm:text-7xl emoji-3d py-1">{persona.emoji}</div>

            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0F172A] leading-tight">
              {persona.title}
            </h2>

            <p className="font-display text-lg sm:text-xl font-extrabold text-emerald-800 bg-[#A7F3D0]/60 border-2 border-[#0F172A] rounded-2xl px-4 py-2.5 max-w-xl mx-auto">
              {persona.vibeQuote}
            </p>

            <p className="text-sm sm:text-base font-bold text-slate-700 max-w-xl mx-auto">
              {persona.desc}
            </p>
          </div>

          {/* Gen Z Coded Visual Stats & Starter Pack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Visual Portfolio Recipe Breakdown */}
            <div className="bg-white border-3 border-[#0F172A] rounded-3xl p-6 shadow-[5px_5px_0px_0px_#0F172A] space-y-4">
              <h3 className="font-display text-xl font-extrabold text-[#0F172A]">
                🧪 Resepi Portfolio Paling Ngam:
              </h3>
              <div className="space-y-3">
                {persona.allocation.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs sm:text-sm font-extrabold">
                      <span>{item.label}</span>
                      <span className="font-mono-num">{item.pct}%</span>
                    </div>
                    <div className="w-full h-5 bg-slate-100 rounded-xl border-2 border-[#0F172A] overflow-hidden">
                      <div
                        className={`h-full ${item.color}`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Starter Pack & Vibe Aura */}
            <div className="bg-white border-3 border-[#0F172A] rounded-3xl p-6 shadow-[5px_5px_0px_0px_#0F172A] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-display text-xl font-extrabold text-[#0F172A]">
                  🎒 Starter Pack Untuk Kau:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {persona.starterPack.map((pack) => (
                    <span
                      key={pack}
                      className="bg-[#FEF08A] border-2 border-[#0F172A] px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-[2px_2px_0px_0px_#0F172A]"
                    >
                      ✓ {pack}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t-2 border-[#0F172A]/20">
                {persona.vibeStats.map((st) => (
                  <div key={st.name} className="flex justify-between text-xs sm:text-sm font-bold">
                    <span className="text-slate-700">{st.name}:</span>
                    <span className="font-mono-num font-extrabold text-[#0F172A]">{st.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reference Footer & Action Buttons */}
          <div className="bg-white/80 border-2 border-[#0F172A] rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-700 text-center">
            📚 Rujukan Penilaian: Grable & Lytton (1999) Risk Tolerance Scale & Garis Panduan Kesesuaian Pelabur SC Malaysia.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setCurrentIdx(0);
                setHasStarted(false);
              }}
              className="neo-btn bg-white px-6 py-4 rounded-2xl font-extrabold text-sm cursor-pointer"
            >
              🔄 Ambil Semula Test
            </button>

            <button
              type="button"
              onClick={onNextTab}
              className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-xl sm:text-2xl font-extrabold px-8 py-5 rounded-3xl cursor-pointer w-full sm:w-auto text-center"
            >
              Next: Pokai Tapi Bajet 💸 ➡️
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
