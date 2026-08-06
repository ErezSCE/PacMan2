import styles from './start-screen.module.css';

export interface HighScore {
  initials: string;
  score: number;
}

/**
 * Creates the Start Screen element.
 * @param highScores List of high scores to display (max 10).
 * @param onStart Callback invoked when the Start button is clicked.
 */
export function createStartScreen(
  highScores: HighScore[],
  onStart: () => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = styles.container;

  const title = document.createElement('h1');
  title.className = styles.title;
  title.textContent = 'Pac‑Man';
  container.appendChild(title);

  const list = document.createElement('ol');
  list.className = styles.highScoreList;
  highScores.slice(0, 10).forEach(({ initials, score }) => {
    const li = document.createElement('li');
    li.className = styles.highScoreItem;
    li.textContent = `${initials} – ${score}`;
    list.appendChild(li);
  });
  container.appendChild(list);

  const button = document.createElement('button');
  button.className = styles.startButton;
  button.textContent = 'Start';
  button.type = 'button';
  button.addEventListener('click', onStart);
  container.appendChild(button);

  return container;
}
