
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Hàm tạo ra một bộ màu. Nhận vào tham số là number. Number tương ứng với số cặp màu.
export const getRandomColorPairs = (count) => {
  // Danh sách hue list.
  const hueList = ['red', 'yellow', 'green', 'blue', 'pink', 'monochrome', 'goldenrod', 'purple']
  const colorList = [];

  // random count color
  for (let i = 0; i < count; i++) {
    const color = randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    });

    colorList.push(color);
  }

  // double current color list
  const fullColorList = [...colorList, ...colorList];

  // Shuffle color list
  shuffle(fullColorList);

  return fullColorList;
}