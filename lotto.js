const generateBtn = document.getElementById('generate-btn');
const numberElements = document.querySelectorAll('.number');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Theme Logic
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
  body.classList.add('dark-mode');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    themeToggle.textContent = '☀️';
  } else {
    localStorage.setItem('theme', 'light');
    themeToggle.textContent = '🌙';
  }
});

// Lotto Logic
generateBtn.addEventListener('click', () => {
  const numbers = new Set();
  while (numbers.size < 6) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNumber);
  }
  const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
  numberElements.forEach((element, index) => {
    element.style.transform = 'scale(1.2)';
    setTimeout(() => {
      element.textContent = sortedNumbers[index];
      element.style.transform = 'scale(1)';
    }, 100);
  });
});

// Form Submission Logic
const partnershipForm = document.getElementById('partnership-form');
const submitBtn = document.getElementById('submit-btn');

if (partnershipForm) {
  partnershipForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(partnershipForm);
    const data = Object.fromEntries(formData.entries());
    submitBtn.disabled = true;
    submitBtn.textContent = '보내는 중...';
    try {
      const response = await fetch(partnershipForm.action, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        partnershipForm.innerHTML = '<div style="text-align: center; padding: 20px;"><h3>감사합니다!</h3><p>문의가 성공적으로 접수되었습니다.</p></div>';
      } else {
        alert('오류가 발생했습니다.');
        submitBtn.disabled = false;
        submitBtn.textContent = '보내기';
      }
    } catch (error) {
      alert('통신 중 오류가 발생했습니다.');
      submitBtn.disabled = false;
      submitBtn.textContent = '보내기';
    }
  });
}
