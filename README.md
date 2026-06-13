# 🎉 Truth or Dare — Party Game

A polished, feature-packed Truth or Dare party game built with React, Tailwind CSS, and Framer Motion. Neon-dark aesthetic, procedural sound effects, spinning wheel, 120+ questions — everything you need for game night.

![Setup](https://img.shields.io/badge/Players-2--10-00F5FF?style=flat-square)
![Questions](https://img.shields.io/badge/Questions-124+-FF2D78?style=flat-square)
![Modes](https://img.shields.io/badge/Modes-Mild%20%7C%20Spicy%20%7C%20Wild-FFD700?style=flat-square)

---

## ✨ Features

### Core Gameplay
- **Spin Wheel** — Canvas-rendered wheel with player colors, smooth deceleration easing, and particle trails
- **Truth or Dare** — Choose with satisfying neon button animations
- **Question Cards** — 3D card-flip reveal with category badges, difficulty stars (⭐), and action buttons
- **Scoring** — +10 for Done, -5 for Skip, tracked per player with live HUD
- **Rerolls** — 2 reroll tokens per player per game
- **Timer** — Optional SVG ring timer (15/30/60/90s) with red pulse warning at 10s

### 124+ Questions
| Tier | Truths | Dares |
|------|--------|-------|
| 🟢 Mild | 22 | 21 |
| 🟡 Spicy | 21 | 20 |
| 🔴 Wild | 20 | 20 |

Categories: Embarrassing, Relationships, Secrets, Opinions, Social, Funny, Creative, Wild

### Party Modes
- **Mild / Spicy / Wild** — Filter questions by intensity (Wild requires confirmation)
- **🔥 Hot Seat** — One unlucky player faces 3 back-to-back questions
- **🍻 Drinking Mode** — Adds "take a sip" overlay to dares
- **🃏 Wildcard** — 5% chance the wheel lands on a group dare everyone must do

### Polish
- **Procedural Sound FX** — Web Audio API generates spin tones, chimes, victory jingles, and buzzers — zero audio files
- **Confetti** — Physics-based DOM particle system, color-matched to the scoring player
- **Persistence** — Players, settings, and custom questions saved to localStorage with resume prompt
- **Question History** — Swipeable side drawer showing all past questions this session
- **Custom Questions** — Add your own truths and dares from the settings panel

### Leaderboard
- 👑 Champion spotlight with animated entrance
- 🥈🥉 Medal rankings with per-player stats (truths, dares, skips, completion %)
- Animated bar chart score comparison
- MVP awards: **Most Daring 🔥**, **Most Honest 💬**, **Biggest Skipper 😅**

---

## 🚀 Quick Start

```bash
# Clone & install
git clone <repo-url> && cd Truthndare
npm install

# Run dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── setup/          # PlayerSetup, PlayerCard, AvatarPicker
│   ├── game/           # GameBoard, SpinWheel, QuestionCard, PlayerHUD, TurnBanner, TimerRing
│   ├── ui/             # NeonButton, ScoreChip, Modal, ConfettiBlast
│   ├── settings/       # SettingsPanel
│   ├── results/        # Leaderboard
│   └── layout/         # AppShell (page transitions, history drawer)
├── hooks/
│   ├── useGameState.js # Context dispatch wrapper
│   ├── useSpinWheel.js # Wheel rotation + player selection
│   ├── useTimer.js     # Countdown with progress
│   ├── useSound.js     # Web Audio API procedural sounds
│   └── useConfetti.js  # DOM particle system
├── data/
│   ├── truths.js       # 63 truth questions
│   ├── dares.js        # 61 dare challenges
│   └── categories.js   # Category + difficulty config
├── context/
│   └── GameContext.jsx  # React Context + useReducer
├── utils/
│   ├── randomizer.js   # Question selection + wildcard rolls
│   ├── scoring.js      # MVP calculation, rankings
│   └── storage.js      # localStorage persistence
└── constants/
    └── gameConfig.js    # Colors, emojis, limits, storage keys
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#08080F` | Page background |
| `surface` | `#12121E` | Card backgrounds |
| `neonPink` | `#FF2D78` | Dare, skip, wild mode |
| `neonPurple` | `#9D00FF` | Truth, primary accent |
| `neonCyan` | `#00F5FF` | Start, next turn, timer |
| `neonGold` | `#FFD700` | Spin button, scores, champion |

**Fonts:** Righteous (display), Poppins (body), Space Mono (scores)

---

## ⚙️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 19 (hooks only) |
| Bundler | Vite |
| Styling | Tailwind CSS 3 via PostCSS |
| Animation | Framer Motion |
| Spin Wheel | Canvas API |
| Sound FX | Web Audio API (procedural) |
| State | React Context + useReducer |
| Persistence | localStorage |

Zero external runtime dependencies beyond React, Framer Motion, and Tailwind.

---

## ♿ Accessibility

- `prefers-reduced-motion` — disables particle effects, card flips, and bounce animations
- Keyboard navigable setup screen with visible `:focus-visible` outlines
- All interactive elements meet 48px minimum touch target
- High contrast text on neon backgrounds
- Semantic HTML with ARIA labels on icon-only buttons

---

## 📱 Responsive

Mobile-first layout optimized for phones at a party. Works in portrait and landscape. Player HUD collapses names on small screens while keeping emoji + score visible.

---

## 📄 License

MIT
