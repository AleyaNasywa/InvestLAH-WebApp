import React, { useState } from 'react';

interface Tab5Props {
  onNextTab: () => void;
  onTriggerConfetti: () => void;
}

type ScenarioId = 'normal' | 'crash' | 'bull' | 'inflation';

interface ScenarioConfig {
  id: ScenarioId;
  title: string;
  emoji: string;
  badge: string;
  desc: string;
  bg: string;
  yearlyMultipliers: number[]; // 10 years of market shock multipliers for risky assets
}

const SCENARIOS: ScenarioConfig[] = [
  {
    id: 'normal',
    title: 'Steady Compounding 🌱',
    emoji: '🌱',
    badge: 'Normal Market',
    desc: 'Market naik turun biasa. Sesuai tengok kuasa DCA bulanan secara konsisten.',
    bg: 'bg-[#A7F3D0]',
    yearlyMultipliers: [1.08, 1.06, 1.11, 0.97, 1.12, 1.09, 1.07, 1.1, 1.05, 1.11],
  },
  {
    id: 'crash',
    title: 'Black Swan Crash 📉',
    emoji: '📉',
    badge: 'Crisis Stress Test',
    desc: 'Tahun ke-3 market jatuh teruk macam 2020, tapi rebound balik kalau kau tak panic sell!',
    bg: 'bg-[#FBCFE8]',
    yearlyMultipliers: [1.07, 1.05, 0.76, 1.24, 1.16, 1.09, 1.08, 1.11, 1.06, 1.1],
  },
  {
    id: 'bull',
    title: 'Bull Run Stonks 🚀',
    emoji: '🚀',
    badge: 'High Growth',
    desc: 'Ekonomi & sektor tech tengah rancak! Portfolio agresif memang senyum lebar.',
    bg: 'bg-[#FEF08A]',
    yearlyMultipliers: [1.14, 1.16, 1.12, 1.09, 1.18, 1.11, 1.15, 1.08, 1.14, 1.13],
  },
  {
    id: 'inflation',
    title: 'Inflasi Mengganas 🧋',
    emoji: '🧋',
    badge: 'Cash Killer',
    desc: 'Harga barang naik mendadak. Siapa simpan cash bawah bantal memang koyak teruk!',
    bg: 'bg-[#C4B5FD]',
    yearlyMultipliers: [1.06, 1.04, 1.08, 1.05, 1.09, 1.07, 1.06, 1.08, 1.07, 1.09],
  },
];

export const Tab5Simulator: React.FC<Tab5Props> = ({ onNextTab, onTriggerConfetti }) => {
  const [initialModal, setInitialModal] = useState<number>(1000);
  const [monthlyDCA, setMonthlyDCA] = useState<number>(200);
  const [simYears, setSimYears] = useState<number>(8);
  const [scenarioId, setScenarioId] = useState<ScenarioId>('normal');
  const [reactionMode, setReactionMode] = useState<'hodl' | 'panic'>('hodl');

  // Asset Mix %
  const [safeWeight, setSafeWeight] = useState<number>(40); // ASB / Tabung Haji
  const [equityWeight, setEquityWeight] = useState<number>(45); // ETF / Saham
  const [altWeight, setAltWeight] = useState<number>(15); // Emas / Kripto

  const activeScenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];

  const handlePresetMix = (safe: number, eq: number, alt: number) => {
    setSafeWeight(safe);
    setEquityWeight(eq);
    setAltWeight(alt);
  };

  // Run year-by-year simulation
  const runSimulation = () => {
    const rows: {
      year: number;
      cashVal: number;
      asbVal: number;
      portfolioVal: number;
      totalInvested: number;
    }[] = [];

    let cash = initialModal;
    let asb = initialModal;
    let port = initialModal;
    let invested = initialModal;

    const totalW = Math.max(1, safeWeight + equityWeight + altWeight);
    const wSafe = safeWeight / totalW;
    const wEq = equityWeight / totalW;
    const wAlt = altWeight / totalW;

    for (let y = 1; y <= simYears; y++) {
      const annualContribution = monthlyDCA * 12;
      invested += annualContribution;

      // Cash loses real purchasing power in inflation scenario
      const inflationDrag = scenarioId === 'inflation' ? 0.94 : 0.975;
      cash = (cash + annualContribution) * inflationDrag;

      // ASB steady ~5% return
      asb = (asb + annualContribution) * 1.05;

      // Portfolio blended return
      const mktMult = activeScenario.yearlyMultipliers[(y - 1) % 10];
      const safeRet = 1.05;
      const eqRet = mktMult;
      const altRet = mktMult > 1 ? 1 + (mktMult - 1) * 1.35 : 1 - (1 - mktMult) * 1.45;

      let blendedMult = wSafe * safeRet + wEq * eqRet + wAlt * altRet;

      // If Panic Sell mode is selected during a crash year, lock in loss and miss rebound!
      if (reactionMode === 'panic' && scenarioId === 'crash' && y >= 3) {
        blendedMult = y === 3 ? 0.78 : 1.015;
      }

      port = (port + annualContribution) * blendedMult;

      rows.push({
        year: y,
        cashVal: Math.round(cash),
        asbVal: Math.round(asb),
        portfolioVal: Math.round(port),
        totalInvested: Math.round(invested),
      });
    }
    return rows;
  };

  const simRows = runSimulation();
  const finalRow = simRows[simRows.length - 1] || {
    year: simYears,
    cashVal: initialModal,
    asbVal: initialModal,
    portfolioVal: initialModal,
    totalInvested: initialModal,
  };

  const netProfit = finalRow.portfolioVal - finalRow.totalInvested;
  const maxChartVal = Math.max(finalRow.portfolioVal, finalRow.asbVal, finalRow.totalInvested, 1000);

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <section className="text-center space-y-3 pt-2">
        <div className="inline-block bg-[#FEF08A] border-3 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] rounded-2xl px-4 py-1.5 font-extrabold text-sm -rotate-1">
          🕹️ SIMULATOR MASA DEPAN PORTFOLIO
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0F172A]">
          Test Dulu Sebelum <span className="bg-[#10D989] px-3 py-0.5 rounded-2xl border-3 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] inline-block rotate-1">Lebur Betul-Betul!</span> 🚀
        </h1>
        <p className="text-base sm:text-lg font-semibold text-slate-700 max-w-2xl mx-auto">
          Adjust modal, pilih event pasaran & tengok beza simpan bawah bantal vs melabur konsisten setiap bulan.
        </p>
      </section>

      {/* Main Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Controls Deck */}
        <div className="lg:col-span-5 neo-card-lg bg-white rounded-3xl p-6 space-y-6">
          <h2 className="font-display text-xl font-extrabold text-[#0F172A] border-b-3 border-[#0F172A] pb-3">
            🎛️ Parameter Pelaburan Kau
          </h2>

          {/* Initial Modal */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs sm:text-sm font-extrabold">
              <span>💰 Modal Mula (Lump Sum)</span>
              <span className="font-mono-num bg-[#BFDBFE] border-2 border-[#0F172A] px-2.5 py-0.5 rounded-lg">
                RM {initialModal.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={10000}
              step={100}
              value={initialModal}
              onChange={(e) => setInitialModal(Number(e.target.value))}
              className="neo-slider"
            />
          </div>

          {/* Monthly DCA */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs sm:text-sm font-extrabold">
              <span>📅 Topup Bulanan (DCA)</span>
              <span className="font-mono-num bg-[#A7F3D0] border-2 border-[#0F172A] px-2.5 py-0.5 rounded-lg">
                RM {monthlyDCA} / bln
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={1500}
              step={25}
              value={monthlyDCA}
              onChange={(e) => setMonthlyDCA(Number(e.target.value))}
              className="neo-slider"
            />
          </div>

          {/* Tempoh Tahun */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs sm:text-sm font-extrabold">
              <span>⏳ Tempoh Perap (Tahun)</span>
              <span className="font-mono-num bg-[#C4B5FD] border-2 border-[#0F172A] px-2.5 py-0.5 rounded-lg">
                {simYears} Tahun
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={10}
              step={1}
              value={simYears}
              onChange={(e) => setSimYears(Number(e.target.value))}
              className="neo-slider neo-slider-purple"
            />
          </div>

          {/* Quick Asset Allocation Presets */}
          <div className="pt-3 border-t-3 border-[#0F172A] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-slate-700">
                🧪 Preset Bancuhan Aset
              </span>
              <span className="font-mono-num text-xs font-bold text-slate-600">
                {safeWeight}% Safe · {equityWeight}% Saham · {altWeight}% Alt
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePresetMix(80, 15, 5)}
                className={`neo-btn py-2 px-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                  safeWeight === 80 ? 'bg-[#BFDBFE]' : 'bg-[#F7F9F6]'
                }`}
              >
                🛡️ Kebal
              </button>
              <button
                type="button"
                onClick={() => handlePresetMix(40, 45, 15)}
                className={`neo-btn py-2 px-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                  safeWeight === 40 ? 'bg-[#10D989]' : 'bg-[#F7F9F6]'
                }`}
              >
                ⚖️ Balanced
              </button>
              <button
                type="button"
                onClick={() => handlePresetMix(10, 60, 30)}
                className={`neo-btn py-2 px-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                  safeWeight === 10 ? 'bg-[#FBCFE8]' : 'bg-[#F7F9F6]'
                }`}
              >
                🚀 Agresif
              </button>
            </div>
          </div>

          {/* Mental Reaction Toggle during Crash */}
          <div className="pt-3 border-t-3 border-[#0F172A] space-y-2">
            <span className="block text-xs font-extrabold uppercase text-slate-700">
              🧠 Mentaliti Bila Market Merah:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setReactionMode('hodl')}
                className={`neo-btn py-2.5 px-3 rounded-xl text-xs font-extrabold cursor-pointer ${
                  reactionMode === 'hodl' ? 'bg-[#10D989]' : 'bg-[#F7F9F6]'
                }`}
              >
                💎 Diamond Hands (Stay)
              </button>
              <button
                type="button"
                onClick={() => {
                  setReactionMode('panic');
                  setScenarioId('crash');
                }}
                className={`neo-btn py-2.5 px-3 rounded-xl text-xs font-extrabold cursor-pointer ${
                  reactionMode === 'panic' ? 'bg-[#FF4766] text-white' : 'bg-[#F7F9F6]'
                }`}
              >
                😱 Panic Sell (Terciduk)
              </button>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Scenario Selector & Live Visual Stage */}
        <div className="lg:col-span-7 space-y-6">
          {/* Scenario Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SCENARIOS.map((sc) => {
              const active = scenarioId === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setScenarioId(sc.id);
                    if (sc.id === 'bull') onTriggerConfetti();
                  }}
                  className={`neo-card text-left p-3.5 rounded-2xl cursor-pointer transition-all ${
                    active
                      ? `${sc.bg} -translate-y-1 ring-3 ring-[#0F172A]`
                      : 'bg-white hover:bg-[#F7F9F6]'
                  }`}
                >
                  <div className="text-2xl emoji-3d">{sc.emoji}</div>
                  <div className="font-display text-sm font-extrabold text-[#0F172A] mt-1">
                    {sc.title}
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 mt-0.5">{sc.badge}</div>
                </button>
              );
            })}
          </div>

          {/* Simulation Output Stage */}
          <div className="neo-card-lg bg-white rounded-3xl p-6 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-3 border-[#0F172A] pb-4">
              <div>
                <span className="text-xs font-extrabold bg-[#FEF08A] border-2 border-[#0F172A] px-2.5 py-0.5 rounded-lg">
                  {activeScenario.emoji} {activeScenario.title}
                </span>
                <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
                  {activeScenario.desc}
                </p>
              </div>
              <div className="bg-[#10D989] border-3 border-[#0F172A] rounded-2xl px-4 py-2 shadow-[3px_3px_0px_0px_#0F172A] shrink-0 text-right">
                <div className="text-[10px] font-extrabold uppercase">Untung Bersih Portfolio</div>
                <div className="font-mono-num text-xl font-extrabold text-[#0F172A]">
                  {netProfit >= 0 ? `+RM ${netProfit.toLocaleString()}` : `-RM ${Math.abs(netProfit).toLocaleString()}`}
                </div>
              </div>
            </div>

            {/* 3-Column Comparison Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-100 border-3 border-[#0F172A] rounded-2xl p-4 shadow-[3px_3px_0px_0px_#0F172A]">
                <div className="text-xs font-extrabold text-slate-600">🛏️ Bawah Bantal (Kuasa Beli)</div>
                <div className="font-mono-num text-2xl font-extrabold text-[#FF4766] mt-1">
                  RM {finalRow.cashVal.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-slate-600 mt-1">
                  Modal asal: RM {finalRow.totalInvested.toLocaleString()} (Dimakan inflasi!)
                </div>
              </div>

              <div className="bg-[#BFDBFE] border-3 border-[#0F172A] rounded-2xl p-4 shadow-[3px_3px_0px_0px_#0F172A]">
                <div className="text-xs font-extrabold text-[#0F172A]">🛡️ 100% ASB / Tabung Haji</div>
                <div className="font-mono-num text-2xl font-extrabold text-[#0F172A] mt-1">
                  RM {finalRow.asbVal.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-slate-800 mt-1">
                  Untung: +RM {(finalRow.asbVal - finalRow.totalInvested).toLocaleString()}
                </div>
              </div>

              <div className="bg-[#A7F3D0] border-3 border-[#0F172A] rounded-2xl p-4 shadow-[3px_3px_0px_0px_#0F172A]">
                <div className="text-xs font-extrabold text-[#0F172A]">🚀 Portfolio Bancuhan Kau</div>
                <div className="font-mono-num text-2xl font-extrabold text-[#0F172A] mt-1">
                  RM {finalRow.portfolioVal.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-slate-800 mt-1">
                  {reactionMode === 'panic' && scenarioId === 'crash'
                    ? '💀 Rugi sebab Panic Sell!'
                    : `Untung: +RM ${netProfit.toLocaleString()}`}
                </div>
              </div>
            </div>

            {/* Interactive Year-by-Year Bar Comparison */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span>📊 Pertumbuhan Tahun Demi Tahun</span>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-[#93C5FD] border border-[#0F172A] inline-block" /> ASB
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-[#10D989] border border-[#0F172A] inline-block" /> Portfolio Kau
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-2.5 pt-2 items-end h-44 bg-[#F7F9F6] border-3 border-[#0F172A] rounded-2xl p-4">
                {simRows.map((r) => {
                  const asbHeight = Math.max(12, Math.round((r.asbVal / maxChartVal) * 120));
                  const portHeight = Math.max(12, Math.round((r.portfolioVal / maxChartVal) * 120));
                  const isCrashYear = scenarioId === 'crash' && r.year === 3;
                  return (
                    <div key={r.year} className="flex flex-col items-center gap-1">
                      <span className="font-mono-num text-[10px] font-extrabold text-[#0F172A]">
                        {(r.portfolioVal / 1000).toFixed(1)}k
                      </span>
                      <div className="flex items-end gap-1 h-28">
                        <div
                          style={{ height: `${asbHeight}px` }}
                          className="w-3 sm:w-3.5 bg-[#93C5FD] border-2 border-[#0F172A] rounded-t-md transition-all duration-300"
                          title={`Tahun ${r.year} ASB: RM ${r.asbVal}`}
                        />
                        <div
                          style={{ height: `${portHeight}px` }}
                          className={`w-3.5 sm:w-4 border-2 border-[#0F172A] rounded-t-md transition-all duration-300 ${
                            isCrashYear ? 'bg-[#FF4766]' : 'bg-[#10D989]'
                          }`}
                          title={`Tahun ${r.year} Portfolio: RM ${r.portfolioVal}`}
                        />
                      </div>
                      <span className="font-mono-num text-[11px] font-extrabold">T{r.year}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={onNextTab}
          className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-xl sm:text-2xl font-extrabold px-8 sm:px-10 py-5 rounded-3xl cursor-pointer"
        >
          Next: Mana Duit Pergi? (Tab 6) 🧪 ➡️
        </button>
      </div>
    </div>
  );
};
