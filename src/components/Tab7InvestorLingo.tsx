import React, { useState } from 'react';

interface Tab7Props {
  onNextTab: () => void;
  onTriggerConfetti: () => void;
}

const LINGO_CARDS = [
  {
    id: 'risk',
    emoji: '🎢',
    frontTitle: '🎢 Risk / Risiko',
    frontHint: 'Tap / Hover untuk flip kad 🔄',
    backText: 'High risk, high return wei. Kalau tak, confirm terciduk.',
    backBg: 'bg-[#FBCFE8]',
    tag: 'Lingo #1',
  },
  {
    id: 'shares',
    emoji: '🏢',
    frontTitle: '🏢 Shares / Saham',
    frontHint: 'Tap / Hover untuk flip kad 🔄',
    backText: 'Beli syer company. Kau literally part-owner tbh.',
    backBg: 'bg-[#BFDBFE]',
    tag: 'Lingo #2',
  },
  {
    id: 'unit-trust',
    emoji: '🤝',
    frontTitle: '🤝 Unit Trust (Macam ASB)',
    frontHint: 'Tap / Hover untuk flip kad 🔄',
    backText: 'Kumpul duit sama-sama, pass kat pro suruh tolong invest.',
    backBg: 'bg-[#C4B5FD]',
    tag: 'Lingo #3',
  },
  {
    id: 'etf',
    emoji: '🧺',
    frontTitle: '🧺 ETF',
    frontHint: 'Tap / Hover untuk flip kad 🔄',
    backText: 'Beli one whole basket terus. Tak payah pening pick company satu-satu ngl.',
    backBg: 'bg-[#A7F3D0]',
    tag: 'Lingo #4',
  },
];

const LINGO_QUIZ = [
  {
    id: 1,
    question: 'Question 1: ETF tu meaning dia beli satu company je.',
    answer: 'cap' as const,
    detail: 'ETF tu beli satu bakul penuh syarikat terus!',
  },
  {
    id: 2,
    question: 'Question 2: High risk = confirm rugi gila.',
    answer: 'cap' as const,
    detail: 'High risk maksudnya potensi pulangan tinggi, tapi turun naik laju!',
  },
  {
    id: 3,
    question: 'Question 3: Beli saham means kau actually jadi part-owner.',
    answer: 'fact' as const,
    detail: 'Betul wei! Walaupun 1 lot, kau tetap part-owner syarikat tu.',
  },
];

export const Tab7InvestorLingo: React.FC<Tab7Props> = ({ onNextTab, onTriggerConfetti }) => {
  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [qIndex, setQIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; label: string; sub: string } | null>(null);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [shakeCard, setShakeCard] = useState<boolean>(false);

  const toggleCard = (id: string) => {
    setFlippedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAnswer = (choice: 'cap' | 'fact') => {
    if (feedback) return;
    const current = LINGO_QUIZ[qIndex];
    const isCorrect = choice === current.answer;

    setShakeCard(true);
    setTimeout(() => setShakeCard(false), 420);

    setFeedback({
      ok: isCorrect,
      label: isCorrect ? 'Ngam! 🔥' : 'Salah bro! 💀',
      sub: current.detail,
    });

    setTimeout(() => {
      setFeedback(null);
      if (qIndex < LINGO_QUIZ.length - 1) {
        setQIndex((p) => p + 1);
      } else {
        setIsDone(true);
        onTriggerConfetti();
      }
    }, 1100);
  };

  return (
    <div className="space-y-12 pb-12 max-w-4xl mx-auto">
      {/* 1. Header Section */}
      <section className="text-center space-y-3 pt-2">
        <div className="inline-block bg-[#FEF08A] border-3 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] rounded-2xl px-4 py-1.5 font-extrabold text-sm -rotate-1">
          📚 KAMUS JALANAN PELABUR GEN Z
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0F172A]">
          Lingo Budak Financial, Spill The Tea ☕
        </h1>
        <p className="text-lg sm:text-xl font-bold text-slate-700">
          Fahamkan lingo ni so kau tak nampak noob sangat.
        </p>
      </section>

      {/* 2. Interactive "Lingo Cards" 2x2 Grid (Flashcards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs sm:text-sm font-extrabold uppercase text-slate-700">
            ✨ Klik atau Hover Kad Untuk Flip:
          </span>
          <button
            type="button"
            onClick={() => {
              const allFlipped = Object.values(flippedMap).filter(Boolean).length === 4;
              if (allFlipped) {
                setFlippedMap({});
              } else {
                setFlippedMap({ risk: true, shares: true, 'unit-trust': true, etf: true });
              }
            }}
            className="neo-btn bg-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer"
          >
            🔄 Flip Semua Kad
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {LINGO_CARDS.map((card) => {
            const isFlipped = !!flippedMap[card.id];
            return (
              <div
                key={card.id}
                onClick={() => toggleCard(card.id)}
                onMouseEnter={() => setFlippedMap((p) => ({ ...p, [card.id]: true }))}
                onMouseLeave={() => setFlippedMap((p) => ({ ...p, [card.id]: false }))}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCard(card.id);
                  }
                }}
                className="perspective-1000 h-56 sm:h-60 cursor-pointer select-none"
              >
                <div
                  className={`w-full h-full relative transform-style-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* FRONT OF CARD */}
                  <div className=" inset-0 backface-hidden neo-card-lg bg-white rounded-3xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="bg-[#F7F9F6] border-2 border-[#0F172A] px-3 py-1 rounded-xl text-xs font-extrabold">
                        {card.tag}
                      </span>
                      <span className="text-3xl emoji-3d">{card.emoji}</span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] text-center my-auto">
                      {card.frontTitle}
                    </h2>

                    <div className="text-center text-xs font-extrabold text-slate-500">
                      {card.frontHint}
                    </div>
                  </div>

                  {/* BACK OF CARD (Bright Pastel) */}
                  <div
                    className={` inset-0 backface-hidden rotate-y-180 neo-card-lg ${card.backBg} rounded-3xl p-6 flex flex-col justify-between text-[#0F172A]`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="bg-white border-2 border-[#0F172A] px-3 py-1 rounded-xl text-xs font-extrabold shadow-[2px_2px_0px_0px_#0F172A]">
                        ☕ MAKSUD SEBENAR
                      </span>
                      <span className="text-2xl emoji-3d">{card.emoji}</span>
                    </div>

                    <p className="font-display text-xl sm:text-2xl font-extrabold text-[#0F172A] text-center my-auto leading-snug">
                      "{card.backText}"
                    </p>

                    <div className="text-center text-xs font-extrabold text-slate-800">
                      ✓ Dah Faham Lingo Ni
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. "Lingo Check-Up" Gamified Quiz (With "Let's Start" Screen & Massive Badge) */}
      <section className="space-y-6 pt-4">
        <div className="text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
            Brain Test: Fact or Cap? 🧢
          </h2>
        </div>

        {/* "LET'S START!" INTRO SCREEN */}
        {!quizStarted && !isDone && (
          <div className="neo-card-lg bg-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
            <div className="inline-block bg-[#C4B5FD] border-2 border-[#0F172A] px-4 py-1.5 rounded-xl text-xs font-extrabold shadow-[2px_2px_0px_0px_#0F172A]">
              🧠 LINGO BRAIN TEST · 3 SOALAN PANTAS
            </div>
            <div className="text-6xl sm:text-7xl emoji-3d animate-bounce">☕🧢📠</div>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
              Dah Flip 4 Kad Kat Atas? Jom Test Otak!
            </h3>
            <p className="text-base font-bold text-slate-700 max-w-md mx-auto">
              Jawab 3 soalan Fact or Cap ni untuk loot Lencana Lingo Master kau!
            </p>
            <button
              type="button"
              onClick={() => setQuizStarted(true)}
              className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-2xl sm:text-3xl font-extrabold px-10 py-5 rounded-3xl cursor-pointer shadow-[0_0_25px_rgba(16,217,137,0.5)]"
            >
              Let's Start Brain Test! 🚀
            </button>
          </div>
        )}

        {/* ACTIVE QUIZ CARD */}
        {quizStarted && !isDone && (
          <div
            className={`neo-card-lg bg-white rounded-3xl p-6 sm:p-10 text-center space-y-6 relative overflow-hidden ${
              shakeCard ? 'animate-neo-shake' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="bg-[#C4B5FD] border-2 border-[#0F172A] px-3.5 py-1 rounded-xl text-xs font-extrabold shadow-[2px_2px_0px_0px_#0F172A]">
                Soalan {qIndex + 1} / {LINGO_QUIZ.length}
              </span>
              <span className="font-mono-num text-xs font-extrabold text-slate-600">
                Lingo Check-Up
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-[#0F172A] py-4">
              {LINGO_QUIZ[qIndex].question}
            </h3>

            {feedback && (
              <div
                className={`p-4 rounded-2xl border-3 border-[#0F172A] shadow-[4px_4px_0px_0px_#0F172A] ${
                  feedback.ok ? 'bg-[#10D989] text-[#0F172A]' : 'bg-[#FF4766] text-white'
                }`}
              >
                <div className="font-display text-2xl font-extrabold">{feedback.label}</div>
                <div className="text-sm font-bold mt-1">{feedback.sub}</div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <button
                type="button"
                onClick={() => handleAnswer('cap')}
                className="neo-btn bg-[#FBCFE8] hover:bg-[#FF4766] hover:text-white text-[#0F172A] font-display text-2xl font-extrabold py-5 px-6 rounded-3xl cursor-pointer"
              >
                Cap 🧢 (Mitos)
              </button>
              <button
                type="button"
                onClick={() => handleAnswer('fact')}
                className="neo-btn bg-[#A7F3D0] hover:bg-[#10D989] text-[#0F172A] font-display text-2xl font-extrabold py-5 px-6 rounded-3xl cursor-pointer"
              >
                Fact 📠 (Betul)
              </button>
            </div>
          </div>
        )}

        {/* END STATE: MASSIVE BADGE BESAR-BESAR */}
        {isDone && (
          <div className="neo-card-lg bg-[#FEF08A] rounded-3xl p-8 sm:p-12 text-center space-y-8 animate-fadeIn">
            <div className="max-w-lg mx-auto bg-[#10D989] border-4 border-[#0F172A] shadow-[10px_10px_0px_0px_#0F172A] rounded-3xl p-8 -rotate-1 space-y-3">
              <div className="inline-block bg-white border-2 border-[#0F172A] px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                🏅 ACHIEVEMENT UNLOCKED!
              </div>
              <div className="text-7xl sm:text-8xl emoji-3d py-2 animate-bounce">🏅🎉🔥</div>
              <h3 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0F172A] leading-none">
                GGWP! LENCANA TER-LOOT!
              </h3>
              <p className="text-sm font-extrabold text-[#0F172A]">
                Certified "Budak Financial Berilmu" · No More Noob Vibes ✅
              </p>
            </div>

            <p className="text-base sm:text-lg font-bold text-slate-800 max-w-lg mx-auto">
              Dah kenal Risk, Shares, Unit Trust & ETF. Jom masuk modul terakhir: pastikan pelaburan kau 100% Halal!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setQIndex(0);
                  setIsDone(false);
                  setQuizStarted(false);
                }}
                className="neo-btn bg-white px-6 py-4 rounded-2xl font-extrabold text-sm cursor-pointer"
              >
                🔄 Ulang Quiz
              </button>
              <button
                type="button"
                onClick={onNextTab}
                className="neo-btn bg-[#10D989] hover:bg-[#34D399] text-[#0F172A] font-display text-xl sm:text-2xl font-extrabold px-8 sm:px-10 py-5 rounded-3xl cursor-pointer shadow-[0_0_25px_rgba(16,217,137,0.5)]"
              >
                Proceed Ke Halal Ke Nah? 🕋 🚀
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
