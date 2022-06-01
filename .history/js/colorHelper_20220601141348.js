
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

  // random count color. Ứng với mỗi count sẽ tạo ra một màu.
  for (let i = 0; i < count; i++) {
    // Dùng hàm randomColor được cài vào để random màu
    const color = randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    });
    // Đưa màu lấy được đưa vào danh sách màu
    colorList.push(color);
  }

  // double current color list. Tạo danh sách cặp màu bằng spead array. Tuy nhiên nó lại theo thứ tự nên không được.
  const fullColorList = [...colorList, ...colorList];

  // Shuffle color list. Dùng shuffle để random vị trí phần tử trong mảng.
  shuffle(fullColorList);

  return fullColorList;
}