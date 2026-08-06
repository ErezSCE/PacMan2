# Requirements Traceability Matrix

**Agent**: conductor  
**Generated**: 2026-08-06T10:07:59.519Z

---

## Requirements Traceability Summary

| Metric | Value |
|--------|-------|
| Total acceptance criteria | 41 |
| Verified (merged + test passed) | 0 |
| Implemented but untested | 41 |
| Planned only (no merged PR) | 0 |
| Missing (no assignment) | 0 |
| Coverage | 0.0% |

## Traceability Matrix

| Epic | Story | AC# | Acceptance Criterion | Status | PRs | Tests |
|------|-------|-----|----------------------|--------|-----|-------|
| EPIC-001 | US-001 | 0 | Pac-Man moves continuously in the last direction pressed and stops only on wall collisions. | implemented-untested | #3 (merged) | -- |
| EPIC-001 | US-001 | 1 | Eating a dot increments the score by 10 and removes the dot from the maze. | implemented-untested | #3 (merged) | -- |
| EPIC-001 | US-001 | 2 | Eating a power pellet increments the score by 50, triggers scared mode for all ghosts, and plays the correct sound. | implemented-untested | #3 (merged) | -- |
| EPIC-001 | US-001 | 3 | When a non‑scared ghost collides with Pac-Man, a life is lost, a death animation plays, and the level resets with remaining dots intact. | implemented-untested | #3 (merged) | -- |
| EPIC-001 | US-001 | 4 | When all dots and pellets are cleared, the level‑complete screen appears and the next level starts. | implemented-untested | #3 (merged) | -- |
| EPIC-001 | US-002 | 0 | Each ghost alternates between chase and scatter modes based on the configured timers. | implemented-untested | #2 (merged) | -- |
| EPIC-001 | US-002 | 1 | When Pac-Man eats a power pellet, all ghosts enter scared state, reverse direction, and move at reduced speed. | implemented-untested | #2 (merged) | -- |
| EPIC-001 | US-002 | 2 | A scared ghost can be eaten, awarding escalating points (200, 400, 800, 1600) and triggering the eye‑return animation. | implemented-untested | #2 (merged) | -- |
| EPIC-001 | US-002 | 3 | Eaten ghosts' eyes travel back to the ghost house and the ghost respawns after a short delay. | implemented-untested | #2 (merged) | -- |
| EPIC-002 | US-003 | 0 | Pressing Arrow keys or WASD moves Pac‑Man in the corresponding direction. | implemented-untested | #5 (merged) | -- |
| EPIC-002 | US-003 | 1 | A swipe gesture on a touch device moves Pac‑Man in the swipe direction. | implemented-untested | #5 (merged) | -- |
| EPIC-002 | US-003 | 2 | On‑screen directional buttons are visible on touch devices and trigger movement when tapped. | implemented-untested | #5 (merged) | -- |
| EPIC-002 | US-003 | 3 | All input sources are normalized to a single directional command consumed by the game engine. | implemented-untested | #5 (merged) | -- |
| EPIC-003 | US-004 | 0 | Blinky always targets Pac‑Man's current tile. | implemented-untested | #11 (merged) | -- |
| EPIC-003 | US-004 | 1 | Pinky targets four tiles ahead of Pac‑Man's current direction. | implemented-untested | #11 (merged) | -- |
| EPIC-003 | US-004 | 2 | Inky uses a vector calculation based on Pac‑Man and Blinky positions. | implemented-untested | #11 (merged) | -- |
| EPIC-003 | US-004 | 3 | Clyde alternates between chasing Pac‑Man and wandering randomly when far from Pac‑Man. | implemented-untested | #11 (merged) | -- |
| EPIC-004 | US-005 | 0 | All defined sound effects (dot, pellet, ghost eat, death, fruit, extra life, siren) play at the correct game events. | implemented-untested | #4 (merged) | -- |
| EPIC-004 | US-005 | 1 | The mute toggle instantly silences or restores all audio and its state persists across level changes. | implemented-untested | #4 (merged) | -- |
| EPIC-004 | US-005 | 2 | The siren pitch increases as the number of remaining dots decreases, and resets each level. | implemented-untested | #4 (merged) | -- |
| EPIC-005 | US-006 | 0 | The start screen shows the game title, current high score list, and a start button. | implemented-untested | #6 (merged) | -- |
| EPIC-005 | US-006 | 1 | A 3‑2‑1‑GO countdown appears before gameplay begins. | implemented-untested | #6 (merged) | -- |
| EPIC-005 | US-006 | 2 | During gameplay the HUD continuously displays current score, high score, and remaining lives. | implemented-untested | #6 (merged) | -- |
| EPIC-005 | US-006 | 3 | Pressing the pause key shows a pause overlay that freezes the game loop. | implemented-untested | #6 (merged) | -- |
| EPIC-005 | US-006 | 4 | After clearing all dots, a level‑complete overlay appears briefly before the next level starts. | implemented-untested | #6 (merged) | -- |
| EPIC-005 | US-006 | 5 | On game over, the final score is shown, a high‑score entry form appears if applicable, and a restart option is available. | implemented-untested | #6 (merged) | -- |
| EPIC-006 | US-007 | 0 | High scores are stored in IndexedDB and loaded when the game starts. | implemented-untested | #7 (merged) | -- |
| EPIC-006 | US-007 | 1 | When a new score qualifies for the top‑10, the player can enter three initials and the list updates accordingly. | implemented-untested | #7 (merged) | -- |
| EPIC-006 | US-007 | 2 | The high‑score list persists after closing and reopening the browser. | implemented-untested | #7 (merged) | -- |
| EPIC-007 | US-008 | 0 | All static assets (HTML, JS, CSS, images, audio) are cached by the service worker on first visit. | implemented-untested | #8 (merged) | -- |
| EPIC-007 | US-008 | 1 | When the network is unavailable, the game loads from the cache and functions identically. | implemented-untested | #8 (merged) | -- |
| EPIC-007 | US-008 | 2 | A new deployment triggers an updated cache and the service worker serves the latest version. | implemented-untested | #8 (merged) | -- |
| EPIC-008 | US-009 | 0 | All interactive elements (menus, buttons, toggles) are reachable via Tab/Shift+Tab and have a visible focus outline. | implemented-untested | #13 (merged) | -- |
| EPIC-008 | US-009 | 1 | ARIA labels describe the purpose of each control for screen readers. | implemented-untested | #13 (merged) | -- |
| EPIC-008 | US-009 | 2 | Activating the color‑blind toggle swaps ghost colors to a palette that meets WCAG contrast requirements. | implemented-untested | #13 (merged) | -- |
| EPIC-009 | US-010 | 0 | The game canvas scales proportionally between 375 px and 2560 px while maintaining aspect ratio. | implemented-untested | #10 (merged) | -- |
| EPIC-009 | US-010 | 1 | On touch devices, directional buttons appear overlayed on the canvas and trigger movement when tapped. | implemented-untested | #10 (merged) | -- |
| EPIC-009 | US-010 | 2 | Swipe gestures move Pac‑Man in the swipe direction on all supported mobile browsers. | implemented-untested | #10 (merged) | -- |
| EPIC-010 | US-011 | 0 | Each level has its own configuration that increases ghost speed, shortens scared timers, and adjusts chase/scatter ratios. | implemented-untested | #9 (merged) | -- |
| EPIC-010 | US-011 | 1 | After completing level 20, the game restarts at level 1 with the highest difficulty settings retained. | implemented-untested | #9 (merged) | -- |
| EPIC-010 | US-011 | 2 | Score bonuses (extra life at 10,000 points) continue to work across all levels. | implemented-untested | #9 (merged) | -- |

## Orphaned Assignments (storyId matches no user story -- invented work)

- ASSIGN-001
- ASSIGN-002
- ASSIGN-003
- ASSIGN-004
- ASSIGN-005
- BUGFIX-1-ASSIGN-059
- BUGFIX-1-ASSIGN-060
- BUGFIX-1-ASSIGN-061

