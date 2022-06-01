import { getRandomColorPairs } from "./colorHelper.js";

const GAME_STATE = {
  PENDING: 'pending',
  PLAYING: 'playing',
  BLOCKING: 'blocking',
  FINISHED: 'finished'
}

const main = () => {
  // Game state
  const PAIRS_COUNT = 8;
  const GAME_TIME = 30;

  let selection = [];
  let gameState = GAME_STATE.PENDING;
  let timer = GAME_TIME; // seconds
  let matchCount = 0;
  let countdownInterval = null;
  let randomColorList = [];

  // Query elements. Trỏ vào các phần tử trên DOM
  const colorItemList = document.querySelectorAll('#colorList > li');
  const timerElement = document.querySelector('.game .game__timer');
  const playAgainButton = document.querySelector('.game .game__button');
  const colorBackground = document.querySelector('.color-background');

  const init = () => {
    // Biến chứa danh sách những cặp màu. Với giá trị truyền vào là 8. 8 cặp màu cho 16 phần tử
    randomColorList = getRandomColorPairs(PAIRS_COUNT);

    // Binding events. Duyệt qua các phần tử li trong thẻ ul và remove class active.
    colorItemList.forEach((item, idx) => {
      item.classList.remove('active');

      // Trỏ đến thẻ đến the div tương ứng của thẻ li. style backgroundColor lấy màu theo index trong danh sách cặp màu.
      const overlayElement = item.querySelector('.overlay');
      if (overlayElement) {
        overlayElement.style.backgroundColor = randomColorList[idx];
      }

      // Gán sự kiện onclick cho thẻ li
      item.addEventListener('click', () => handleColorClick(item, idx));
    });

    // Start count down 
    startCountdown();
  }

  // Hàm xử lý reset game
  const reset = () => {
    // Reset game state. Chuyển tất cả state về mặc định
    selection = [];
    gameState = GAME_STATE.PENDING;
    timer = GAME_TIME;
    matchCount = 0;

    timerElement.textContent = `${GAME_TIME}s`;
    colorBackground.style.backgroundColor = 'goldenrod';

    // Hide play again button. Ẩn đi button
    playAgainButton.style.display = 'none';
  }

  // Start countdown
  const startCountdown = () => {
    countdownInterval = setInterval(() => {
      // Set DOM
      timerElement.textContent = `${timer}s`;
      timer--;

      if (timer === -1) {
        gameState = GAME_STATE.FINISHED;
        clearInterval(countdownInterval);

        timerElement.textContent = 'Game Over!';
        playAgainButton.style.display = 'block';
      };
    }, 1000);
  }


  // Handle play again button
  playAgainButton.addEventListener('click', e => {
    reset();
    init();
  });


  const handleColorClick = (item, idx) => {
    if (
      !item
      || item.classList.contains('active')
      || gameState === GAME_STATE.BLOCKING
      || gameState === GAME_STATE.FINISHED
      || timer < 0
    ) return;

    // Add item to selection
    selection.push(idx);
    item.classList.add('active');
    if (selection.length < 2) return;

    // Check matching when two colors selected
    const firstColor = randomColorList[selection[0]];
    const secondColor = randomColorList[selection[1]];
    const isMatch = firstColor === secondColor;

    // in case not match, clear selection and remove active class from selected items
    if (!isMatch) {
      gameState = GAME_STATE.BLOCKING;
      setTimeout(() => {
        colorItemList[selection[0]].classList.remove('active');
        colorItemList[selection[1]].classList.remove('active');

        selection = [];
        gameState = GAME_STATE.PLAYING;
      }, 500);
      return;
    }

    // in case of match, clear selection but keep active class
    matchCount++;
    selection = [];
    colorBackground.style.backgroundColor = randomColorList[idx];

    // Check win state
    if (matchCount === PAIRS_COUNT) {
      // Stop timer
      clearInterval(countdownInterval);

      timerElement.textContent = 'You WIN! 😍';
      playAgainButton.style.display = 'block';
      gameState === GAME_STATE.FINISHED;
    }
  }


  // MAIN LOGIC
  init();
};

main();
