# Product Manager Mission Report

**Agent**: product-manager  
**Generated**: 2026-08-06T09:02:43.848Z

---

## User Stories (11)

### US-001: As a player, I want Pac-Man to move through the maze, eat dots and power pellets, gain points, lose lives when caught, and complete levels
- So that: I can experience the core classic gameplay
- AC: Pac-Man moves continuously in the last direction pressed and stops only on wall collisions.; Eating a dot increments the score by 10 and removes the dot from the maze.; Eating a power pellet increments the score by 50, triggers scared mode for all ghosts, and plays the correct sound.; When a non‑scared ghost collides with Pac-Man, a life is lost, a death animation plays, and the level resets with remaining dots intact.; When all dots and pellets are cleared, the level‑complete screen appears and the next level starts.
### US-002: As a player, I want ghosts to chase, scatter, become scared, and return to the ghost house when eaten
- So that: the game provides challenge and authentic Pac‑Man behavior
- AC: Each ghost alternates between chase and scatter modes based on the configured timers.; When Pac-Man eats a power pellet, all ghosts enter scared state, reverse direction, and move at reduced speed.; A scared ghost can be eaten, awarding escalating points (200, 400, 800, 1600) and triggering the eye‑return animation.; Eaten ghosts' eyes travel back to the ghost house and the ghost respawns after a short delay.
### US-003: As a player, I want to control Pac-Man using keyboard, WASD, touch swipes, and on‑screen directional buttons
- So that: I can play comfortably on desktop and mobile devices
- AC: Pressing Arrow keys or WASD moves Pac‑Man in the corresponding direction.; A swipe gesture on a touch device moves Pac‑Man in the swipe direction.; On‑screen directional buttons are visible on touch devices and trigger movement when tapped.; All input sources are normalized to a single directional command consumed by the game engine.
### US-004: As a player, I want each ghost to have its own personality and targeting logic
- So that: the chase feels varied and true to the original game
- AC: Blinky always targets Pac‑Man's current tile.; Pinky targets four tiles ahead of Pac‑Man's current direction.; Inky uses a vector calculation based on Pac‑Man and Blinky positions.; Clyde alternates between chasing Pac‑Man and wandering randomly when far from Pac‑Man.
### US-005: As a player, I want sound effects and background music with mute control and dynamic siren pitch
- So that: audio enhances the gameplay experience
- AC: All defined sound effects (dot, pellet, ghost eat, death, fruit, extra life, siren) play at the correct game events.; The mute toggle instantly silences or restores all audio and its state persists across level changes.; The siren pitch increases as the number of remaining dots decreases, and resets each level.
### US-006: As a player, I want clear screens and HUD elements for start, countdown, gameplay, pause, level complete, and game over with high‑score entry
- So that: I always know my status and can navigate the game flow
- AC: The start screen shows the game title, current high score list, and a start button.; A 3‑2‑1‑GO countdown appears before gameplay begins.; During gameplay the HUD continuously displays current score, high score, and remaining lives.; Pressing the pause key shows a pause overlay that freezes the game loop.; After clearing all dots, a level‑complete overlay appears briefly before the next level starts.; On game over, the final score is shown, a high‑score entry form appears if applicable, and a restart option is available.
### US-007: As a player, I want my top‑10 scores to be saved between sessions
- So that: I can track my achievements over time
- AC: High scores are stored in IndexedDB and loaded when the game starts.; When a new score qualifies for the top‑10, the player can enter three initials and the list updates accordingly.; The high‑score list persists after closing and reopening the browser.
### US-008: As a user, I want the game to work offline after the first load
- So that: I can play without an internet connection
- AC: All static assets (HTML, JS, CSS, images, audio) are cached by the service worker on first visit.; When the network is unavailable, the game loads from the cache and functions identically.; A new deployment triggers an updated cache and the service worker serves the latest version.
### US-009: As a user with accessibility needs, I want full keyboard navigation, visible focus indicators, ARIA labels, and a color‑blind mode
- So that: the game is usable and comfortable for me
- AC: All interactive elements (menus, buttons, toggles) are reachable via Tab/Shift+Tab and have a visible focus outline.; ARIA labels describe the purpose of each control for screen readers.; Activating the color‑blind toggle swaps ghost colors to a palette that meets WCAG contrast requirements.
### US-010: As a mobile player, I want the canvas to resize responsively and on‑screen controls to appear, with reliable swipe gestures
- So that: the game fits my device screen and I can play comfortably on touch devices
- AC: The game canvas scales proportionally between 375 px and 2560 px while maintaining aspect ratio.; On touch devices, directional buttons appear overlayed on the canvas and trigger movement when tapped.; Swipe gestures move Pac‑Man in the swipe direction on all supported mobile browsers.
### US-011: As a player, I want progressively harder levels up to at least 20, with looping after level 20
- So that: the challenge increases and the game remains engaging
- AC: Each level has its own configuration that increases ghost speed, shortens scared timers, and adjusts chase/scatter ratios.; After completing level 20, the game restarts at level 1 with the highest difficulty settings retained.; Score bonuses (extra life at 10,000 points) continue to work across all levels.

## Tasks (58)

- **TASK-001** [infra/Vite] Initialize Vite + TypeScript project
- **TASK-002** [infra/npm] Install core dependencies
- **TASK-003** [infra/ESLint, Prettier, husky] Configure ESLint and Prettier
- **TASK-004** [infra/GitHub Actions] Create GitHub Actions CI workflow
- **TASK-005** [frontend/TypeScript, Canvas API] Design maze data structure and rendering logic
- **TASK-006** [frontend/TypeScript] Implement Pac‑Man movement and wall collision
- **TASK-007** [frontend/TypeScript] Handle dot and power‑pellet consumption
- **TASK-008** [frontend/TypeScript, Canvas] Implement lives system and death animation
- **TASK-009** [frontend/TypeScript] Detect level completion and trigger transition
- **TASK-010** [testing/Jest] Write unit tests for movement and collision
- **TASK-011** [frontend/TypeScript] Create Ghost base class and state machine
- **TASK-012** [frontend/TypeScript] Implement chase/scatter timer logic
- **TASK-013** [frontend/TypeScript] Add scared‑state behavior (speed reduction, reverse direction)
- **TASK-014** [frontend/TypeScript, Canvas] Implement eye‑return animation after ghost is eaten
- **TASK-015** [testing/@testing-library/dom] Integration tests for ghost state transitions
- **TASK-016** [frontend/TypeScript] Build keyboard input handler (arrow keys & WASD)
- **TASK-017** [frontend/TypeScript] Implement touch swipe detection
- **TASK-018** [frontend/CSS Modules, TypeScript] Create on‑screen directional button UI
- **TASK-019** [testing/Jest] Write unit tests for Input Handler normalization
- **TASK-020** [frontend/TypeScript] Implement Blinky’s direct chase logic
- **TASK-021** [frontend/TypeScript] Implement Pinky’s four‑tile‑ahead targeting
- **TASK-022** [frontend/TypeScript] Implement Inky’s vector‑based targeting
- **TASK-023** [frontend/TypeScript] Implement Clyde’s conditional chase/wander behavior
- **TASK-024** [frontend/TypeScript] Track and apply ghost‑eaten point escalation
- **TASK-025** [testing/Jest] Write tests for each ghost personality logic
- **TASK-026** [frontend/Web Audio API, TypeScript] Develop Audio Manager service using Web Audio API
- **TASK-027** [frontend/TypeScript] Integrate Audio Manager with Asset Loader for pre‑loading
- **TASK-028** [frontend/CSS Modules, TypeScript] Add mute toggle UI and persistence
- **TASK-029** [frontend/Web Audio API] Implement dynamic siren pitch based on remaining dots
- **TASK-030** [testing/Jest] Write unit tests for Audio Manager playback and mute
- **TASK-031** [frontend/TypeScript, CSS Modules] Create Start Screen component with title and high‑score list
- **TASK-032** [frontend/TypeScript, Canvas] Implement Countdown overlay (3‑2‑1‑GO)
- **TASK-033** [frontend/TypeScript, Canvas] Build HUD component (score, high score, lives)
- **TASK-034** [frontend/TypeScript, Canvas] Implement Pause overlay with resume button
- **TASK-035** [frontend/TypeScript, Canvas] Create Level‑Complete transition screen
- **TASK-036** [frontend/TypeScript, CSS Modules] Develop Game Over screen with high‑score entry form
- **TASK-037** [testing/@testing-library/dom] End‑to‑end tests for UI flow
- **TASK-038** [db/idb] Implement HighScore Store with idb
- **TASK-039** [frontend/TypeScript] Expose CRUD API to UI components
- **TASK-040** [db/idb] Seed initial high‑score data on first launch
- **TASK-041** [testing/Jest] Write tests for HighScore Store operations
- **TASK-042** [infra/Workbox, Vite] Configure Workbox plugin in Vite
- **TASK-043** [infra/Workbox] Define caching strategies for static and audio assets
- **TASK-044** [infra/Workbox] Implement runtime cache update on new deployment
- **TASK-045** [testing/Puppeteer] Integration test for offline functionality
- **TASK-046** [frontend/TypeScript, CSS Modules] Add ARIA labels to all menu and control elements
- **TASK-047** [frontend/CSS Modules] Implement visible focus styles via CSS Modules
- **TASK-048** [frontend/TypeScript, CSS Modules] Create Color‑Blind mode toggle and palette swap
- **TASK-049** [frontend/TypeScript] Ensure full keyboard navigation across UI screens
- **TASK-050** [testing/axe-core, Jest] Accessibility tests using axe-core
- **TASK-051** [frontend/TypeScript, Canvas] Make Canvas responsive to window resize
- **TASK-052** [frontend/TypeScript, CSS Modules] Show/hide on‑screen directional buttons based on touch capability
- **TASK-053** [frontend/TypeScript] Normalize swipe gestures across browsers
- **TASK-054** [testing/Playwright] Visual regression tests for multiple breakpoints
- **TASK-055** [frontend/TypeScript] Create level configuration data set (20 levels)
- **TASK-056** [frontend/TypeScript] Implement level progression and looping logic
- **TASK-057** [frontend/TypeScript] Adjust ghost speed and timers per level
- **TASK-058** [testing/Jest] Tests verifying difficulty scaling across levels
