# Random Arena

A creative random name picker built with **vanilla JavaScript**.  
Unlike traditional “wheel of names” tools, Random Arena uses **motion, timing, and spatial layouts** to create suspense.

Designed to be clean, hackable, and easy to extend inside **Cursor**.

---

## Live Demo
https://iso963.github.io

---

## Core Idea
Most random pickers rely on spinning wheels.  
Random Arena replaces the wheel with **three distinct arenas**, each using a different visual metaphor for randomness:

- Floating motion
- Rotational focus
- Vertical momentum

---

## Features
- Three randomization modes:
  - Floating Cards Arena
  - Hexagon Arena
  - Vertical Roulette
- Smooth slowdown animations for suspense
- Winner highlight & banner
- Edit names inline (double-click)
- Shuffle & clear controls
- Responsive dark / neon UI
- No frameworks, no dependencies

---

## Tech Stack
- HTML5
- CSS3 (animations, glassmorphism)
- Vanilla JavaScript (state-driven logic)

---

## Project Structure

---

## How It Works (Dev Notes)
- State is stored in a simple `names[]` array
- Arena rendering is mode-based:
  - `renderFloatingArena()`
  - `renderHexArena()`
  - `renderRouletteArena()`
- Each mode has its own animation logic:
  - `playFloatingAnimation()`
  - `playHexAnimation()`
  - `playRouletteAnimation()`
- Animations intentionally **slow down over time** to simulate randomness perception

---

## Running Locally
Just open `index.html` in a browser.  
No build step required.

---

## Why This Project
This project explores:
- How motion affects perceived randomness
- UI-driven suspense without heavy math
- Clean separation between state, render, and animation logic

---

## Ideas for Extension
- Persist names using `localStorage`
- Add sound design for winner reveal
- Introduce weighted randomness
- Add new arena modes

---

## License
MIT
