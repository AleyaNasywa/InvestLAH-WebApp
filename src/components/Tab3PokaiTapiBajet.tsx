import React, { useEffect, useState } from 'react';

interface Tab3Props {
  onNextTab: () => void;
  onTriggerConfetti: () => void;
}

interface OutflowItem {
  id: string;
  label: string;
  emoji: string;
  bucket: 'survival' | 'healing';
  max: number;
  step: number;
}

const OUTFLOW_CATEGORIES: OutflowItem[] = [
  { id: 'rent', label: 'Room & Hostel Rent (Sewa Bilik)', emoji: '🏠', bucket: 'survival', max: 800, step: 10 },
  { id: 'transport', label: 'Grab & Minyak Kereta', emoji: '🚗', bucket: 'survival', max: 400, step: 10 },
  { id: 'meals', label: 'Daily Meals, Food & Groceries', emoji: '🍜', bucket: 'survival', max: 900, step: 10 },
  { id: 'internet', label: 'Internet & Phone Data Plan', emoji: '📱', bucket: 'survival', max: 150, step: 5 },
  { id: 'study', label: 'Study Essentials (Printing, Books)', emoji: '📚', bucket: 'survival', max: 300, step: 10 },
  { id: 'subs', label: 'Entertainment Subs (Netflix, Spotify)', emoji: '🎧', bucket: 'healing', max: 200, step: 5 },
  { id: 'fitness', label: 'Fitness & Sports (Gym, Futsal, Badminton)', emoji: '🏋️', bucket: 'healing', max: 250, step: 10 },
  { id: 'shopping', label: 'Shopping (Shopee, Lazada, TikTok Shop)', emoji: '🛍️', bucket: 'healing', max: 600, step: 10 },
  { id: 'hangout', label: 'Hangout & Chill (Cafe Hunting, Movies)', emoji: '☕️', bucket: 'healing', max: 600, step: 10 },
];

export const Tab3PokaiTapiBajet: React.FC<Tab3Props> = ({ onNextTab, onTriggerConfetti }) => {
  const [subtab, setSubtab] = useState<1 | 2 | 3>(1);

  // Subtab 1: Direct, Zero-Math Monthly Inputs (Biasiswa/Loan, Parents, Part-Time)
  const [loanBiasiswa, setLoanBiasiswa] = useState<number>(600);
  const [parentsMoney, setParentsMoney] = useState<number>(300);
  const [partTimeMoney, setPartTimeMoney] = useState<number>(250);
  const [rainKey, setRainKey] = useState<number>(1);

  // Subtab 2: 9 Outflow Categories
  const [isAutopilot, setIsAutopilot] = useState<boolean>(false);
  const [outflows, setOutflows] = useState<Record<string, number>>({
    rent: 180,
    transport: 70,
    meals: 280,
    internet: 35,
    study: 35,
    subs: 25,
    fitness: 30,
    shopping: 90,
    hangout: 110,
  });
  const [bubbleBursts, setBubbleBursts] = useState<{ id: number; catId: string; emoji: string; pct: number }[]>([]);
  const [shakeBenchmark, setShakeBenchmark] = useState<boolean>(false);

  // Subtab 3 State
  const [deficitFlash, setDeficitFlash] = useState<boolean>(false);

  // Simple Sums (Zero Complicated Formulas)
  const totalInflow = loanBiasiswa + parentsMoney + partTimeMoney;

  const survivalTotal =
    outflows.rent + outflows.transport + outflows.meals + outflows.internet + outflows.study;
  const healingTotal =
    outflows.subs + outflows.fitness + outflows.shopping + outflows.hangout;
  const totalOutflow = survivalTotal + healingTotal;
  const netBalance = totalInflow - totalOutflow;

  const survivalPct = totalInflow > 0 ? Math.round((survivalTotal / totalInflow) * 100) : 0;
  const healingPct = totalInflow > 0 ? Math.round((healingTotal / totalInflow) * 100) : 0;
  const investPct = Math.max(0, 100 - survivalPct - healingPct);

  const isHealingOver = healingPct > 30;
  const isSurvivalOver = survivalPct > 50;
  const isOverLimit = isHealingOver || isSurvivalOver;

  const triggerRain = () => {
    setRainKey(Date.now());
  };

  // Autopilot sets a clean 50/30/20 split across the 9 categories
  const handleToggleAutopilot = () => {
    const nextState = !isAutopilot;
    setIsAutopilot(nextState);
    if (nextState) {
      const targetSurvival = Math.round(totalInflow * 0.5);
      const targetHealing = Math.round(totalInflow * 0.3);
      setOutflows({
        rent: Math.round(targetSurvival * 0.3),
        transport: Math.round(targetSurvival * 0.14),
        meals: Math.round(targetSurvival * 0.42),
        internet: Math.round(targetSurvival * 0.07),
        study: Math.round(targetSurvival * 0.07),
        subs: Math.round(targetHealing * 0.12),
        fitness: Math.round(targetHealing * 0.15),
        shopping: Math.round(targetHealing * 0.35),
        hangout: Math.round(targetHealing * 0.38),
      });
    }
  };

  const handleSliderChange = (cat: OutflowItem, val: number) => {
    if (isAutopilot) setIsAutopilot(false);
    const nextOutflows = { ...outflows, [cat.id]: val };
    setOutflows(nextOutflows);

    const pct = Math.min(92, Math.max(8, (val / cat.max) * 100));
    const bId = Date.now() + Math.random();
    setBubbleBursts((prev) => [...prev.slice(-8), { id: bId, catId: cat.id, emoji: cat.emoji, pct }]);
    setTimeout(() => {
      setBubbleBursts((prev) => prev.filter((b) => b.id !== bId));
    }, 850);

    const nextSurvival =
      nextOutflows.rent +
      nextOutflows.transport +
      nextOutflows.meals +
      nextOutflows.internet +
      nextOutflows.study;
    const nextHealing =
      nextOutflows.subs +
      nextOutflows.fitness +
      nextOutflows.shopping +
      nextOutflows.hangout;

    if (
      totalInflow > 0 &&
      (nextHealing / totalInflow > 0.3 || nextSurvival / totalInflow > 0.5)
    ) {
      setShakeBenchmark(true);
      setTimeout(() => setShakeBenchmark(false), 500);
    }
  };

  useEffect(() => {
    if (subtab === 3) {
      if (netBalance >= 0) {
        onTriggerConfetti();
      } else {
        setDeficitFlash(true);
        const t = setTimeout(() => setDeficitFlash(false), 900);
        return () => clearTimeout(t);
      }
    }
  }, [subtab, netBalance]);

  return (
    <div className={`space-y-8 pb-12 max-w-5xl mx-auto transition-all duration-300 ${deficitFlash ? 'grayscale contrast-125' : ''}`}>
      {/* Sticky Subtab Navigation (Untouched Gen Z Labels) */}
      <div className="sticky top-4 z-30 flex justify-center">
        <div className="neo-card bg-white rounded-full p-1.5 flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full">
          {[
            { id: 1, label: '1️⃣ Duit Masuk (The Bag)' },
            { id: 2, label: '2️⃣ Duit Terbang (The Damage)' },
            { id: 3, label: '3️⃣ Vibe Check (Summary)' },
          ].map((tab) => {
            const active = subtab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubtab(tab.id as 1 | 2 | 3)}
                className={`px-4 sm:px-6 py-2.5 rounded-full font-display font-extrabold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shrink-0 border-2 ${
                  active
                    ? 'bg-[#10D989] text-[#0F172A] border-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] -translate-y-0.5'
                    : 'bg-transparent text-slate-700 border-transparent hover:bg-[#F7F9F6]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* RED GOLDEN RULE 50/30/20 EMPHASIS BANNER */}
      <div className="neo-card bg-[#FF4766] text-white rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl emoji-3d shrink-0">🚨</span>
          <div>
            <div className="font-display text-lg sm:text-xl font-extrabold uppercase tracking-wide">
              WAJIB IKUT GOLDEN RULE: 50% NEEDS · 30% WANTS · 20% INVEST!
            </div>
            <p className="text-xs sm:text-sm font-bold text-white/95">
              Jangan biar duit shopping & lepak telan lebih 30% bajet bulanan kau bro!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 font-mono-num text-xs font-extrabold">
          <span className="bg-white text-[#0F172A] border-2 border-[#0F172A] px-2.5 py-1 rounded-xl">50% Survival</span>
          <span className="bg-[#FEF08A] text-[#0F172A] border-2 border-[#0F172A] px-2.5 py-1 rounded-xl">30% Healing</span>
          <span className="bg-[#10D989] text-[#0F172A] border-2 border-[#0F172A] px-2.5 py-1 rounded-xl">20% Invest</span>
        </div>
      </div>

      {/* SUBTAB 1: DUIT MASUK (THE BAG) - ZERO MATH, JUST INPUT VALUES */}
      {subtab === 1 && (
        <div className="space-y-8 animate-fadeIn">
          <div className="text-center space-y-2">
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0F172A]">
              Berapa Beb Actually Duit Kau Sebulan? 💰
            </h1>
            <p className="text-base font-bold text-slate-700">
              Tak payah pening kira formula. Masukkan je anggaran duit masuk kau setiap bulan kat bawah!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column: 3 Direct Income Sources */}
            <div className="lg:col-span-7 neo-card-lg bg-white rounded-3xl p-6 sm:p-8 space-y-6">
              {/* 1. Biasiswa / PTPTN / Loan */}
              <div className="bg-[#BFDBFE] border-3 border-[#0F172A] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#0F172A] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-display text-lg font-extrabold text-[#0F172A]">
                    🎓 1. Biasiswa / PTPTN / Loan (Sebulan)
                  </label>
                  <span className="text-2xl emoji-3d">🏦</span>
                </div>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={loanBiasiswa}
                  onChange={(e) => {
                    setLoanBiasiswa(Math.max(0, Number(e.target.value)));
                    triggerRain();
                  }}
                  className="w-full bg-white border-3 border-[#0F172A] rounded-xl px-4 py-3 font-mono-num text-2xl sm:text-3xl font-extrabold text-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] focus:outline-none"
                />
                <input
                  type="range"
                  min={0}
                  max={2500}
                  step={50}
                  value={loanBiasiswa}
                  onChange={(e) => {
                    setLoanBiasiswa(Number(e.target.value));
                    triggerRain();
                  }}
                  className="neo-slider"
                />
              </div>

              {/* 2. Duit Parents Bagi */}
              <div className="bg-[#C4B5FD] border-3 border-[#0F172A] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#0F172A] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-display text-lg font-extrabold text-[#0F172A]">
                    👨‍👩‍👧 2. Duit Parents Bagi (Mak Ayah)
                  </label>
                  <span className="text-2xl emoji-3d">💝</span>
                </div>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={parentsMoney}
                  onChange={(e) => {
                    setParentsMoney(Math.max(0, Number(e.target.value)));
                    triggerRain();
                  }}
                  className="w-full bg-white border-3 border-[#0F172A] rounded-xl px-4 py-3 font-mono-num text-2xl sm:text-3xl font-extrabold text-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] focus:outline-none"
                />
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={25}
                  value={parentsMoney}
                  onChange={(e) => {
                    setParentsMoney(Number(e.target.value));
                    triggerRain();
                  }}
                  className="neo-slider neo-slider-purple"
                />
              </div>

              {/* 3. Kerja Part-Time / Side Hustle */}
              <div className="bg-[#A7F3D0] border-3 border-[#0F172A] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#0F172A] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-display text-lg font-extrabold text-[#0F172A]">
                    ⚡ 3. Kerja Part-Time / Side Hustle
                  </label>
                  <span className="text-2xl emoji-3d">💼</span>
                </div>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={partTimeMoney}
                  onChange={(e) => {
                    setPartTimeMoney(Math.max(0, Number(e.target.value)));
                    triggerRain();
                  }}
                  className="w-full bg-white border-3 border-[#0F172A] rounded-xl px-4 py-3 font-mono-num text-2xl sm:text-3xl font-extrabold text-[#0F172A] shadow-[3px_3px_0px_0px_#0F172A] focus:outline-none"
                />
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={25}
                  value={partTimeMoney}
                  onChange={(e) => {
                    setPartTimeMoney(Number(e.target.value));
                    triggerRain();
                  }}
                  className="neo-slider"
                />
              </div>
            </div>

            {/* Right Column: Total Bag Card with Make It Rain Animation */}
            <div className="lg:col-span-5 neo-card-lg bg-[#10D989] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div key={rainKey} className=" inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                {[12, 28, 46, 64, 82].map((leftPct, idx) => (
                  <span
                    key={idx}
                    style={{ left: `${leftPct}%`, animationDelay: `${idx * 90}ms` }}
                    className=" top-2 text-3xl animate-money-rain select-none emoji-3d"
                  >
                    💸
                  </span>
                ))}
              </div>

              <div className="space-y-3 relative z-10">
                <span className="inline-block bg-white border-2 border-[#0F172A] px-3 py-1 rounded-xl text-xs font-extrabold shadow-[2px_2px_0px_0px_#0F172A]">
                  💸 THE BAG · TOTAL SEBULAN
                </span>
                <h2 className="font-display text-2xl font-extrabold text-[#0F172A]">
                  Total Peluru Bulanan Kau:
                </h2>
                <div className="bg-white border-4 border-[#0F172A] rounded-3xl p-5 shadow-[5px_5px_0px_0px_#0F172A]">
                  <div className="text-xs font-extrabold text-slate-600 uppercase">
                    Jumlah Duit Masuk
                  </div>
                  <div className="font-mono-num text-4xl sm:text-5xl font-extrabold text-[#0F172A] mt-1">
                    RM {totalInflow.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 my-6 bg-white/95 border-3 border-[#0F172A] rounded-2xl p-4 relative z-10 text-sm font-bold">
                <div className="flex justify-between">
                  <span>🎓 Biasiswa / Loan:</span>
                  <span className="font-mono-num font-extrabold">RM {loanBiasiswa}</span>
                </div>
                <div className="flex justify-between">
                  <span>👨‍👩‍👧 Parents Bagi:</span>
                  <span className="font-mono-num font-extrabold">RM {parentsMoney}</span>
                </div>
                <div className="flex justify-between">
                  <span>⚡ Kerja Part-Time:</span>
                  <span className="font-mono-num font-extrabold">RM {partTimeMoney}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSubtab(2)}
                className="neo-btn bg-[#FEF08A] hover:bg-white text-[#0F172A] font-display text-lg sm:text-xl font-extrabold py-4 px-6 rounded-2xl w-full cursor-pointer relative z-10"
              >
                Next: Masuk Bab Duit Terbang 🏃💨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: DUIT TERBANG (THE DAMAGE) - 9 REQUESTED CATEGORIES + RED 50/30/20 RULE */}
      {subtab === 2 && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header & Autopilot Switch */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white neo-card rounded-3xl p-5 sm:p-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                Duit Terbang Bulanan (The Damage) 💸
              </h2>
              <p className="text-xs sm:text-sm font-bold text-slate-600">
                Adjust 9 komitmen bulanan kau kat bawah atau tekan Autopilot!
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#F7F9F6] border-3 border-[#0F172A] rounded-2xl p-1.5 shadow-[4px_4px_0px_0px_#0F172A]">
              <button
                type="button"
                onClick={() => setIsAutopilot(false)}
                className={`px-3.5 py-2 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
                  !isAutopilot
                    ? 'bg-[#0F172A] text-white shadow-[2px_2px_0px_0px_#10D989]'
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                ✍️ Manual Adjust
              </button>
              <button
                type="button"
                onClick={handleToggleAutopilot}
                className={`px-3.5 py-2 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
                  isAutopilot
                    ? 'bg-[#10D989] text-[#0F172A] border-2 border-[#0F172A]'
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                SC & DOSM Autopilot (Biar AI Fikir 🤖)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Cols: 9 Monthly Lifestyle Outflow Sliders */}
            <div className="lg:col-span-7 neo-card-lg bg-white rounded-3xl p-6 sm:p-7 space-y-5">
              {OUTFLOW_CATEGORIES.map((cat, idx) => {
                const val = outflows[cat.id] || 0;
                const activeBubbles = bubbleBursts.filter((b) => b.catId === cat.id);
                return (
                  <div key={cat.id} className="space-y-1.5 relative">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-2">
                        <span className="text-lg emoji-3d">{cat.emoji}</span>
                        <span>
                          {idx + 1}. {cat.label}
                        </span>
                      </span>
                      <span
                        className={`font-mono-num text-xs sm:text-sm font-extrabold px-3 py-0.5 rounded-xl border-2 border-[#0F172A] shrink-0 ${
                          cat.bucket === 'healing' ? 'bg-[#FBCFE8]' : 'bg-[#BFDBFE]'
                        }`}
                      >
                        RM {val}
                      </span>
                    </div>

                    <div className="relative pt-1">
                      {activeBubbles.map((b) => (
                        <span
                          key={b.id}
                          style={{ left: `${b.pct}%` }}
                          className=" -top-7 text-2xl pointer-events-none animate-float-up emoji-3d z-20"
                        >
                          {b.emoji}
                        </span>
                      ))}

                      <input
                        type="range"
                        min={0}
                        max={cat.max}
                        step={cat.step}
                        value={val}
                        onChange={(e) => handleSliderChange(cat, Number(e.target.value))}
                        className={`neo-slider ${
                          cat.bucket === 'healing' ? 'neo-slider-coral' : ''
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right 5 Cols: RED GOLDEN RULE (50 / 30 / 20) HIGH-ALERT CARD */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
              <div
                className={`neo-card-lg rounded-3xl p-6 sm:p-7 transition-colors duration-200 bg-[#FF4766] text-white ${
                  shakeBenchmark ? 'animate-neo-shake' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-white text-[#FF4766] border-2 border-[#0F172A] px-3 py-1 rounded-xl text-xs font-extrabold shadow-[2px_2px_0px_0px_#0F172A]">
                    🚨 GOLDEN RULE (50 / 30 / 20)
                  </span>
                  <span className="text-3xl emoji-3d">{isOverLimit ? '💀' : '🔥'}</span>
                </div>

                <h3 className="font-display text-2xl font-extrabold mb-2">
                  {isOverLimit
                    ? 'AMARAN MERAH: Bajet Kau Lari!'
                    : 'Ngam! Kau Patuh Golden Rule 50/30/20!'}
                </h3>
                <p className="text-xs font-bold text-white/90 mb-4">
                  Peraturan wajib student: Jangan belanja Needs lebih 50% & Wants lebih 30%!
                </p>

                {/* 3 Progress Bars inside Crisp White Box */}
                <div className="space-y-4 bg-white text-[#0F172A] border-3 border-[#0F172A] rounded-2xl p-4 shadow-[4px_4px_0px_0px_#0F172A]">
                  {/* 50% Survival */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-extrabold">
                      <span>🍜 50% Needs / Survival</span>
                      <span className={`font-mono-num ${isSurvivalOver ? 'text-[#FF4766]' : 'text-[#0F172A]'}`}>
                        {survivalPct}% / 50% (RM {survivalTotal})
                      </span>
                    </div>
                    <div className="w-full h-4 bg-slate-100 rounded-full border-2 border-[#0F172A] overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isSurvivalOver ? 'bg-[#FF4766]' : 'bg-[#93C5FD]'
                        }`}
                        style={{ width: `${Math.min(100, survivalPct)}%` }}
                      />
                    </div>
                  </div>

                  {/* 30% Healing */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-extrabold">
                      <span>🛍️ 30% Wants / Healing</span>
                      <span className={`font-mono-num ${isHealingOver ? 'text-[#FF4766]' : 'text-[#0F172A]'}`}>
                        {healingPct}% / 30% (RM {healingTotal})
                      </span>
                    </div>
                    <div className="w-full h-4 bg-slate-100 rounded-full border-2 border-[#0F172A] overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isHealingOver ? 'bg-[#FF4766]' : 'bg-[#F9A8D4]'
                        }`}
                        style={{ width: `${Math.min(100, healingPct)}%` }}
                      />
                    </div>
                  </div>

                  {/* 20% InvestLAH */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-extrabold">
                      <span>🚀 20% Simpan & InvestLAH</span>
                      <span className="font-mono-num text-emerald-700">
                        {investPct}% / 20% (RM {Math.max(0, netBalance)})
                      </span>
                    </div>
                    <div className="w-full h-4 bg-slate-100 rounded-full border-2 border-[#0F172A] overflow-hidden">
                      <div
                        className="h-full bg-[#10D989] transition-all duration-300"
                        style={{ width: `${Math.min(100, investPct)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {isOverLimit && (
                  <div className="mt-4 bg-[#0F172A] text-[#FEF08A] border-2 border-white rounded-2xl p-3.5 font-extrabold text-xs sm:text-sm">
                    {isHealingOver
                      ? '🚨 Amaran: Duit shopping & healing kau over-limit 30% ni. Potong sikit bro!'
                      : '🚨 Amaran: Kos survival kau dah lebih 50%! Cuba tekan butang Autopilot kat atas.'}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSubtab(3)}
                className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-xl font-extrabold py-5 px-6 rounded-3xl w-full cursor-pointer"
              >
                Next: Kasi Vibe Check Skit 👀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: VIBE CHECK (SUMMARY) */}
      {subtab === 3 && (
        <div className="space-y-8 animate-fadeIn">
          <div
            className={`neo-card-lg rounded-3xl p-8 sm:p-12 text-center space-y-6 ${
              netBalance >= 0 ? 'bg-[#A7F3D0]' : 'bg-[#FBCFE8]'
            }`}
          >
            <div className="inline-block bg-white border-3 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] rounded-2xl px-4 py-1.5 font-extrabold text-sm">
              {netBalance >= 0 ? '✅ STATUS DOMPET: SURPLUS PADU' : '💀 STATUS DOMPET: DEFICIT PARAH'}
            </div>

            <div
              className={`font-mono-num text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight py-4 px-6 rounded-3xl border-4 border-[#0F172A] inline-block bg-white shadow-[8px_8px_0px_0px_#0F172A] ${
                netBalance >= 0
                  ? 'text-[#10D989] drop-shadow-[0_0_20px_rgba(16,217,137,0.45)]'
                  : 'text-[#FF4766]'
              }`}
            >
              {netBalance >= 0 ? `+RM ${netBalance}` : `-RM ${Math.abs(netBalance)}`}
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
              {netBalance >= 0
                ? 'Healthy Surplus! Bag Secured ✅ We Up! 🔥'
                : 'Terciduk Bro 💀 L Move. Kau pokai bulan ni!'}
            </h2>

            <p className="text-base sm:text-lg font-bold text-slate-800 max-w-xl mx-auto">
              {netBalance >= 0
                ? `Kemana nak bawak baki RM ${netBalance} ni? Kita campak terus masuk Tab "Mission: Get Rich" untuk bina target impian kau!`
                : `Belanja kau terlebih RM ${Math.abs(netBalance)}. Patah balik Step 2 & kurangkan Shopee/Cafe Hunting!`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="neo-card-lg bg-[#BFDBFE] rounded-3xl p-6 sm:p-8 flex items-center justify-between">
              <div>
                <div className="text-xs font-extrabold uppercase text-slate-700">
                  Total Duit Masuk (The Bag)
                </div>
                <div className="font-mono-num text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-1">
                  RM {totalInflow.toLocaleString()}
                </div>
                <div className="text-xs font-bold text-slate-700 mt-1">
                  Biasiswa/Loan + Parents + Part-Time
                </div>
              </div>
              <span className="text-5xl emoji-3d">💰</span>
            </div>

            <div className="neo-card-lg bg-[#FBCFE8] rounded-3xl p-6 sm:p-8 flex items-center justify-between">
              <div>
                <div className="text-xs font-extrabold uppercase text-slate-700">
                  Total Duit Terbang (9 Kategori)
                </div>
                <div className="font-mono-num text-3xl sm:text-4xl font-extrabold text-[#FF4766] mt-1">
                  RM {totalOutflow.toLocaleString()}
                </div>
                <div className="text-xs font-bold text-slate-700 mt-1">
                  Needs (RM {survivalTotal}) + Wants (RM {healingTotal})
                </div>
              </div>
              <span className="text-5xl emoji-3d">💸</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onNextTab}
              className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-xl sm:text-2xl md:text-3xl font-extrabold px-8 sm:px-12 py-5 sm:py-6 rounded-3xl inline-flex items-center gap-3 cursor-pointer shadow-[0_0_25px_rgba(16,217,137,0.5)]"
            >
              <span>Bawak Lebihan Ni Ke Mission: Get Rich 🎯 🚀</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
