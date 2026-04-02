const BACKEND_URL = 'http://127.0.0.1:5050';
const fileInput        = document.getElementById('fileInput');
const analyzeBtn       = document.getElementById('analyzeBtn');
const thumbImg         = document.getElementById('thumbImg');
const thumbPlaceholder = document.getElementById('thumbPlaceholder');
const stateUpload    = document.getElementById('stateUpload');
const stateAnalyzing = document.getElementById('stateAnalyzing');
const stateResult    = document.getElementById('stateResult');
const diseaseNameEl  = document.getElementById('diseaseName');
const confBadgeEl    = document.getElementById('confBadge');
const confFillEl     = document.getElementById('confFill');
const confPctEl      = document.getElementById('confPct');
const advisoryBodyEl = document.getElementById('advisoryBody');
const top3ListEl = document.createElement('div');
top3ListEl.className = 'top3-list';
confPctEl.parentElement.after(top3ListEl);
function showState(name) {
  stateUpload   .classList.add('hidden');
  stateAnalyzing.classList.add('hidden');
  stateResult   .classList.add('hidden');
  const target = document.getElementById('state' + name);
  target.classList.remove('hidden');
  target.style.animation = 'fadeIn 0.5s ease-out both';
}
async function analyze() {
  const file = fileInput.files[0];
  if (!file) return;
  showState('Analyzing');
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await fetch(`${BACKEND_URL}/predict`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Backend error');
    const disease    = data.disease    || 'Unknown';
    const confidence = parseFloat(data.confidence) || 0;
    const advisory   = data.gist || data.advisory || 'No advisory available.';
    const top3       = data.top3 || [];
    diseaseNameEl.textContent = disease;
    confBadgeEl.textContent   = confidence + '%';
    confPctEl.textContent     = confidence + '%';
    renderTop3(top3);
    renderAdvisory(advisory);
    showState('Result');
    requestAnimationFrame(() => {
      setTimeout(() => {
         confFillEl.style.width = confidence + '%';
      }, 100);
    });

  } catch (err) {
    showState('Upload');
    alert('Error: ' + err.message);
    console.error(err);
  }
}
function renderTop3(list) {
  top3ListEl.innerHTML = '';
  list.forEach(item => {
    const div = document.createElement('div');
    div.className = 'top3-item';
    div.innerHTML = `
      <span class="top3-name">${item.disease}</span>
      <span class="top3-bar-wrap"><span class="top3-bar" style="width: ${item.confidence}%"></span></span>
      <span class="top3-val">${item.confidence}%</span>
    `;
    top3ListEl.appendChild(div);
  });
}
function renderAdvisory(text) {
  advisoryBodyEl.replaceChildren();
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (!lines.length) lines.push('No advisory available.');
   lines.forEach((line, i) => {
    const el = document.createElement('div');
    el.className = 'advisory-line';
    el.style.animationDelay = (i * 0.07) + 's';
    el.textContent = line;
    advisoryBodyEl.appendChild(el);
  });
}
function resetUI() {
  fileInput.value = '';
  thumbImg.src = '';
  thumbImg.style.display = 'none';
  thumbPlaceholder.style.display = 'flex';
  confFillEl.style.transition = 'none';
  confFillEl.style.width = '0%';
  requestAnimationFrame(() => { confFillEl.style.transition = ''; });
  diseaseNameEl.textContent = '—';
  confBadgeEl.textContent   = '—';
  confPctEl.textContent     = '—';
  advisoryBodyEl.replaceChildren();
  analyzeBtn.disabled = true;
  showState('Upload');
}
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ex) => {
      thumbImg.src = ex.target.result;
      thumbImg.style.display = 'block';
      thumbPlaceholder.style.display = 'none';
      analyzeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }
});
analyzeBtn.addEventListener('click', analyze);
document.getElementById('uploadBtn').addEventListener('click', () => fileInput.click());
document.getElementById('thumbZone').addEventListener('click',  () => fileInput.click());
document.getElementById('resetBtn').addEventListener('click', resetUI);
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 14;
  const y = (e.clientY / window.innerHeight - 0.5) * 14;
  const img = document.querySelector('.bg-img');
  if (img) img.style.transform = `scale(1.1) translate(${x}px,${y}px)`;
});

const fileInput        = document.getElementById('fileInput');
const analyzeBtn       = document.getElementById('analyzeBtn');
const thumbImg         = document.getElementById('thumbImg');
const thumbPlaceholder = document.getElementById('thumbPlaceholder');
const stateUpload    = document.getElementById('stateUpload');
const stateAnalyzing = document.getElementById('stateAnalyzing');
const stateResult    = document.getElementById('stateResult');
const diseaseNameEl  = document.getElementById('diseaseName');
const confBadgeEl    = document.getElementById('confBadge');
const confFillEl     = document.getElementById('confFill');
const confPctEl      = document.getElementById('confPct');
const advisoryBodyEl = document.getElementById('advisoryBody');
const top3ListEl = document.createElement('div');
top3ListEl.className = 'top3-list';
confPctEl.parentElement.after(top3ListEl);
function showState(name) {
  stateUpload   .classList.add('hidden');
  stateAnalyzing.classList.add('hidden');
  stateResult   .classList.add('hidden');
  const target = document.getElementById('state' + name);
  target.classList.remove('hidden');
  target.style.animation = 'fadeIn 0.5s ease-out both';
}
async function analyze() {
  const file = fileInput.files[0];
  if (!file) return;
  showState('Analyzing');
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await fetch(`${BACKEND_URL}/predict`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Backend error');
    const disease    = data.disease    || 'Unknown';
    const confidence = parseFloat(data.confidence) || 0;
    const advisory   = data.gist || data.advisory || 'No advisory available.';
    const top3       = data.top3 || [];
    diseaseNameEl.textContent = disease;
    confBadgeEl.textContent   = confidence + '%';
    confPctEl.textContent     = confidence + '%';
    renderTop3(top3);
    renderAdvisory(advisory);
    showState('Result');
    requestAnimationFrame(() => {
      setTimeout(() => {
         confFillEl.style.width = confidence + '%';
      }, 100);
    });

  } catch (err) {
    showState('Upload');
    alert('Error: ' + err.message);
    console.error(err);
  }
}
function renderTop3(list) {
  top3ListEl.innerHTML = '';
  list.forEach(item => {
    const div = document.createElement('div');
    div.className = 'top3-item';
    div.innerHTML = `
      <span class="top3-name">${item.disease}</span>
      <span class="top3-bar-wrap"><span class="top3-bar" style="width: ${item.confidence}%"></span></span>
      <span class="top3-val">${item.confidence}%</span>
    `;
    top3ListEl.appendChild(div);
  });
}
function renderAdvisory(text) {
  advisoryBodyEl.replaceChildren();
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (!lines.length) lines.push('No advisory available.');
   lines.forEach((line, i) => {
    const el = document.createElement('div');
    el.className = 'advisory-line';
    el.style.animationDelay = (i * 0.07) + 's';
    el.textContent = line;
    advisoryBodyEl.appendChild(el);
  });
}
function resetUI() {
  fileInput.value = '';
  thumbImg.src = '';
  thumbImg.style.display = 'none';
  thumbPlaceholder.style.display = 'flex';
  confFillEl.style.transition = 'none';
  confFillEl.style.width = '0%';
  requestAnimationFrame(() => { confFillEl.style.transition = ''; });
  diseaseNameEl.textContent = '—';
  confBadgeEl.textContent   = '—';
  confPctEl.textContent     = '—';
  advisoryBodyEl.replaceChildren();
  analyzeBtn.disabled = true;
  showState('Upload');
}
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ex) => {
      thumbImg.src = ex.target.result;
      thumbImg.style.display = 'block';
      thumbPlaceholder.style.display = 'none';
      analyzeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }
});
analyzeBtn.addEventListener('click', analyze);
document.getElementById('uploadBtn').addEventListener('click', () => fileInput.click());
document.getElementById('thumbZone').addEventListener('click',  () => fileInput.click());
document.getElementById('resetBtn').addEventListener('click', resetUI);
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 14;
  const y = (e.clientY / window.innerHeight - 0.5) * 14;
  const img = document.querySelector('.bg-img');
  if (img) img.style.transform = `scale(1.1) translate(${x}px,${y}px)`;
});
