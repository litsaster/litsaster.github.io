
// ========== PARTICLE BACKGROUND ==========
const particleCanvas = document.getElementById('particleCanvas');
let particleCtx = particleCanvas.getContext('2d');
let particles = [];
let particleFrame;

function resizeParticleCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}

class Star {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.baseSize = Math.random() * 2 + 0.5;
        this.size = this.baseSize;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.baseOpacity = Math.random() * 0.5 + 0.1;
        this.opacity = this.baseOpacity;
        this.glowing = false;
        this.glowPhase = 0;
        this.glowDuration = 0;
        this.glowMaxSize = 0;
    }
    startGlow() {
        this.glowing = true;
        this.glowPhase = 0;
        this.glowDuration = 30 + Math.floor(Math.random() * 40);
        this.glowMaxSize = this.baseSize * (2 + Math.random() * 3);
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < -20 || this.x > particleCanvas.width + 20 || this.y < -20 || this.y > particleCanvas.height + 20) this.reset();

        if (this.glowing) {
            this.glowPhase++;
            const progress = this.glowPhase / this.glowDuration;
            if (progress >= 1) {
                this.glowing = false;
                this.size = this.baseSize;
                this.opacity = this.baseOpacity;
            } else {
                const ease = Math.sin(progress * Math.PI);
                this.size = this.baseSize + (this.glowMaxSize - this.baseSize) * ease;
                this.opacity = this.baseOpacity + (0.9 - this.baseOpacity) * ease;
            }
        }
    }
    draw() {
        if (this.glowing) {
            particleCtx.save();
            const gx = this.x, gy = this.y, s = this.size;
            const g1 = particleCtx.createRadialGradient(gx, gy, 0, gx, gy, s * 4);
            g1.addColorStop(0, `rgba(255, 240, 200, ${this.opacity * 0.15})`);
            g1.addColorStop(1, 'rgba(255, 240, 200, 0)');
            particleCtx.fillStyle = g1;
            particleCtx.beginPath();
            particleCtx.arc(gx, gy, s * 4, 0, Math.PI * 2);
            particleCtx.fill();
            const g2 = particleCtx.createRadialGradient(gx, gy, 0, gx, gy, s * 1.5);
            g2.addColorStop(0, `rgba(255, 250, 230, ${this.opacity * 0.6})`);
            g2.addColorStop(1, 'rgba(255, 250, 230, 0)');
            particleCtx.fillStyle = g2;
            particleCtx.beginPath();
            particleCtx.arc(gx, gy, s * 1.5, 0, Math.PI * 2);
            particleCtx.fill();
            particleCtx.beginPath();
            particleCtx.arc(gx, gy, s * 0.4, 0, Math.PI * 2);
            particleCtx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, this.opacity * 1.2)})`;
            particleCtx.fill();
            const spikeLen = s * 2.5;
            const spikeAlpha = this.opacity * 0.18;
            particleCtx.strokeStyle = `rgba(255, 255, 255, ${spikeAlpha})`;
            particleCtx.lineWidth = 0.5;
            for (let a = 0; a < 4; a++) {
                const angle = a * Math.PI / 4 + Math.PI / 8;
                particleCtx.beginPath();
                particleCtx.moveTo(gx - Math.cos(angle) * spikeLen, gy - Math.sin(angle) * spikeLen);
                particleCtx.lineTo(gx + Math.cos(angle) * spikeLen, gy + Math.sin(angle) * spikeLen);
                particleCtx.stroke();
            }
            particleCtx.restore();
        } else {
            particleCtx.beginPath();
            particleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            particleCtx.fillStyle = `rgba(201, 162, 39, ${this.opacity})`;
            particleCtx.fill();
        }
    }
}

function initStars(count) {
    particles = [];
    for (let i = 0; i < count; i++) particles.push(new Star());
}

// ========== 12 ZODIAC CONSTELLATIONS ==========
const zodiacConstellations = [
    { name: 'Bạch Dương', color: '#ef4444', stars: [{x:0.5,y:0.15},{x:0.4,y:0.3},{x:0.35,y:0.45},{x:0.5,y:0.4},{x:0.65,y:0.3}], lines: [[0,1],[1,2],[2,3],[3,4],[0,3]] },
    { name: 'Kim Ngưu', color: '#10b981', stars: [{x:0.5,y:0.12},{x:0.35,y:0.25},{x:0.65,y:0.25},{x:0.3,y:0.45},{x:0.7,y:0.45}], lines: [[0,1],[0,2],[1,3],[2,4],[3,4]] },
    { name: 'Song Tử', color: '#fbbf24', stars: [{x:0.4,y:0.12},{x:0.6,y:0.12},{x:0.35,y:0.28},{x:0.65,y:0.28},{x:0.3,y:0.45},{x:0.7,y:0.45},{x:0.25,y:0.62},{x:0.75,y:0.62}], lines: [[0,2],[2,4],[4,6],[1,3],[3,5],[5,7],[0,1],[2,3],[4,5]] },
    { name: 'Cự Giải', color: '#ec4899', stars: [{x:0.45,y:0.15},{x:0.55,y:0.15},{x:0.35,y:0.3},{x:0.65,y:0.3},{x:0.5,y:0.5}], lines: [[0,2],[2,4],[4,3],[3,1],[1,0],[2,3]] },
    { name: 'Sư Tử', color: '#f97316', stars: [{x:0.5,y:0.1},{x:0.35,y:0.2},{x:0.65,y:0.2},{x:0.3,y:0.38},{x:0.5,y:0.35},{x:0.7,y:0.38}], lines: [[0,1],[0,2],[1,3],[2,5],[3,4],[4,5],[3,5]] },
    { name: 'Xử Nữ', color: '#60a5fa', stars: [{x:0.5,y:0.12},{x:0.3,y:0.28},{x:0.7,y:0.28},{x:0.5,y:0.4},{x:0.18,y:0.52},{x:0.82,y:0.52},{x:0.5,y:0.68}], lines: [[0,1],[0,2],[1,3],[2,3],[1,4],[2,5],[4,3],[5,3],[3,6]] },
    { name: 'Thiên Bình', color: '#a855f7', stars: [{x:0.3,y:0.2},{x:0.7,y:0.2},{x:0.3,y:0.5},{x:0.7,y:0.5},{x:0.5,y:0.35}], lines: [[0,2],[1,3],[0,1],[2,3],[0,4],[1,4]] },
    { name: 'Bọ Cạp', color: '#dc2626', stars: [{x:0.5,y:0.1},{x:0.4,y:0.25},{x:0.6,y:0.25},{x:0.45,y:0.4},{x:0.65,y:0.5},{x:0.6,y:0.65}], lines: [[0,1],[1,3],[2,3],[2,4],[3,4],[4,5]] },
    { name: 'Nhân Mã', color: '#8b5cf6', stars: [{x:0.5,y:0.1},{x:0.3,y:0.25},{x:0.7,y:0.3},{x:0.35,y:0.5},{x:0.65,y:0.5}], lines: [[0,1],[0,2],[1,3],[2,4],[1,2],[3,4]] },
    { name: 'Ma Kết', color: '#6b7280', stars: [{x:0.5,y:0.1},{x:0.35,y:0.25},{x:0.65,y:0.25},{x:0.5,y:0.4},{x:0.5,y:0.6}], lines: [[0,1],[0,2],[1,3],[2,3],[3,4]] },
    { name: 'Bảo Bình', color: '#38bdf8', stars: [{x:0.3,y:0.12},{x:0.5,y:0.2},{x:0.7,y:0.12},{x:0.4,y:0.35},{x:0.6,y:0.35},{x:0.5,y:0.55}], lines: [[0,1],[1,2],[1,3],[2,4],[3,5],[4,5]] },
    { name: 'Song Ngư', color: '#14b8a6', stars: [{x:0.35,y:0.1},{x:0.65,y:0.1},{x:0.5,y:0.25},{x:0.3,y:0.4},{x:0.7,y:0.4},{x:0.5,y:0.6}], lines: [[0,2],[1,2],[2,3],[2,4],[3,5],[4,5]] }
];
let constellation;
let constDrift = { dx: 0, dy: 0, phase: 0 };

function initConstellations() {
    constellation = zodiacConstellations[Math.floor(Math.random() * zodiacConstellations.length)];
    constDrift = {
        dx: (Math.random() - 0.5) * 0.03,
        dy: (Math.random() - 0.5) * 0.03,
        phase: Math.random() * Math.PI * 2
    };
}

function drawConstellations() {
    const c = constellation;
    const dr = constDrift;
    const w = particleCanvas.width, h = particleCanvas.height;

    const cx = c.stars.reduce((s, st) => s + st.x, 0) / c.stars.length;
    const cy = c.stars.reduce((s, st) => s + st.y, 0) / c.stars.length;
    const offsetX = dr.dx * Math.sin(Date.now() * 0.0003 + dr.phase) * w;
    const offsetY = dr.dy * Math.sin(Date.now() * 0.0003 + dr.phase + 1) * h;

    const pts = c.stars.map(st => ({
        x: (st.x - cx) * 1.2 * w + cx * w + offsetX,
        y: (st.y - cy) * 1.2 * h + cy * h + offsetY
    }));

    c.lines.forEach(([i, j]) => {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 600) return;

        particleCtx.save();
        particleCtx.shadowColor = c.color;
        particleCtx.shadowBlur = 6;
        particleCtx.beginPath();
        particleCtx.moveTo(pts[i].x, pts[i].y);
        particleCtx.lineTo(pts[j].x, pts[j].y);
        particleCtx.strokeStyle = c.color;
        particleCtx.globalAlpha = 0.45;
        particleCtx.lineWidth = 1;
        particleCtx.stroke();
        particleCtx.restore();
    });

    pts.forEach(pt => {
        particleCtx.save();
        particleCtx.shadowColor = c.color;
        particleCtx.shadowBlur = 12;
        const grd = particleCtx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 8);
        grd.addColorStop(0, 'rgba(255,255,255,0.5)');
        grd.addColorStop(0.2, c.color);
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        particleCtx.fillStyle = grd;
        particleCtx.beginPath();
        particleCtx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
        particleCtx.fill();
        particleCtx.beginPath();
        particleCtx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        particleCtx.fillStyle = '#fff';
        particleCtx.fill();
        particleCtx.restore();
    });
}

let glowTimer = 0;
let showConstellations = true;

function animateStars() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach(p => { p.update(); p.draw(); });

    if (showConstellations) drawConstellations();

    glowTimer++;
    if (glowTimer > 120 + Math.floor(Math.random() * 120)) {
        glowTimer = 0;
        const nonGlowing = particles.filter(p => !p.glowing);
        if (nonGlowing.length > 0) {
            const count = 1 + Math.floor(Math.random() * 3);
            for (let k = 0; k < Math.min(count, nonGlowing.length); k++) {
                const idx = Math.floor(Math.random() * nonGlowing.length);
                nonGlowing[idx].startGlow();
                nonGlowing.splice(idx, 1);
            }
        }
    }

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                particleCtx.beginPath();
                particleCtx.moveTo(particles[i].x, particles[i].y);
                particleCtx.lineTo(particles[j].x, particles[j].y);
                particleCtx.strokeStyle = `rgba(201, 162, 39, ${0.06 * (1 - dist / 120)})`;
                particleCtx.lineWidth = 0.5;
                particleCtx.stroke();
            }
        }
    }
    particleFrame = requestAnimationFrame(animateStars);
}

function startParticles() {
    resizeParticleCanvas();
    initStars(70);
    initConstellations();
    animateStars();
    window.addEventListener('resize', resizeParticleCanvas);
}
startParticles();

// ========== APP STATE ==========
var profileData = null;
let dataDicts = {};

const profileContent = document.getElementById('profileContent');

async function renderProfile() {
    const data = profileData || {
        last: 'Vũ',
        middle: 'Hạnh Trâm',
        first: 'An',
        day: 29,
        month: 5,
        year: 1997,
        gender: 'Nữ'
    };

    const currentYear = new Date().getFullYear();
    const nameNoAccent = removeVietnameseAccents(data.last + data.middle + data.first).replace(/\s/g, '');
    const lifePath = getLifePath(data.day, data.month, data.year);
    const personalYear = getPersonalYear(data.day, data.month);
    const peaks = getPeaks(data.day, data.month, data.year);
    const challenges = getChallenges(data.day, data.month, data.year);
    const soul = getVowels(nameNoAccent);
    const personality = getConsonants(nameNoAccent);
    const destiny = getNumberFromName(nameNoAccent);
    const maturityNum = reduceToMaster(lifePath + destiny);

    const neededNumbers = [lifePath, personalYear, soul, personality, destiny, ...peaks, ...challenges];
    const birthDayNumber = getBirthDayNumber(data.day);
    neededNumbers.push(birthDayNumber);
    const karmicLessonNumsForFetch = getKarmicLessonsFromName(nameNoAccent, [lifePath, birthDayNumber, destiny, soul, personality]);
    neededNumbers.push(...karmicLessonNumsForFetch, maturityNum);
    const physicalCycle = buildEventCycle(removeVietnameseAccents(data.first).replace(/\s/g, '').toLowerCase());
    const mentalCycle = buildEventCycle(removeVietnameseAccents(data.middle).replace(/\s/g, '').toLowerCase());
    const spiritualCycle = buildEventCycle(removeVietnameseAccents(data.last).replace(/\s/g, '').toLowerCase());
    const physicalVal = getCycleValueAtYear(physicalCycle, data.year, currentYear);
    const mentalVal = getCycleValueAtYear(mentalCycle, data.year, currentYear);
    const spiritualVal = getCycleValueAtYear(spiritualCycle, data.year, currentYear);
    const essenceNum = reduceToMaster(physicalVal + mentalVal + spiritualVal);
    neededNumbers.push(essenceNum);
    const cycle1Num = reduceToMaster(data.month);
    const cycle2Num = reduceToMaster(data.day);
    const cycle3Num = reduceToMaster(data.year);
    neededNumbers.push(cycle1Num, cycle2Num, cycle3Num);
    const uniqueNumbers = [...new Set(neededNumbers)];

    try {
        await fetchMultipleNumbers(uniqueNumbers);
        uniqueNumbers.forEach(num => {
            const key = String(num);
            if (dataCache[key]) {
                dataDicts[key] = dataCache[key];
            }
        });
        const html = await generateProfileAsync(data, dataDicts);
        profileContent.innerHTML = html;

        const numDetailModal = document.getElementById('numDetailModal');
        const numDetailTitle = document.getElementById('numDetailTitle');
        const numDetailBody = document.getElementById('numDetailBody');
        profileContent.addEventListener('click', function(e) {
            var tooltip = e.target.closest('.num-tooltip');
            if (tooltip) {
                numDetailTitle.textContent = tooltip.getAttribute('data-title');
                numDetailBody.innerHTML = tooltip.getAttribute('data-desc');
                numDetailModal.style.display = 'flex';
            }
        });
        document.getElementById('numDetailClose').onclick = function() { numDetailModal.style.display = 'none'; };
        numDetailModal.onclick = function(e) { if (e.target === numDetailModal) numDetailModal.style.display = 'none'; };
    } catch (err) {
        console.error(err);
        profileContent.innerHTML = `<div class="error">⚠️ Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.</div>`;
    }
}

// ========== GO TO PROFILE ==========
var landing = document.getElementById('landing');
var appLayout = document.getElementById('app');
function goToProfile() {
    var lastName = document.getElementById('landingLast').value.trim();
    var middleName = document.getElementById('landingMiddle').value.trim();
    var firstName = document.getElementById('landingFirst').value.trim();
    var dob = document.getElementById('landingDob').value;
    var gender = document.getElementById('landingGender').value;

    if (!lastName || !firstName || !dob) {
        alert('Vui lòng nhập đầy đủ Họ, Tên và Ngày sinh.');
        return false;
    }

    var parts = dob.split('-');
    var year = parseInt(parts[0]);
    var month = parseInt(parts[1]);
    var day = parseInt(parts[2]);

    profileData = {
        last: lastName,
        middle: middleName || '',
        first: firstName,
        day: day,
        month: month,
        year: year,
        gender: gender
    };

    landing.classList.add('hidden');
    appLayout.style.display = 'block';
    showConstellations = false;

    renderCards(profileData);
    renderProfile();
    return true;
}

document.getElementById('landingBtn').addEventListener('click', goToProfile);

function checkLandingForm() {
    const btn = document.getElementById('landingBtn');
    const last = document.getElementById('landingLast').value.trim();
    const first = document.getElementById('landingFirst').value.trim();
    const dob = document.getElementById('landingDob').value;
    const ready = last && first && dob;
    btn.disabled = !ready;
    btn.classList.toggle('enabled', ready);
}
['landingLast','landingMiddle','landingFirst','landingDob','landingGender'].forEach(id => {
    document.getElementById(id).addEventListener('input', checkLandingForm);
    document.getElementById(id).addEventListener('change', checkLandingForm);
});
checkLandingForm();

// ========== LOGIN ==========
var LOGIN_USER = 'vivian';
var LOGIN_PASS = 'Vivian@97';

function isLoggedIn() {
    return localStorage.getItem('numerology_logged_in') === 'true';
}

function updateAuthUI() {
    var btn = document.getElementById('landingBtn');
    var loginBtn = document.getElementById('loginBtn');
    if (isLoggedIn()) {
        btn.classList.remove('auth-hidden');
        loginBtn.textContent = 'Đăng xuất';
        loginBtn.classList.add('logged-in');
    } else {
        btn.classList.add('auth-hidden');
        loginBtn.textContent = 'Đăng nhập';
        loginBtn.classList.remove('logged-in');
    }
    checkLandingForm();
}

function handleLogin() {
    var user = document.getElementById('loginUsername').value.trim();
    var pass = document.getElementById('loginPassword').value.trim();
    var errEl = document.getElementById('loginError');
    if (user === LOGIN_USER && pass === LOGIN_PASS) {
        localStorage.setItem('numerology_logged_in', 'true');
        document.getElementById('loginModal').style.display = 'none';
        errEl.textContent = '';
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        updateAuthUI();
    } else {
        errEl.textContent = 'Sai tên đăng nhập hoặc mật khẩu!';
    }
}

document.getElementById('loginBtn').addEventListener('click', function() {
    if (isLoggedIn()) {
        localStorage.removeItem('numerology_logged_in');
        updateAuthUI();
    } else {
        document.getElementById('loginModal').style.display = 'flex';
    }
});

document.getElementById('loginModalClose').addEventListener('click', function() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginError').textContent = '';
});

document.getElementById('loginModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
        document.getElementById('loginError').textContent = '';
    }
});

document.getElementById('loginSubmit').addEventListener('click', handleLogin);

['loginUsername', 'loginPassword'].forEach(function(id) {
    document.getElementById(id).addEventListener('keydown', function(e) {
        if (e.key === 'Enter') handleLogin();
    });
});

updateAuthUI();

document.getElementById('backToLandingBtn').addEventListener('click', function() {
    appLayout.style.display = 'none';
    landing.classList.remove('hidden');
    showConstellations = true;
});

document.getElementById('exportPdfBtn').addEventListener('click', async function() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pw = 210, ph = 297;

    document.body.classList.add('pdf-export');
    await new Promise(r => requestAnimationFrame(r));

    const el = document.getElementById('profileContent');
    const pc = document.getElementById('profileContainer');

    // Save original styles
    const origElWidth = el.style.width;
    const origElMaxW = el.style.maxWidth;
    const origPcPad = pc.style.padding;

    // Set A4 width for capture
    el.style.width = '210mm';
    el.style.maxWidth = '210mm';

    try {
        const sections = document.querySelectorAll('#profileContent .cover-page, #profileContent .print-chapter');
        let isFirstPage = true;
        let pageNum = 0;

        for (const section of sections) {
            // For cover: remove container padding so it's full-bleed
            if (section.classList.contains('cover-page')) {
                pc.style.padding = '0';
                await new Promise(r => requestAnimationFrame(r));
                // Set cover height to exactly A4 proportion
                section.style.minHeight = (section.offsetWidth * ph / pw) + 'px';
                await new Promise(r => requestAnimationFrame(r));
            }

            const canvas = await html2canvas(section, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            // Restore container padding after cover capture
            if (section.classList.contains('cover-page')) {
                pc.style.padding = origPcPad;
                section.style.minHeight = '';
            }

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const ih = (canvas.height * pw) / canvas.width;
            const pagesNeeded = ih > ph + 20 ? Math.ceil(ih / ph) : 1;

            for (let p = 0; p < pagesNeeded; p++) {
                pageNum++;
                if (isFirstPage) isFirstPage = false;
                else pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, -p * ph, pw, ih);
                pdf.setFontSize(9);
                pdf.setTextColor(180, 180, 180);
                pdf.text(`${pageNum}`, pw - 12, ph - 10, { align: 'right' });
            }
        }

        const nameEl = document.querySelector('.cover-info .row .value');
        const customerName = nameEl ? nameEl.textContent.trim() : 'Khách hàng';
        pdf.save('Hồ sơ nhân số học - ' + customerName + '.pdf');
    } finally {
        el.style.width = origElWidth;
        el.style.maxWidth = origElMaxW;
        pc.style.padding = origPcPad;
        document.body.classList.remove('pdf-export');
    }
});
