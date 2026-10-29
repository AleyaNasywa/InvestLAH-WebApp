/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ConfettiBurst } from './components/ConfettiOverlay';
import { Tab1BaruNakUp } from './components/Tab1BaruNakUp';
import { Tab2RiskProfile } from './components/Tab2RiskProfile';
import { Tab3PokaiTapiBajet } from './components/Tab3PokaiTapiBajet';
import { Tab4MissionGetRich } from './components/Tab4MissionGetRich';
import { Tab5Simulator } from './components/Tab5Simulator';
import { Tab6WhereMoneyGoes } from './components/Tab6WhereMoneyGoes';
import { Tab7InvestorLingo } from './components/Tab7InvestorLingo';
import { Tab8HalalOrNah } from './components/Tab8HalalOrNah';

interface TabConfig {
  id: number;
  genzLabel: string;
  subVibe: string;
  emoji: string;
  color: string;
}

const TABS: TabConfig[] = [
  {
    id: 1,
    genzLabel: 'Baru Nak Up',
    subVibe: 'Inflasi Boba Check',
    emoji: '🧋',
    color: 'bg-[#FEF08A]',
  },
  {
    id: 2,
    genzLabel: 'Jiwa Pelabur',
    subVibe: 'Hati Kering Ke Koyak?',
    emoji: '🎲',
    color: 'bg-[#C4B5FD]',
  },
  {
    id: 3,
    genzLabel: 'Pokai Tapi Bajet',
    subVibe: 'Kira The Bag & Damage',
    emoji: '💸',
    color: 'bg-[#A7F3D0]',
  },
  {
    id: 4,
    genzLabel: 'Mission: Get Rich',
    subVibe: 'Lock In Blueprint',
    emoji: '🎯',
    color: 'bg-[#BFDBFE]',
  },
  {
    id: 5,
    genzLabel: 'Stonks Time Machine',
    subVibe: 'Test Market Crash',
    emoji: '🚀',
    color: 'bg-[#FBCFE8]',
  },
  {
    id: 6,
    genzLabel: 'Kebal vs Goyang',
    subVibe: 'Kenal & Bancuh Aset',
    emoji: '🧪',
    color: 'bg-[#FEF08A]',
  },
  {
    id: 7,
    genzLabel: 'Lingo Budak Fin',
    subVibe: 'Spill The Tea Kamus',
    emoji: '☕',
    color: 'bg-[#C4B5FD]',
  },
  {
    id: 8,
    genzLabel: 'Halal Ke Nah?',
    subVibe: 'Detox & Port Legit',
    emoji: '🕋',
    color: 'bg-[#A7F3D0]',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [confettiKey, setConfettiKey] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const triggerConfetti = () => {
    setConfettiKey(Date.now() + Math.random());
  };

  const goToTab = (tabNum: number) => {
    setActiveTab(tabNum);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentTabConfig = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#0F172A] relative overflow-x-hidden flex flex-col lg:flex-row">
      {/* Confetti Burst Overlay */}
      <ConfettiBurst triggerKey={confettiKey} />

      {/* Soft Pastel Abstract Background Blobs in Corners */}
      <div
        aria-hidden="true"
        className="fixed -top-28 -left-28 w-96 h-96 rounded-full bg-[#BFDBFE]/55 blur-3xl pointer-events-none z-0"
      />
      <div
        aria-hidden="true"
        className="fixed top-1/3 -right-32 w-96 h-96 rounded-full bg-[#FBCFE8]/55 blur-3xl pointer-events-none z-0"
      />
      <div
        aria-hidden="true"
        className="fixed -bottom-28 left-1/4 w-96 h-96 rounded-full bg-[#C4B5FD]/50 blur-3xl pointer-events-none z-0"
      />
      <div
        aria-hidden="true"
        className="fixed -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#A7F3D0]/55 blur-3xl pointer-events-none z-0"
      />

      {/* MOBILE TOP BAR (Only visible on < lg screens so mobile users can open sidebar) */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b-4 border-[#0F172A] px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => goToTab(1)}
          className="font-display text-2xl font-extrabold tracking-tight text-[#0F172A] cursor-pointer"
        >
          InvestLAH ⚡
        </button>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((p) => !p)}
          className="neo-btn bg-[#10D989] px-3.5 py-2 rounded-xl font-display text-xs font-extrabold cursor-pointer flex items-center gap-1.5"
        >
          <span>{currentTabConfig.emoji}</span>
          <span>{mobileMenuOpen ? 'Tutup Menu ✖️' : `Menu: ${currentTabConfig.genzLabel} ☰`}</span>
        </button>
      </div>

      {/* LEFT SIDEBAR NAVIGATION (Desktop Permanent + Mobile Drawer) */}
      <aside
        className={`${
          mobileMenuOpen ? 'fixed inset-0 z-50 bg-[#0F172A]/50 lg:bg-transparent' : 'hidden lg:block'
        } lg:sticky lg:top-0 lg:h-screen lg:w-72 xl:w-80 shrink-0 z-30`}
      >
        <div className="h-full w-72 xl:w-80 bg-white border-r-4 border-[#0F172A] p-4 sm:p-5 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            {/* Brand Header inside Sidebar */}
            <div className="flex items-center justify-between border-b-3 border-[#0F172A] pb-4">
              <button
                type="button"
                onClick={() => goToTab(1)}
                className="text-left group cursor-pointer"
              >
                <div className="font-display text-3xl font-extrabold tracking-tight text-[#0F172A] flex items-center gap-1.5">
                  <span>InvestLAH</span>
                  <span className="text-2xl emoji-3d group-hover:rotate-12 transition-transform">⚡</span>
                </div>
                <div className="text-xs font-bold text-slate-600">
                  Port Kewangan Gen Z Uni 🇲🇾
                </div>
              </button>

              {mobileMenuOpen && (
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="lg:hidden neo-btn bg-[#FBCFE8] px-3 py-1.5 rounded-xl font-extrabold text-xs"
                >
                  ✖️
                </button>
              )}
            </div>

            {/* 8 Gen Z Sidebar Tab Buttons */}
            <nav className="space-y-2.5" aria-label="Menu Modul Utama">
              {TABS.map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => goToTab(tab.id)}
                    className={`w-full text-left p-3 rounded-2xl border-3 border-[#0F172A] transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#10D989] text-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] -translate-y-0.5'
                        : `bg-[#F7F9F6] hover:${tab.color} text-[#0F172A] shadow-[2px_2px_0px_0px_#0F172A] hover:-translate-y-0.5`
                    }`}
                  >
                    <span
                      className={`w-10 h-10 rounded-xl border-2 border-[#0F172A] flex items-center justify-center text-xl emoji-3d shrink-0 ${
                        isSelected ? 'bg-white' : tab.color
                      }`}
                    >
                      {tab.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-sm font-extrabold text-[#0F172A] truncate">
                        {tab.genzLabel}
                      </div>
                      <div className="text-[11px] font-bold text-slate-700 truncate">
                        {tab.subVibe}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="font-mono-num text-xs font-extrabold bg-white border-2 border-[#0F172A] px-2 py-0.5 rounded-lg">
                        ON
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Bottom Quick Next Button */}
          <div className="pt-4 mt-4 border-t-3 border-[#0F172A]">
            <button
              type="button"
              onClick={() => goToTab(activeTab < 8 ? activeTab + 1 : 1)}
              className="neo-btn w-full bg-[#FEF08A] hover:bg-[#10D989] text-[#0F172A] font-display text-sm font-extrabold py-3 px-4 rounded-2xl cursor-pointer flex items-center justify-between"
            >
              <span>{activeTab < 8 ? 'Lompat Modul Depan' : 'Ulang Dari Mula'}</span>
              <span>{activeTab < 8 ? '➡️' : '🔄'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT STAGE (Clean, Uncluttered Top) */}
      <main className="relative z-10 flex-1 min-w-0 px-4 sm:px-8 lg:px-10 pt-6 pb-16">
        {activeTab === 1 && <Tab1BaruNakUp onNextTab={() => goToTab(2)} />}
        {activeTab === 2 && (
          <Tab2RiskProfile
            onNextTab={() => goToTab(3)}
            onTriggerConfetti={triggerConfetti}
          />
        )}
        {activeTab === 3 && (
          <Tab3PokaiTapiBajet
            onNextTab={() => goToTab(4)}
            onTriggerConfetti={triggerConfetti}
          />
        )}
        {activeTab === 4 && (
          <Tab4MissionGetRich
            onNextTab={() => goToTab(5)}
            onTriggerConfetti={triggerConfetti}
          />
        )}
        {activeTab === 5 && (
          <Tab5Simulator
            onNextTab={() => goToTab(6)}
            onTriggerConfetti={triggerConfetti}
          />
        )}
        {activeTab === 6 && (
          <Tab6WhereMoneyGoes
            onNextTab={() => goToTab(7)}
            onTriggerConfetti={triggerConfetti}
          />
        )}
        {activeTab === 7 && (
          <Tab7InvestorLingo
            onNextTab={() => goToTab(8)}
            onTriggerConfetti={triggerConfetti}
          />
        )}
        {activeTab === 8 && (
          <Tab8HalalOrNah
            onRestartFlow={() => goToTab(1)}
            onTriggerConfetti={triggerConfetti}
          />
        )}
      </main>
    </div>
  );
}
