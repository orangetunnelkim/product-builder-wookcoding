const URL = "https://teachablemachine.withgoogle.com/models/6DtRgJCTB/";
let model, webcam, labelContainer, maxPredictions;
let isWebcamMode = false;
let animationFrameId;

// Theme Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
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

// Load the model
async function loadModel() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
}

// UI Elements
const useUploadBtn = document.getElementById('use-upload');
const useWebcamBtn = document.getElementById('use-webcam');
const uploadSection = document.getElementById('upload-section');
const webcamSection = document.getElementById('webcam-section');
const uploadArea = document.getElementById('upload-area');
const imageUpload = document.getElementById('image-upload');
const resultArea = document.getElementById('result-area');
const faceImage = document.getElementById('face-image');
const webcamContainer = document.getElementById('webcam-container');
const webcamStartBtn = document.getElementById('webcam-start-btn');
const loadingMessage = document.getElementById('loading-message');
const retryBtn = document.getElementById('retry-btn');
labelContainer = document.getElementById('label-container');

// Mode Selection
useUploadBtn.addEventListener('click', () => {
  stopWebcam();
  isWebcamMode = false;
  useUploadBtn.classList.add('active');
  useWebcamBtn.classList.remove('active');
  uploadSection.style.display = 'block';
  webcamSection.style.display = 'none';
  resultArea.style.display = 'none';
});

useWebcamBtn.addEventListener('click', () => {
  isWebcamMode = true;
  useWebcamBtn.classList.add('active');
  useUploadBtn.classList.remove('active');
  webcamSection.style.display = 'block';
  uploadSection.style.display = 'none';
  resultArea.style.display = 'none';
});

// Upload Logic
uploadArea.addEventListener('click', () => imageUpload.click());
uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.style.backgroundColor = 'var(--number-bg)'; });
uploadArea.addEventListener('dragleave', () => { uploadArea.style.backgroundColor = 'transparent'; });
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.style.backgroundColor = 'transparent';
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) handleImage(file);
});
imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handleImage(file);
});

async function handleImage(file) {
  uploadSection.style.display = 'none';
  resultArea.style.display = 'block';
  faceImage.style.display = 'block';
  loadingMessage.style.display = 'block';
  labelContainer.innerHTML = '';
  
  const reader = new FileReader();
  reader.onload = async (e) => {
    faceImage.src = e.target.result;
    if (!model) await loadModel();
    predict(faceImage);
  };
  reader.readAsDataURL(file);
}

// Webcam Logic
webcamStartBtn.addEventListener('click', async () => {
  webcamStartBtn.disabled = true;
  webcamStartBtn.textContent = '카메라 켜는 중...';
  
  if (!model) await loadModel();
  
  const flip = true;
  webcam = new tmImage.Webcam(300, 300, flip);
  await webcam.setup();
  await webcam.play();
  
  webcamSection.style.display = 'none';
  resultArea.style.display = 'block';
  faceImage.style.display = 'none';
  webcamContainer.innerHTML = '';
  webcamContainer.appendChild(webcam.canvas);
  
  // For webcam mode, we show the live canvas in the result area
  document.getElementById('webcam-preview-placeholder').appendChild(webcam.canvas);
  
  animationFrameId = window.requestAnimationFrame(webcamLoop);
});

async function webcamLoop() {
  webcam.update();
  await predict(webcam.canvas);
  animationFrameId = window.requestAnimationFrame(webcamLoop);
}

function stopWebcam() {
  if (webcam) {
    webcam.stop();
    webcam = null;
  }
  if (animationFrameId) {
    window.cancelAnimationFrame(animationFrameId);
  }
  document.getElementById('webcam-preview-placeholder').innerHTML = '';
  webcamStartBtn.disabled = false;
  webcamStartBtn.textContent = '웹캠 시작하기';
}

// Prediction Logic
async function predict(input) {
  const prediction = await model.predict(input);
  loadingMessage.style.display = 'none';
  
  // Sort predictions
  prediction.sort((a, b) => b.probability - a.probability);

  // Clear or update bars
  if (!isWebcamMode) labelContainer.innerHTML = '';
  
  prediction.forEach((p, i) => {
    const classTitle = p.className;
    const probability = (p.probability * 100).toFixed(0);
    
    let barContainer = labelContainer.querySelector(`.bar-container[data-class="${classTitle}"]`);
    
    if (!barContainer) {
      barContainer = document.createElement('div');
      barContainer.className = 'bar-container';
      barContainer.setAttribute('data-class', classTitle);
      
      const label = document.createElement('div');
      label.className = 'bar-label';
      label.textContent = classTitle;
      
      const progressWrapper = document.createElement('div');
      progressWrapper.className = 'progress-wrapper';
      
      const progressBar = document.createElement('div');
      progressBar.className = `progress-bar ${classTitle.toLowerCase()}-bar`;
      
      const percent = document.createElement('span');
      percent.className = 'percent';
      
      progressWrapper.appendChild(progressBar);
      barContainer.appendChild(label);
      barContainer.appendChild(progressWrapper);
      barContainer.appendChild(percent);
      labelContainer.appendChild(barContainer);
    }
    
    const bar = barContainer.querySelector('.progress-bar');
    const pct = barContainer.querySelector('.percent');
    bar.style.width = `${probability}%`;
    pct.textContent = `${probability}%`;
  });
}

retryBtn.addEventListener('click', () => {
  stopWebcam();
  resultArea.style.display = 'none';
  if (isWebcamMode) {
    webcamSection.style.display = 'block';
  } else {
    uploadSection.style.display = 'block';
    imageUpload.value = '';
  }
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
