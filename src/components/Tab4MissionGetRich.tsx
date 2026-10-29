import React, { useState } from 'react';

interface Tab4Props {
  onNextTab: () => void;
  onTriggerConfetti: () => void;
}

interface GoalTile {
  id: string;
  emoji: string;
  title: string;
  tagline: string;
  defaultAmount: number;
  bg: string;
}

interface SavedGoal {
  id: string;
  emoji: string;
  title: string;
  targetAmount: number;
  years: number;
  targetYear: number;
  monthlyDeposit: number;
  rateLabel: string;
  ratePct: number;
  progressPct: number;
}

const GOAL_TILES: GoalTile[] = [
  {
    id: 'travel',
    emoji: '✈️',
    title: 'Healing / Travel',
    tagline: 'Trip Jepun, Korea atau backpack dengan geng',
    defaultAmount: 5000,
    bg: 'bg-[#C4B5FD]',
  },
  {
    id: 'big-purchase',
    emoji: '🚗',
    title: 'Big Purchase (Car, House)',
    tagline: 'Deposit kereta, motor atau rumah pertama',
    defaultAmount: 20000,
    bg: 'bg-[#BFDBFE]',
  },
  {
    id: 'tech',
    emoji: '💻',
    title: 'Tech Gear / Gadgets',
    tagline: 'MacBook, iPad, PC Setup atau Kamera',
    defaultAmount: 5000,
    bg: 'bg-[#FEF08A]',
  },
  {
    id: 'wedding',
    emoji: '💍',
    title: 'Wedding (Dana Kahwin)',
    tagline: 'Halalkan partner tanpa personal loan',
    defaultAmount: 25000,
    bg: 'bg-[#FBCFE8]',
  },
  {
    id: 'education',
    emoji: '🎓',
    title: 'Education / Course',
    tagline: 'Sambung Master, sijil pro atau bayar PTPTN',
    defaultAmount: 10000,
    bg: 'bg-[#A7F3D0]',
  },
  {
    id: 'emergency',
    emoji: '🛡️',
    title: 'Emergency Fund',
    tagline: 'Tabung backup kebal lepas konvo nanti',
    defaultAmount: 10000,
    bg: 'bg-[#BFDBFE]',
  },
  {
    id: 'custom',
    emoji: '✨',
    title: 'Custom Goal Sendiri',
    tagline: 'Taip sendiri apa-apa impian kau nak capai!',
    defaultAmount: 10000,
    bg: 'bg-[#FEF08A]',
  },
];

const RISK_MODES = [
  { id: 'safe', label: 'Safe Vibes (5%)', rate: 0.05, color: '#93C5FD', bg: 'bg-[#BFDBFE]' },
  { id: 'balanced', label: 'Balanced (8.5%)', rate: 0.085, color: '#10D989', bg: 'bg-[#A7F3D0]' },
  { id: 'aggressive', label: 'Aggressive Gila (12.5%)', rate: 0.125, color: '#FF4766', bg: 'bg-[#FBCFE8]' },
] as const;

export const Tab4MissionGetRich: React.FC<Tab4Props> = ({ onNextTab, onTriggerConfetti }) => {
  const [subtab, setSubtab] = useState<'target' | 'blueprint' | 'saved'>('target');

  // Target Wizard State
  const [wizardStage, setWizardStage] = useState<'goal' | 'amount' | 'deadline'>('goal');
  const [selectedGoal, setSelectedGoal] = useState<GoalTile>(GOAL_TILES[0]);
  const [customGoalName, setCustomGoalName] = useState<string>('Buka Bisnes Cafe Sendiri');
  const [targetAmountInput, setTargetAmountInput] = useState<string>('10000');
  const [yearsInput, setYearsInput] = useState<string>('4');

  // Blueprint State
  const [riskIdx, setRiskIdx] = useState<number>(1);
  const [chartBounceKey, setChartBounceKey] = useState<number>(1);

  // Saved Goals State
  const [savedGoals, setSavedGoals] = useState<SavedGoal[]>([
    {
      id: 'seed-1',
      emoji: '💻',
      title: 'Tech Gear / Gadgets',
      targetAmount: 6000,
      years: 2,
      targetYear: 2028,
      monthlyDeposit: 230,
      rateLabel: 'Balanced (8.5%)',
      ratePct: 8.5,
      progressPct: 35,
    },
    {
      id: 'seed-2',
      emoji: '🛡️',
      title: 'Emergency Fund',
      targetAmount: 10000,
      years: 3,
      targetYear: 2029,
      monthlyDeposit: 258,
      rateLabel: 'Safe Vibes (5%)',
      ratePct: 5,
      progressPct: 20,
    },
  ]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const parsedAmount = Math.max(1, Number(targetAmountInput) || 0);
  const parsedYears = Math.max(1, Number(yearsInput) || 1);
  const displayGoalTitle =
    selectedGoal.id === 'custom'
      ? customGoalName.trim() || 'Custom Goal'
      : selectedGoal.title;

  const currentRisk = RISK_MODES[riskIdx];
  const rMonthly = currentRisk.rate / 12;
  const nMonths = parsedYears * 12;

  const monthlyDeposit =
    rMonthly > 0
      ? Math.max(1, Math.round((parsedAmount * rMonthly) / (Math.pow(1 + rMonthly, nMonths) - 1)))
      : Math.round(parsedAmount / nMonths);

  const totalPrincipal = monthlyDeposit * nMonths;
  const totalProfit = Math.max(0, parsedAmount - totalPrincipal);

  const generateCurvePoints = () => {
    const steps = 10;
    const pts: { x: number; y: number; val: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const m = (i / steps) * nMonths;
      const fv =
        m === 0
          ? 0
          : rMonthly > 0
          ? monthlyDeposit * ((Math.pow(1 + rMonthly, m) - 1) / rMonthly)
          : monthlyDeposit * m;
      const x = 40 + (i / steps) * 520;
      const ratio = parsedAmount > 0 ? Math.min(1, fv / parsedAmount) : 0;
      const curvePower = riskIdx === 0 ? 0.95 : riskIdx === 1 ? 1.15 : 1.4;
      const curvedRatio = Math.pow(ratio, curvePower);
      const y = 210 - curvedRatio * 165;
      pts.push({ x, y, val: Math.round(fv) });
    }
    return pts;
  };

  const curvePts = generateCurvePoints();
  const polylineStr = curvePts.map((p) => `${p.x},${p.y}`).join(' ');
  const areaStr = `40,210 ${polylineStr} 560,210`;

  const handleSaveBlueprint = () => {
    const newGoal: SavedGoal = {
      id: `goal-${Date.now()}`,
      emoji: selectedGoal.emoji,
      title: displayGoalTitle,
      targetAmount: parsedAmount,
      years: parsedYears,
      targetYear: 2026 + parsedYears,
      monthlyDeposit,
      rateLabel: currentRisk.label,
      ratePct: currentRisk.rate * 100,
      progressPct: 15,
    };
    setSavedGoals((prev) => [newGoal, ...prev]);
    onTriggerConfetti();
    setSubtab('saved');
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Sticky Subtab Navigation (Clean labels without "Subtab 1/2/3") */}
      <div className="sticky top-4 z-30 flex justify-center">
        <div className="neo-card bg-white rounded-full p-1.5 flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full">
          {[
            { id: 'target', label: 'Target 🎯' },
            { id: 'blueprint', label: 'Blueprint 📈' },
            { id: 'saved', label: `Saved Goals 💾 (${savedGoals.length})` },
          ].map((t) => {
            const active = subtab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSubtab(t.id as 'target' | 'blueprint' | 'saved')}
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

      {/* TARGET WIZARD */}
      {subtab === 'target' && (
        <section className="neo-card-lg bg-white rounded-3xl p-6 sm:p-10 space-y-8">
          {/* Quick Stage Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-[#0F172A] pb-4">
            <div className="flex items-center gap-2">
              {[
                { id: 'goal', label: '🎯 Pilih Goal' },
                { id: 'amount', label: '💰 Bajet' },
                { id: 'deadline', label: '⏳ Tahun' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setWizardStage(s.id as 'goal' | 'amount' | 'deadline')}
                  className={`px-4 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm border-2 border-[#0F172A] cursor-pointer transition-all ${
                    wizardStage === s.id
                      ? 'bg-[#0F172A] text-[#10D989] -translate-y-0.5'
                      : 'bg-[#F7F9F6] text-[#0F172A]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <span className="text-xs font-extrabold bg-[#FEF08A] border-2 border-[#0F172A] px-3.5 py-1 rounded-xl">
              {selectedGoal.emoji} {displayGoalTitle}
            </span>
          </div>

          {/* STAGE 1: PICK GOAL (7 GOALS INCLUDING CUSTOM GOAL) */}
          {wizardStage === 'goal' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-2">
                <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0F172A]">
                  Apa end-goal kau actually? 🎯
                </h1>
                <p className="text-base font-bold text-slate-700">
                  Pilih satu target kat bawah atau tulis sendiri Custom Goal kau!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {GOAL_TILES.map((tile) => {
                  const isLocked = selectedGoal.id === tile.id;
                  return (
                    <button
                      key={tile.id}
                      type="button"
                      onClick={() => {
                        setSelectedGoal(tile);
                        setTargetAmountInput(String(tile.defaultAmount));
                      }}
                      className={`neo-card text-left p-5 rounded-3xl transition-all duration-200 cursor-pointer relative ${
                        tile.bg
                      } ${
                        isLocked
                          ? '-translate-y-2 ring-4 ring-[#10D989] shadow-[8px_8px_0px_0px_#0F172A]'
                          : 'hover:-translate-y-1'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-4xl emoji-3d">{tile.emoji}</span>
                        {isLocked && (
                          <span className="bg-[#10D989] border-2 border-[#0F172A] px-2.5 py-0.5 rounded-xl text-xs font-extrabold shadow-[2px_2px_0px_0px_#0F172A]">
                            LOCKED 🔒
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-xl font-extrabold text-[#0F172A]">
                        {tile.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-800 mt-1">{tile.tagline}</p>
                    </button>
                  );
                })}
              </div>

              {/* Custom Goal Text Input when Custom Goal is chosen */}
              {selectedGoal.id === 'custom' && (
                <div className="bg-[#FEF08A] border-3 border-[#0F172A] rounded-3xl p-5 shadow-[5px_5px_0px_0px_#0F172A] max-w-xl mx-auto space-y-2 animate-fadeIn">
                  <label className="block font-display text-base font-extrabold text-[#0F172A]">
                    ✍️ Tulis Nama Custom Goal Kau:
                  </label>
                  <input
                    type="text"
                    value={customGoalName}
                    onChange={(e) => setCustomGoalName(e.target.value)}
                    placeholder="Contoh: Beli Kamera Sony / Modal Kahwin / Umrah..."
                    className="w-full bg-white border-3 border-[#0F172A] rounded-2xl px-4 py-3 font-display text-lg font-extrabold text-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] focus:outline-none"
                  />
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setWizardStage('amount')}
                  className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-xl font-extrabold px-10 py-4 rounded-2xl cursor-pointer"
                >
                  Next: Masukkan Jumlah Target ({selectedGoal.emoji} {displayGoalTitle}) ➡️
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: AMOUNT (ANY AMOUNT, NO MIN/MAX RESTRICTION + QUICK BUTTONS) */}
          {wizardStage === 'amount' && (
            <div className="space-y-8 text-center max-w-2xl mx-auto animate-fadeIn">
              <div className="space-y-2">
                <span className="text-5xl emoji-3d">{selectedGoal.emoji}</span>
                <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0F172A]">
                  Berapa budget kau perlukan tbh? 💰
                </h2>
                <p className="text-base font-bold text-slate-700">
                  Taip je berapa-berapa jumlah kau nak (tiada had min/max), atau tekan butang pantas kat bawah!
                </p>
              </div>

              <div className="bg-[#FEF08A] border-4 border-[#0F172A] rounded-3xl p-6 shadow-[6px_6px_0px_0px_#0F172A] space-y-4">
                <label className="block text-xs font-extrabold uppercase text-slate-700">
                  TAIP TARGET AMOUNT (RM) — BEBAS LETAK BERAPA PUN
                </label>
                <input
                  type="number"
                  value={targetAmountInput}
                  placeholder="Contoh: 12500"
                  onChange={(e) => setTargetAmountInput(e.target.value)}
                  className="w-full text-center bg-white border-3 border-[#0F172A] rounded-2xl py-4 px-4 font-mono-num text-4xl sm:text-5xl font-extrabold text-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] focus:outline-none"
                />

                {/* Quick-Select Buttons: RM5K, RM10K, RM20K, RM30K, RM50K */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  {[
                    { label: 'RM5K', val: '5000', bg: 'bg-[#A7F3D0]' },
                    { label: 'RM10K', val: '10000', bg: 'bg-[#BFDBFE]' },
                    { label: 'RM20K', val: '20000', bg: 'bg-[#C4B5FD]' },
                    { label: 'RM30K', val: '30000', bg: 'bg-[#FBCFE8]' },
                    { label: 'RM50K', val: '50000', bg: 'bg-white' },
                  ].map((q) => (
                    <button
                      key={q.label}
                      type="button"
                      onClick={() => setTargetAmountInput(q.val)}
                      className={`neo-btn ${q.bg} px-5 py-2.5 rounded-2xl font-mono-num text-base font-extrabold text-[#0F172A] cursor-pointer`}
                    >
                      ⚡ {q.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setWizardStage('goal')}
                  className="neo-btn bg-white px-6 py-3.5 rounded-2xl font-extrabold text-sm cursor-pointer"
                >
                  ⬅️ Tukar Goal
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStage('deadline')}
                  className="neo-btn bg-[#10D989] hover:bg-[#34D399] px-8 py-4 rounded-2xl font-display text-xl font-extrabold cursor-pointer"
                >
                  Next: Set Tahun Target ⏳ ➡️
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: DEADLINE (DIRECT YEAR INPUT + SLIDER) */}
          {wizardStage === 'deadline' && (
            <div className="space-y-8 text-center max-w-2xl mx-auto animate-fadeIn">
              <div className="space-y-2">
                <span className="text-5xl emoji-3d">⏳</span>
                <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0F172A]">
                  Bila kau nak hit target ni?
                </h2>
                <p className="text-base font-bold text-slate-700">
                  Taip terus berapa tahun kau nak atau tarik slider kat bawah!
                </p>
              </div>

              <div className="bg-[#C4B5FD] border-4 border-[#0F172A] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#0F172A] space-y-6">
                <div className="max-w-xs mx-auto space-y-2">
                  <label className="block text-xs font-extrabold uppercase text-[#0F172A]">
                    Taip Tempoh (Tahun):
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={yearsInput}
                    onChange={(e) => setYearsInput(e.target.value)}
                    className="w-full text-center bg-white border-3 border-[#0F172A] rounded-2xl py-3 px-4 font-mono-num text-4xl font-extrabold text-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] focus:outline-none"
                  />
                  <span className="block text-xs font-extrabold text-slate-800 pt-1">
                    Target Capai Pada Tahun {2026 + parsedYears} ({parsedYears * 12} Bulan)
                  </span>
                </div>

                <div className="space-y-3">
                  <input
                    type="range"
                    min={1}
                    max={15}
                    step={1}
                    value={Math.min(15, parsedYears)}
                    onChange={(e) => setYearsInput(e.target.value)}
                    className="neo-slider"
                  />
                  <div className="flex justify-between font-mono-num text-xs font-extrabold text-[#0F172A] px-1">
                    <span>1 Tahun</span>
                    <span>5 Tahun</span>
                    <span>10 Tahun</span>
                    <span>15 Tahun</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setWizardStage('amount')}
                  className="neo-btn bg-white px-6 py-3.5 rounded-2xl font-extrabold text-sm cursor-pointer"
                >
                  ⬅️ Ubah Budget
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubtab('blueprint');
                    setChartBounceKey(Date.now());
                  }}
                  className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-xl sm:text-2xl font-extrabold px-8 py-5 rounded-3xl cursor-pointer shadow-[0_0_25px_rgba(16,217,137,0.5)] w-full sm:w-auto"
                >
                  Generate Blueprint Sekarang! 🚀
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* BLUEPRINT (THE COMPOUND MAGIC) */}
      {subtab === 'blueprint' && (
        <section className="space-y-8 animate-fadeIn">
          <div className="neo-card-lg bg-white rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase bg-[#FEF08A] border-2 border-[#0F172A] px-3 py-1 rounded-xl">
                  {selectedGoal.emoji} {displayGoalTitle} · Target RM {parsedAmount.toLocaleString()} ({parsedYears} Tahun)
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-2">
                  Pilih Enjin Compounding Kau ⚙️
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-[#F7F9F6] border-3 border-[#0F172A] p-2 rounded-2xl shadow-[4px_4px_0px_0px_#0F172A]">
                {RISK_MODES.map((mode, idx) => {
                  const active = riskIdx === idx;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => {
                        setRiskIdx(idx);
                        setChartBounceKey(Date.now());
                      }}
                      className={`px-4 py-2.5 rounded-xl font-display font-extrabold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
                        active
                          ? `${mode.bg} text-[#0F172A] border-2 border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] -translate-y-0.5`
                          : 'text-slate-700 hover:bg-white'
                      }`}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* The Big Reveal */}
            <div className="bg-[#0F172A] text-white border-4 border-[#0F172A] rounded-3xl p-6 sm:p-8 text-center shadow-[6px_6px_0px_0px_#10D989] space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#10D989]">
                ✨ THE BIG REVEAL · MONTHLY COMMITMENT
              </span>
              <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                Kau kena park{' '}
                <span className="font-mono-num text-[#10D989] underline decoration-wavy decoration-2 underline-offset-8">
                  RM {monthlyDeposit.toLocaleString()}
                </span>{' '}
                every month.
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-300 pt-1">
                Modal Sendiri: RM {totalPrincipal.toLocaleString()} · Duit Free Compounding: +RM {totalProfit.toLocaleString()} ({currentRisk.label})
              </p>
            </div>

            {/* Gamified Neo-Brutalist Area Chart with Rocket Curve Animation */}
            <div
              key={chartBounceKey}
              className="bg-[#F7F9F6] border-3 border-[#0F172A] rounded-3xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_#0F172A] space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span>📈 UNJURAN COMPOUNDING ({parsedYears} TAHUN)</span>
                <span className="font-mono-num bg-white border-2 border-[#0F172A] px-3 py-1 rounded-lg">
                  Target: RM {parsedAmount.toLocaleString()} 🚀
                </span>
              </div>

              <div className="w-full overflow-hidden">
                <svg
                  viewBox="0 0 600 240"
                  className="w-full h-56 sm:h-64 overflow-visible"
                  role="img"
                  aria-label="Graf unjuran pelaburan"
                >
                  {[50, 100, 150, 210].map((yVal, i) => (
                    <line
                      key={i}
                      x1="40"
                      y1={yVal}
                      x2="560"
                      y2={yVal}
                      stroke="#CBD5E1"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                    />
                  ))}

                  <polygon points={areaStr} fill={currentRisk.color} fillOpacity="0.35" />

                  <polyline
                    fill="none"
                    stroke="#0F172A"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={polylineStr}
                  />

                  {curvePts.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r={idx === curvePts.length - 1 ? 8 : 4}
                      fill={idx === curvePts.length - 1 ? '#10D989' : '#FFFFFF'}
                      stroke="#0F172A"
                      strokeWidth="3"
                    />
                  ))}

                  <g
                    transform={`translate(${curvePts[curvePts.length - 1].x - 16}, ${
                      curvePts[curvePts.length - 1].y - 22
                    })`}
                  >
                    <text fontSize="28" className="select-none">
                      🚀
                    </text>
                  </g>

                  <text x="40" y="232" fontSize="11" fontWeight="800" fill="#0F172A">
                    Tahun 0 (RM 0)
                  </text>
                  <text x="260" y="232" fontSize="11" fontWeight="800" fill="#0F172A">
                    Tahun {(parsedYears / 2).toFixed(1)}
                  </text>
                  <text x="455" y="232" fontSize="11" fontWeight="800" fill="#0F172A">
                    Tahun {parsedYears} (RM {parsedAmount.toLocaleString()})
                  </text>
                </svg>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => setSubtab('target')}
                className="neo-btn bg-white px-6 py-4 rounded-2xl font-extrabold text-sm cursor-pointer"
              >
                ⬅️ Edit Target Semula
              </button>
              <button
                type="button"
                onClick={handleSaveBlueprint}
                className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-xl sm:text-2xl font-extrabold px-8 py-5 rounded-3xl cursor-pointer w-full sm:w-auto"
              >
                Lock In & Save Blueprint Ni 💾
              </button>
            </div>
          </div>
        </section>
      )}

      {/* SAVED GOALS (HISTORY) */}
      {subtab === 'saved' && (
        <section className="space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
                Koleksi Blueprint Impian Kau 💾
              </h2>
              <p className="text-base font-bold text-slate-700">
                Semua goal yang kau dah lock in ada kat sini. Stay disciplined bro!
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setWizardStage('goal');
                setSubtab('target');
              }}
              className="neo-btn bg-[#FEF08A] px-5 py-3 rounded-2xl font-extrabold text-sm cursor-pointer shrink-0"
            >
              ➕ Tambah Goal Baru
            </button>
          </div>

          {savedGoals.length === 0 ? (
            <div className="neo-card bg-white rounded-3xl p-10 text-center space-y-4">
              <span className="text-5xl emoji-3d">🫙</span>
              <h3 className="font-display text-2xl font-extrabold">
                Belum ada blueprint tersimpan lagi wei!
              </h3>
              <button
                type="button"
                onClick={() => setSubtab('target')}
                className="neo-btn bg-[#10D989] px-6 py-3 rounded-2xl font-extrabold text-sm cursor-pointer"
              >
                Buat Blueprint Pertama Sekarang 🎯
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedGoals.map((goal) => {
                const isConfirming = confirmDeleteId === goal.id;
                return (
                  <div
                    key={goal.id}
                    className={`neo-card-lg bg-white rounded-3xl p-6 space-y-4 transition-all ${
                      isConfirming ? 'animate-neo-shake bg-[#FBCFE8]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl emoji-3d bg-[#F7F9F6] border-2 border-[#0F172A] p-2.5 rounded-2xl shadow-[3px_3px_0px_0px_#0F172A]">
                          {goal.emoji}
                        </span>
                        <div>
                          <h3 className="font-display text-2xl font-extrabold text-[#0F172A]">
                            {goal.title}
                          </h3>
                          <span className="text-xs font-extrabold text-slate-600">
                            Target Tahun {goal.targetYear} ({goal.years} Tahun) · {goal.rateLabel}
                          </span>
                        </div>
                      </div>

                      {!isConfirming ? (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(goal.id)}
                          title="Padam Goal"
                          className="neo-btn bg-[#FF4766] text-white px-3.5 py-2 rounded-xl font-extrabold text-sm cursor-pointer shrink-0"
                        >
                          🗑️
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSavedGoals((prev) => prev.filter((g) => g.id !== goal.id));
                              setConfirmDeleteId(null);
                            }}
                            className="neo-btn bg-[#FF4766] text-white px-3 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer"
                          >
                            Ya, Delete!
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="neo-btn bg-white text-[#0F172A] px-3 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      )}
                    </div>

                    {isConfirming && (
                      <div className="bg-[#FF4766] text-white border-2 border-[#0F172A] rounded-xl px-3.5 py-2 text-xs font-extrabold">
                        ⚠️ Kau sure nak delete ni? Penat kira tadi bro!
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 bg-[#F7F9F6] border-2 border-[#0F172A] rounded-2xl p-3.5">
                      <div>
                        <div className="text-[11px] font-extrabold text-slate-600 uppercase">
                          Target Amount
                        </div>
                        <div className="font-mono-num text-xl font-extrabold text-[#0F172A]">
                          RM {goal.targetAmount.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-extrabold text-slate-600 uppercase">
                          Komitmen Bulanan
                        </div>
                        <div className="font-mono-num text-xl font-extrabold text-emerald-700">
                          RM {goal.monthlyDeposit.toLocaleString()}/bln
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-extrabold">
                        <span>Status Tabungan Semasa</span>
                        <span className="font-mono-num">{goal.progressPct}% Locked</span>
                      </div>
                      <div className="w-full h-3.5 bg-slate-100 rounded-full border-2 border-[#0F172A] overflow-hidden">
                        <div
                          className="h-full bg-[#10D989]"
                          style={{ width: `${goal.progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={onNextTab}
              className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-xl sm:text-2xl font-extrabold px-8 py-5 rounded-3xl cursor-pointer"
            >
              Next: Time Machine Simulator 🚀 ➡️
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
