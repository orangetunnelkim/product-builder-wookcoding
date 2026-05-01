
const generateBtn = document.getElementById('generate-btn');
const numberElements = document.querySelectorAll('.number');

generateBtn.addEventListener('click', () => {
  const numbers = new Set();
  while (numbers.size < 6) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNumber);
  }

  const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

  numberElements.forEach((element, index) => {
    element.textContent = sortedNumbers[index];
  });
});
