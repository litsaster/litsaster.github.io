
const numCards = [
    { key: 'lifePath', label: 'Số Đường Đời' },
    { key: 'destiny', label: 'Số Sứ Mệnh' },
    { key: 'soul', label: 'Số Linh Hồn' },
    { key: 'personality', label: 'Số Nuôi Dưỡng' }
];

const numData = {
    1: { title: 'Người Tiên Phong', tagline: 'Lãnh đạo — Độc lập — Sáng tạo', description: 'Số 1 là khởi đầu của mọi thứ. Bạn sinh ra để dẫn đường, không phải để đi theo. Năng lượng của bạn bùng cháy như ngọn lửa đầu tiên trong bóng tối.', strengths: ['Ý chí mạnh mẽ', 'Tư duy đổi mới', 'Quyết đoán'], challenges: ['Cứng đầu', 'Cô đơn', 'Cái tôi cao'] },
    2: { title: 'Người Hòa Giải', tagline: 'Hợp tác — Nhạy cảm — Cân bằng', description: 'Số 2 là nhịp cầu kết nối tâm hồn. Bạn cảm nhận được những điều người khác không nói ra, và chữa lành bằng sự hiện diện yên tĩnh của mình.', strengths: ['Thấu cảm sâu sắc', 'Ngoại giao tinh tế', 'Kiên nhẫn'], challenges: ['Thiếu quyết đoán', 'Phụ thuộc', 'Dễ tổn thương'] },
    3: { title: 'Người Nghệ Sĩ', tagline: 'Sáng tạo — Biểu đạt — Niềm vui', description: 'Số 3 là nghệ sĩ của vũ trụ. Ngôn từ, màu sắc, âm nhạc — bất cứ điều gì bạn chạm vào đều trở thành nghệ thuật. Niềm vui của bạn là món quà cho thế giới.', strengths: ['Tài năng nghệ thuật', 'Truyền cảm hứng', 'Lạc quan'], challenges: ['Thiếu tập trung', 'Hời hợt', 'Hay thay đổi'] },
    4: { title: 'Người Xây Dựng', tagline: 'Kỷ luật — Ổn định — Thực tế', description: 'Số 4 là nền tảng của mọi công trình lớn. Bạn xây nên những thứ trường tồn. Đất đai, trật tự, và sự bền vững là ngôn ngữ của linh hồn bạn.', strengths: ['Đáng tin cậy', 'Kiên trì', 'Có tổ chức'], challenges: ['Cứng nhắc', 'Bảo thủ', 'Quá cẩn thận'] },
    5: { title: 'Người Tự Do', tagline: 'Phiêu lưu — Thay đổi — Đa năng', description: 'Số 5 là linh hồn của gió. Bạn không thể bị giam cầm — không bởi biên giới, không bởi thói quen. Mỗi ngày mới là một cánh cửa bạn phải mở.', strengths: ['Thích nghi nhanh', 'Hấp dẫn', 'Dũng cảm'], challenges: ['Thiếu kiên định', 'Bốc đồng', 'Sợ cam kết'] },
    6: { title: 'Người Nuôi Dưỡng', tagline: 'Tình yêu — Trách nhiệm — Hòa hợp', description: 'Số 6 là trái tim của gia đình và cộng đồng. Bạn yêu thương một cách vô điều kiện và tìm thấy ý nghĩa sống trong việc chăm sóc người khác.', strengths: ['Tận tâm', 'Chữa lành', 'Hào phóng'], challenges: ['Hy sinh thái quá', 'Kiểm soát', 'Lo lắng'] },
    7: { title: 'Người Huyền Bí', tagline: 'Trí tuệ — Tâm linh — Chiều sâu', description: 'Số 7 là nhà thần bí của vũ trụ. Bạn không chỉ muốn biết — bạn muốn hiểu bản chất thực sự của vạn vật. Sự thật ẩn sau màn sương là đích đến của bạn.', strengths: ['Trí tuệ sâu sắc', 'Trực giác nhạy bén', 'Độc lập tinh thần'], challenges: ['Xa cách', 'Hoài nghi', 'Cô lập'] },
    8: { title: 'Người Quyền Năng', tagline: 'Thịnh vượng — Tham vọng — Quyền lực', description: 'Số 8 là biểu tượng của vô cực — năng lượng lưu chuyển không ngừng giữa vật chất và tâm linh. Bạn có khả năng biến tầm nhìn thành hiện thực.', strengths: ['Tầm nhìn chiến lược', 'Ý chí thép', 'Thu hút thịnh vượng'], challenges: ['Tham lam', 'Độc đoán', 'Vật chất hóa'] },
    9: { title: 'Người Nhân Đạo', tagline: 'Từ bi — Trí tuệ — Viên mãn', description: 'Số 9 là con số của sự hoàn thành. Bạn đã trải qua mọi kinh nghiệm của tâm hồn và quay trở về để phục vụ nhân loại bằng tình thương vô biên.', strengths: ['Từ bi sâu sắc', 'Trí tuệ toàn diện', 'Cảm hứng tinh thần'], challenges: ['Lý tưởng hóa', 'Khó buông bỏ', 'Mất phương hướng'] },
    11: { title: 'Bậc Thầy Trực Giác', tagline: 'Soi sáng — Truyền cảm hứng — Tâm linh cao', description: '11 là số chủ — một kênh liên lạc với những tầng thực tại cao hơn. Bạn cảm nhận được những làn sóng vô hình và có sứ mệnh đánh thức ý thức nhân loại.', strengths: ['Trực giác huyền diệu', 'Sứ mệnh tâm linh', 'Sức hút đặc biệt'], challenges: ['Áp lực tinh thần', 'Lo âu cao', 'Đòi hỏi cao với bản thân'] },
    22: { title: 'Kiến Trúc Sư Vũ Trụ', tagline: 'Tầm nhìn — Biểu hiện — Đế chế', description: '22 là số chủ mạnh nhất — người biến giấc mơ lớn nhất thành thực tế. Bạn không chỉ xây nhà; bạn xây nền văn minh.', strengths: ['Tầm nhìn vĩ đại', 'Năng lực thực tế', 'Lãnh đạo bậc cao'], challenges: ['Áp lực khổng lồ', 'Hoàn hảo chủ nghĩa', 'Kiệt sức'] }
};

function getNumData(num) {
    return numData[num] || numData[((num % 9 === 0) ? 9 : (num % 9))] || { title: 'Số ' + num, tagline: '', description: '', strengths: [], challenges: [] };
}

function getNumColor(num) {
    const map = {
        1: { c: '#c9a227', g: 'rgba(201,162,39,0.15)', gg: 'rgba(201,162,39,0.25)' },
        2: { c: '#a855f7', g: 'rgba(168,85,247,0.15)', gg: 'rgba(168,85,247,0.25)' },
        3: { c: '#e879f9', g: 'rgba(232,121,249,0.15)', gg: 'rgba(232,121,249,0.25)' },
        4: { c: '#38bdf8', g: 'rgba(56,189,248,0.15)', gg: 'rgba(56,189,248,0.25)' },
        5: { c: '#f97316', g: 'rgba(249,115,22,0.15)', gg: 'rgba(249,115,22,0.25)' },
        6: { c: '#10b981', g: 'rgba(16,185,129,0.15)', gg: 'rgba(16,185,129,0.25)' },
        7: { c: '#6366f1', g: 'rgba(99,102,241,0.15)', gg: 'rgba(99,102,241,0.25)' },
        8: { c: '#ef4444', g: 'rgba(239,68,68,0.15)', gg: 'rgba(239,68,68,0.25)' },
        9: { c: '#ec4899', g: 'rgba(236,72,153,0.15)', gg: 'rgba(236,72,153,0.25)' },
        11: { c: '#c084fc', g: 'rgba(192,132,252,0.15)', gg: 'rgba(192,132,252,0.25)' },
        22: { c: '#fbbf24', g: 'rgba(251,191,36,0.15)', gg: 'rgba(251,191,36,0.25)' }
    };
    return map[num] || map[(num % 9 === 0) ? 9 : (num % 9)];
}

function showDetail(key, num, data) {
    const detail = document.getElementById('detailContent');
    const cardDetail = document.getElementById('cardDetail');
    const glow = document.getElementById('detailGlow');
    const card = numCards.find(c => c.key === key);
    const numInfo = getNumData(num);
    const co = getNumColor(num);
    cardDetail.style.setProperty('--card-color', co.c);
    cardDetail.style.borderColor = co.c + '44';
    glow.style.background = co.gg;

    document.querySelectorAll('.num-card').forEach(c => {
        c.classList.remove('active');
        c.style.removeProperty('--card-color');
        c.style.removeProperty('--card-glow');
        c.style.removeProperty('--card-glow2');
    });
    const activeCard = document.querySelector(`.num-card[data-key="${key}"]`);
    if (activeCard) {
        activeCard.classList.add('active');
        activeCard.style.setProperty('--card-color', co.c);
        activeCard.style.setProperty('--card-glow', co.g);
        activeCard.style.setProperty('--card-glow2', 'transparent');
    }

    let detailHTML = `
        <div class="type-label">${card.label}</div>
        <div class="big-number">${num}</div>
        <div class="num-title">${numInfo.title}</div>
        <div class="tagline">${numInfo.tagline}</div>
        <div class="divider"></div>
        <div class="desc">
            <p>${numInfo.description}</p>
        </div>`;

    if (numInfo.strengths.length > 0 || numInfo.challenges.length > 0) {
        detailHTML += `<div class="traits"><div><h4>✨ Điểm mạnh</h4><ul>`;
        numInfo.strengths.forEach(t => { detailHTML += `<li><span class="dot" style="background:${co.c}"></span>${t}</li>`; });
        detailHTML += `</ul></div><div class="challenge"><h4>⚠️ Thách thức</h4><ul>`;
        numInfo.challenges.forEach(t => { detailHTML += `<li><span class="dot" style="background:${co.c}"></span>${t}</li>`; });
        detailHTML += `</ul></div></div>`;
    }

    detail.innerHTML = detailHTML;
}

function renderCards(data) {
    const sidebar = document.getElementById('cardsSidebar');
    const nameNoAccent = removeVietnameseAccents(data.last + data.middle + data.first).replace(/\s/g, '');
    const lifePath = getLifePath(data.day, data.month, data.year);
    const destiny = getNumberFromName(nameNoAccent);
    const soul = getVowels(nameNoAccent);
    const personality = getConsonants(nameNoAccent);
    const values = { lifePath, destiny, soul, personality };

    sidebar.innerHTML = '';
    numCards.forEach(card => {
        const num = values[card.key];
        const data = getNumData(num);
        const div = document.createElement('div');
        div.className = 'num-card';
        div.dataset.key = card.key;
        div.dataset.num = num;
        div.innerHTML = `
            <div class="accent-line"></div>
            <div class="circle">${num}</div>
            <div class="info">
                <div class="type-label">${card.label}</div>
                <div class="num-title">${data.title}</div>
            </div>
            <div class="arrow">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
        `;
        div.addEventListener('click', () => showDetail(card.key, values[card.key], data));
        sidebar.appendChild(div);
    });
    showDetail('lifePath', values.lifePath, data);
}

function renderCosmicMap(data) {
    const grid = document.getElementById('cosmicGrid');
    const nameNoAccent = removeVietnameseAccents(data.last + data.middle + data.first).replace(/\s/g, '');
    const lifePath = getLifePath(data.day, data.month, data.year);
    const destiny = getNumberFromName(nameNoAccent);
    const soul = getVowels(nameNoAccent);
    const personality = getConsonants(nameNoAccent);
    const coreNums = [lifePath, destiny, soul, personality];

    const dateStr = String(data.day) + String(data.month) + String(data.year);
    const dateDigits = dateStr.split('').map(Number);

    const nameMap = { a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8 };
    const nameCounts = {};
    nameNoAccent.toLowerCase().split('').forEach(ch => {
        if (nameMap[ch]) nameCounts[nameMap[ch]] = (nameCounts[nameMap[ch]] || 0) + 1;
    });

    grid.innerHTML = '';
    for (let i = 1; i <= 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cosmic-cell';

        const appearsInDate = dateDigits.includes(i);
        const appearsInName = nameCounts[i] > 0;
        const isCore = coreNums.some(c => c === i || (c !== 11 && c !== 22 && reduceToSingle(c) === i));
        const hasMaster = coreNums.some(c => c === i && (c === 11 || c === 22));

        if (hasMaster) cell.classList.add('master');
        else if (isCore) cell.classList.add('active');
        else if (appearsInDate || appearsInName) cell.classList.add('present');

        cell.innerHTML = `<span class="cosmic-num">${i}</span>`;
        grid.appendChild(cell);
    }
}
