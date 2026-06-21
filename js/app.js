
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

let glowTimer = 0;
function animateStars() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach(p => { p.update(); p.draw(); });

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

    const neededNumbers = [lifePath, personalYear, soul, personality, destiny, ...peaks, ...challenges];
    const birthDayNumber = getBirthDayNumber(data.day);
    neededNumbers.push(birthDayNumber);
    const karmicLessonNumsForFetch = getKarmicLessonsFromName(nameNoAccent, [lifePath, birthDayNumber, destiny, soul, personality]);
    neededNumbers.push(...karmicLessonNumsForFetch);
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

document.getElementById('backToLandingBtn').addEventListener('click', function() {
    appLayout.style.display = 'none';
    landing.classList.remove('hidden');
});

document.getElementById('exportPdfBtn').addEventListener('click', function() {
    window.print();
});
