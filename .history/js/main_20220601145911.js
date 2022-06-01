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

  // Start countdown. Hàm chạy thời gian đếm ngược.
  const startCountdown = () => {

    // Giá trị giảm dần từ biến timer
    countdownInterval = setInterval(() => {
      // Set DOM. 
      timerElement.textContent = `${timer}s`;
      timer--;

      // Khi hết thời gian thì chuyển trang thái game về FINISHED. ClearInterval. Gán text cho  timerElement là Game Over!. Hiện button
      if (timer === -1) {
        gameState = GAME_STATE.FINISHED;
        clearInterval(countdownInterval);

        timerElement.textContent = 'Game Over!';
        playAgainButton.style.display = 'block';
      };
    }, 1000);
  }


  // Handle play again button. Khi click button thì gọi hàm reset và chạy lại hàm init
  playAgainButton.addEventListener('click', e => {
    reset();
    init();
  });

  // Hàm xử lý khi onclick thẻ li
  const handleColorClick = (item, idx) => {
    // Các trường hợp ko xử lý gì. item không tồn tại, có chứa class active, trang thái là BLOCKING và FINISHED, khi time chạy về 0.
    if (
      !item
      || item.classList.contains('active')
      || gameState === GAME_STATE.BLOCKING
      || gameState === GAME_STATE.FINISHED
      || timer < 0
    ) return;

    // Add item to selection. Biến lưu chữ vị trí click selection nhận giá trị. thẻ li được add class active. Nếu trong mảng selection có 2 phần tử thì mới thực hiện được tiếp xuống dưới. 
    selection.push(idx);
    item.classList.add('active');
    console.log(selection.length)
    if (selection.length < 2) return;

    // Check matching when two colors selected. Kiểm tra xem hai màu vừa được chọn có cùng màu ko.
    const firstColor = randomColorList[selection[0]];
    const secondColor = randomColorList[selection[1]];
    const isMatch = firstColor === secondColor;

    // in case not match, clear selection and remove active class from selected items. Nếu không trùng thì thực hiện những thứ sau.
    if (!isMatch) {
      // Chuyển trạng thái sang BLOCKING. Không thể chọn được nữa
      gameState = GAME_STATE.BLOCKING;
      // Set thời gian gỡ trạng thái active và khởi tạo lại selection. Điều này tương ứng với nếu như trùng thì class active không bị gỡ bỏ và các ô trùng sẽ hiện.
      setTimeout(() => {
        colorItemList[selection[0]].classList.remove('active');
        colorItemList[selection[1]].classList.remove('active');

        selection = [];
        gameState = GAME_STATE.PLAYING;
      }, 500);
      return;
    }

    // in case of match, clear selection but keep active class. Nếu trùng thì sẽ đi đến dưới này. Tăng matchCount lên( khi đạt đủ 8 cặp là win)
    matchCount++;
    // Reset để thực hiện lựa chọn cặp tiếp theo.
    selection = [];
    // Lấy màu trùng vừa xét được đưa làm màu nền
    colorBackground.style.backgroundColor = randomColorList[idx];

    // Check win state. Kiểm tra xem đã win chưa thông qua biến matchCount.
    if (matchCount === PAIRS_COUNT) {
      // Stop timer. Win rồi thì dừng luôn setInterval không cần chạy hết thời gian nữa.
      clearInterval(countdownInterval);
      // Báo win lên.
      timerElement.textContent = 'You WIN! 😍';
      // Hiện button
      playAgainButton.style.display = 'block';
      // Chuyển trạng thái sang FINISHED
      gameState === GAME_STATE.FINISHED;
    }
  }


  // MAIN LOGIC
  init();
};

main();
