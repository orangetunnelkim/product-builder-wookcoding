const recommendBtn = document.getElementById('recommend-btn');
const menuDisplay = document.getElementById('menu-display');
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

// Menu Recommendation Logic
function recommendMenu() {
  const menus = [
    "치킨 🍗",
    "피자 🍕",
    "삼겹살 🥓",
    "김치찌개 🥘",
    "햄버거 🍔",
    "초밥 🍣",
    "파스타 🍝",
    "라면 🍜",
    "떡볶이 🥘",
    "돈까스 🍱"
  ];

  // Add a simple animation effect
  menuDisplay.style.transform = 'scale(1.1)';
  menuDisplay.style.opacity = '0.5';
  
  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * menus.length);
    menuDisplay.innerText = menus[randomIndex];
    menuDisplay.style.transform = 'scale(1)';
    menuDisplay.style.opacity = '1';
  }, 150);
}

if (recommendBtn) {
  recommendBtn.addEventListener('click', recommendMenu);
}

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
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        partnershipForm.innerHTML = '<div style="text-align: center; padding: 20px;"><h3>감사합니다!</h3><p>문의가 성공적으로 접수되었습니다.</p></div>';
      } else {
        alert('오류가 발생했습니다.');
        submitBtn.disabled = false;
        submitBtn.textContent = '문의하기';
      }
    } catch (error) {
      alert('통신 중 오류가 발생했습니다.');
      submitBtn.disabled = false;
      submitBtn.textContent = '문의하기';
    }
  });
}
