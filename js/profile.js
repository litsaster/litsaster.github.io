async function generateProfileAsync(data, dicts) {
    const currentYear = new Date().getFullYear();
    const { last, middle, first, day, month, year, gender } = data;
    const fullName = (last + ' ' + middle + ' ' + first).trim().replace(/\s+/g, ' ');
    const nameNoAccent = removeVietnameseAccents(fullName).replace(/\s/g, '');

    const lifePath = getLifePath(day, month, year);
    const personalYear = getPersonalYear(day, month);
    const peaks = getPeaks(day, month, year);
    const peakAges = getPeakAges(lifePath);
    const soul = getVowels(nameNoAccent);
    const personality = getConsonants(nameNoAccent);
    const destiny = getNumberFromName(nameNoAccent);

    const challenges = getChallenges(day, month, year);
    const challengeAges = peakAges;

    const birthDayNumber = getBirthDayNumber(day);
    console.log('Birth Day Number:', birthDayNumber);

    const lifeDict = dicts[String(lifePath)] || {};
    const yearDict = dicts[String(personalYear)] || {};
    const soulDict = dicts[String(soul)] || {};
    const personDict = dicts[String(personality)] || {};
    const destDict = dicts[String(destiny)] || {};
    const birthDayDict = dicts[String(birthDayNumber)] || {};

    const lifeName = lifeDict.name || `Số ${lifePath}`;
    const yearName = yearDict.name || `Số ${personalYear}`;

    const lifeDesc = (lifeDict.lifePathNumber && lifeDict.lifePathNumber.description) || lifeDict.lifePath || 'Mô tả chưa có.';
    const yearDesc = yearDict.personalYear || 'Mô tả chưa có.';
    const soulDesc = (soulDict.soulNumber && soulDict.soulNumber.description) || soulDict.soul || 'Mô tả chưa có.';
    const personDesc = (personDict.personalityNumber && personDict.personalityNumber.description) || personDict.personality || 'Mô tả chưa có.';
    const destDesc = (destDict.destinyNumber && destDict.destinyNumber.description) || destDict.destiny || 'Mô tả chưa có.';

    const lifePathTitle = (lifeDict.lifePathNumber && lifeDict.lifePathNumber.title) || 'Số Đường Đời';
    const soulTitle = (soulDict.soulNumber && soulDict.soulNumber.title) || 'Số Linh Hồn';
    const personTitle = (personDict.personalityNumber && personDict.personalityNumber.title) || 'Số Tính Cách';
    const destTitle = (destDict.destinyNumber && destDict.destinyNumber.title) || 'Số Sứ Mệnh';

    const strengths = lifeDict.strengths || [];
    const weaknesses = lifeDict.weaknesses || [];
    const lifeLessons = lifeDict.lifeLessons || [];
    const astrology = lifeDict.astrology || '';
    const career = lifeDict.career || '';
    const compatibility = lifeDict.compatibility || '';

    const maturityNum = reduceToMaster(lifePath + destiny);
    const maturityDict = dicts[String(maturityNum)] || {};
    const maturity = maturityDict.maturityNumber || { title: `Số Trưởng Thành ${maturityNum}`, description: '' };

    const coreNumbers = [lifePath, birthDayNumber, destiny, soul, personality];
    const karmicLessonNums = getKarmicLessonsFromName(nameNoAccent, coreNumbers);

    const currentName = lifeDict.currentNameNumber || null;

    const birthDayTitle = `Số ngày sinh ${day} (${birthDayNumber})`;
    const birthDayDesc = (birthDayDict.birthDayNumber && birthDayDict.birthDayNumber.description) || birthDayDict.birthDay || 'Chưa có thông tin.';

    const questions = lifeDict.verificationQuestions || [];
    const example = lifeDict.example || null;
    const affirmation = lifeDict.affirmation || '';

    const action1 = lifeDict.action || 'Hãy bắt đầu hành động ngay hôm nay.';
    const action2 = `Trong năm số ${personalYear}, hãy điều chỉnh nhịp sống để đón nhận năng lượng mới.`;
    const action3 = `Chuẩn bị cho đỉnh cao số ${peaks[0]} ở tuổi ${peakAges[0]} – đây sẽ là bước ngoặt đầu tiên.`;

    const nameChartHtml = buildNameChartSVG(fullName);
    const birthChartHtml = buildBirthChartSVG(day, month, year);
    const pyramidSvg = buildPyramidSVG(month, day, year, peaks, peakAges, challenges, challengeAges, dicts);

    let peakRows = '';
    let peakPrint = '';
    const peakLabels = ['Đỉnh 1', 'Đỉnh 2', 'Đỉnh 3', 'Đỉnh 4'];
    for (let i = 0; i < 4; i++) {
        const pNum = peaks[i];
        const pDict = dicts[String(pNum)] || {};
        const pDesc = pDict.peak || `Giai đoạn quan trọng với năng lượng số ${pNum}.`;
        const pName = pDict.name || `Số ${pNum}`;
        peakRows += `
            <tr>
                <td>${peakLabels[i]}</td>
                <td>${peakAges[i]}</td>
                <td><span class="num-tooltip" data-title="${pName}" data-desc="${pDesc}">${pNum}<span class="tooltip-text">${pName}<br>${pDesc}</span></span></td>
            </tr>
        `;
        peakPrint += `
            <div class="print-list-item">
                <strong>${peakLabels[i]}</strong> — ${peakAges[i]} tuổi — <strong>Số ${pNum}</strong>
                <div class="item-desc">${pName}: ${pDesc}</div>
            </div>
        `;
    }

    let challengeRow = '';
    let challengePrint = '';
    {
        const i = 2;
        const cNum = challenges[i];
        const cDict = dicts[String(cNum)] || {};
        const cDesc = cDict.challenge || `Giai đoạn thử thách với năng lượng số ${cNum}.`;
        const cName = cDict.name || `Số ${cNum}`;
        challengeRow = `
            <tr>
                <td>Thử thách 3</td>
                <td>${challengeAges[i]}</td>
                <td><span class="num-tooltip" data-title="${cName}" data-desc="${cDesc}">${cNum}<span class="tooltip-text">${cName}<br>${cDesc}</span></span></td>
            </tr>
        `;
        challengePrint = `
            <div class="print-list-item">
                <strong>Thử thách 3</strong> — ${challengeAges[i]} tuổi — <strong>Số ${cNum}</strong>
                <div class="item-desc">${cName}: ${cDesc}</div>
            </div>
        `;
    }

    const birthYear = parseInt(year);

    let infoItems = `
        <div class="item"><span class="label">👤 Họ và tên</span><span class="value">${fullName}</span></div>
        <div class="item"><span class="label">🎂 Ngày sinh</span><span class="value">${day}/${month}/${year}</span></div>
        <div class="item"><span class="label">🧑 Giới tính</span><span class="value">${gender}</span></div>
        <div class="item"><span class="label">📅 Ngày lập</span><span class="value">${new Date().toLocaleDateString('vi-VN')}</span></div>
        <div class="item item-full"><span class="label">🔢 Số chủ đạo</span><span class="value">${lifeName}</span></div>
    `;

    if (new Date().getFullYear() - birthYear > 15) {
        infoItems += `
            <div class="item item-full"><span class="label">🌊 Năm cá nhân</span><span class="value">${yearName}</span></div>
        `;
    }

    let chapter1 = `
        <div class="print-chapter">
        <div class="section-title ch1">📊 Chương I: Biểu đồ ngày sinh & Họ Tên</div>
        <div class="info-grid">
            ${infoItems}
        </div>

        <div class="charts-row">
            <div class="chart-col">
                <div class="section-title sub">📝 Biểu đồ họ và tên</div>
                <div class="name-chart-svg-container">
                    ${nameChartHtml}
                </div>
            </div>
            <div class="chart-col">
                <div class="section-title sub">📅 Biểu đồ ngày sinh</div>
                <div class="name-chart-svg-container">
                    ${birthChartHtml}
                </div>
            </div>
        </div>
        </div>
    `;

    let chapter2 = `
        <div class="print-chapter">
        <div class="section-title ch2">✨ Chương II: Con số chủ đạo</div>
        <p><span class="badge">Số ${lifePath}</span> <strong>${lifeName}</strong></p>
        <p>${lifeDesc}</p>
    `;
    if (strengths.length > 0 || weaknesses.length > 0) {
        chapter2 += `<div class="section-title sub">💪 Điểm mạnh & Điểm yếu</div><div class="two-col-grid">`;
        if (strengths.length > 0) {
            chapter2 += `<div><h4>✅ Điểm mạnh</h4><ul>${strengths.map(s => `<li>${s}</li>`).join('')}</ul></div>`;
        }
        if (weaknesses.length > 0) {
            chapter2 += `<div><h4>⚠️ Điểm yếu cần khắc phục</h4><ul>${weaknesses.map(w => `<li>${w}</li>`).join('')}</ul></div>`;
        }
        chapter2 += `</div>`;
    }
    if (lifeLessons.length > 0) {
        chapter2 += `<div class="section-title sub">📖 Những bài học cuộc sống</div><ul>${lifeLessons.map(lesson => `<li>${lesson}</li>`).join('')}</ul>`;
    }
    if (astrology) chapter2 += `<p><strong>🔮 Tương đồng chiêm tinh:</strong> ${astrology}</p>`;
    if (career) chapter2 += `<p><strong>💼 Nghề nghiệp phù hợp:</strong> ${career}</p>`;
    if (compatibility) chapter2 += `<p><strong>🤝 Tương thích:</strong> ${compatibility}</p>`;
    chapter2 += `</div>`;

    let chapter3 = `
        <div class="print-chapter">
        <div class="section-title ch3">🧬 Chương III: Con số sứ mệnh / linh hồn / tính cách</div>
        <ul>
            <li><strong>${destTitle} (${destiny}):</strong> ${destDesc}</li>
            <li><strong>${soulTitle} (${soul}):</strong> ${soulDesc}</li>
            <li><strong>${personTitle} (${personality}):</strong> ${personDesc}</li>
        </ul>
        </div>
    `;

    let chapter4 = `
        <div class="print-chapter">
        <div class="section-title ch4">📌 Chương IV: Con số ngày sinh, trưởng thành, bài học nhân quả</div>
        <div class="section-title sub">🎂 ${birthDayTitle}</div>
        <p>${birthDayDesc}</p>
        <div class="section-title sub">🌱 Số Trưởng Thành ${maturityNum}</div>
        <p>${maturity.description || ''}</p>
    `;
    if (karmicLessonNums.length > 0) {
        const klItems = karmicLessonNums.map(n => {
            const d = dicts[String(n)] || {};
            const desc = (d.karmicLessonNumber && d.karmicLessonNumber.description) || d.lifeLessons || '';
            return `<div class="section-title sub">🌀 Bài Học Nhân Quả ${n}</div><p>${desc}</p>`;
        }).join('');
        chapter4 += klItems;
    } else {
        chapter4 += `<p><em>Không có bài học nhân quả (tất cả các số đều xuất hiện trong biểu đồ họ và tên).</em></p>`;
    }
    chapter4 += `</div>`;

    let chapter5 = `
        <div class="print-chapter">
        <div class="section-title ch5">🏔️ Chương V: Chu kỳ 4 đỉnh cao & thử thách</div>
        <div class="section-title sub">🔺 Bảng đỉnh cao</div>
        <table class="profile-table">
            <tr><th>Giai đoạn</th><th>Độ tuổi</th><th>Số</th></tr>
            ${peakRows}
        </table>
        <div class="print-list">${peakPrint}</div>
        <div class="quote">“Hiện tại, bạn đang ở giai đoạn chuẩn bị cho đỉnh cao tiếp theo. Hãy sống trọn vẹn từng chặng đường, vì mỗi bước chân hôm nay đều là viên gạch cho ngôi đền vinh quang của ngày mai.”</div>
        <div class="section-title sub" style="margin-top:36px;">🔻 Thử thách</div>
        <table class="profile-table">
            <tr><th>Giai đoạn</th><th>Độ tuổi</th><th>Số</th></tr>
            ${challengeRow}
        </table>
        <div class="print-list">${challengePrint}</div>
        </div>
        <div class="print-chapter pyramid-chapter">
        <div class="section-title ch5">🏔️ Sơ đồ đỉnh cao và thử thách</div>
        <div class="pyramid-svg-container">
            ${pyramidSvg}
        </div>
        </div>
    `;

    const cycle1Raw = parseInt(month);
    const cycle2Raw = parseInt(day);
    const cycle3Raw = parseInt(year);

    const cycle1Num = reduceToMaster(cycle1Raw);
    const cycle2Num = reduceToMaster(cycle2Raw);
    const cycle3Num = reduceToMaster(cycle3Raw);

    const cycle1Dict = dicts[String(cycle1Num)] || {};
    const cycle2Dict = dicts[String(cycle2Num)] || {};
    const cycle3Dict = dicts[String(cycle3Num)] || {};

    const cycle1Name = cycle1Dict.name || `Số ${cycle1Num}`;
    const cycle2Name = cycle2Dict.name || `Số ${cycle2Num}`;
    const cycle3Name = cycle3Dict.name || `Số ${cycle3Num}`;

    const cycle1Desc = cycle1Dict.cycle1 || cycle1Dict.lifePath || `Mô tả cho chu kỳ 1 của số ${cycle1Num}`;
    const cycle2Desc = cycle2Dict.cycle2 || cycle2Dict.lifePath || `Mô tả cho chu kỳ 2 của số ${cycle2Num}`;
    const cycle3Desc = cycle3Dict.cycle3 || cycle3Dict.lifePath || `Mô tả cho chu kỳ 3 của số ${cycle3Num}`;

    const cycleAges = ['0-27', '28-54', '55+'];
    const cycleLabels = ['Chu kỳ I', 'Chu kỳ II', 'Chu kỳ III'];
    const cycleNums = [cycle1Num, cycle2Num, cycle3Num];
    const cycleNames = [cycle1Name, cycle2Name, cycle3Name];
    const cycleDescs = [cycle1Desc, cycle2Desc, cycle3Desc];

    let cycleRows = '';
    let cyclePrint = '';
    for (let i = 0; i < 3; i++) {
        const cn = cycleNums[i];
        const cname = cycleNames[i];
        const cdesc = cycleDescs[i];
        cycleRows += `
            <tr>
                <td>${cycleLabels[i]}</td>
                <td>${cycleAges[i]}</td>
                <td><span class="num-tooltip" data-title="${cname}" data-desc="${cdesc}">${cn}<span class="tooltip-text">${cname}<br>${cdesc}</span></span></td>
            </tr>
        `;
        cyclePrint += `
            <div class="print-list-item">
                <strong>${cycleLabels[i]}</strong> — ${cycleAges[i]} tuổi — <strong>Số ${cn}</strong>
                <div class="item-desc">${cname}: ${cdesc}</div>
            </div>
        `;
    }

    let chapter6, chapter7, chapter8;

    chapter6 = `
        <div class="print-chapter">
        <div class="section-title ch6">📆 Chương VI: Con số chu kỳ lớn (Các giai đoạn của cuộc đời)</div>
        <table class="profile-table ch6-table">
            <tr><th>Giai đoạn</th><th>Độ tuổi</th><th>Số</th></tr>
            ${cycleRows}
        </table>
        <div class="print-list ch6-list">${cyclePrint}</div>
        </div>
    `;

    if (new Date().getFullYear() - birthYear > 15) {
        chapter7 = `
            <div class="print-chapter">
            <div class="section-title ch7">🌊 Chương VII: Năm cá nhân</div>
            <div class="section-title sub">Năm cá nhân ${personalYear} – ${yearName}</div>
            <p>${yearDesc}</p>
        `;
        const physicalCycle = buildEventCycle(removeVietnameseAccents(first).replace(/\s/g, '').toLowerCase());
        const mentalCycle = buildEventCycle(removeVietnameseAccents(middle).replace(/\s/g, '').toLowerCase());
        const spiritualCycle = buildEventCycle(removeVietnameseAccents(last).replace(/\s/g, '').toLowerCase());

        const physicalVal = getCycleValueAtYear(physicalCycle, birthYear, currentYear);
        const mentalVal = getCycleValueAtYear(mentalCycle, birthYear, currentYear);
        const spiritualVal = getCycleValueAtYear(spiritualCycle, birthYear, currentYear);
        const essenceNum = reduceToMaster(physicalVal + mentalVal + spiritualVal);
        const essenceDict = dicts[String(essenceNum)] || {};
        const essenceDesc = essenceDict.personalMessage || essenceDict.message || (essenceDict.lifePathNumber && essenceDict.lifePathNumber.description) || essenceDict.lifePath || 'Chưa có thông tin.';

        chapter7 += `
            <div class="section-title ch8">💌 Chương VIII: Thông điệp cá nhân ${currentYear}</div>
            <div class="section-title sub">Số bản chất: ${essenceNum}</div>
            <p>${essenceDesc}</p>
            </div>
        `;
        chapter8 = ``;
    } else {
        chapter7 = '';
        chapter8 = '';
    }

    let extra = '';
    if (questions.length > 0) {
        extra += `
            <div class="section-title sub">🤔 Câu hỏi kiểm chứng</div>
            <p><em>Hãy tự hỏi bản thân những câu sau để xác định xem bạn có đang sống đúng với năng lượng của mình không:</em></p>
            <ul>${questions.map(q => `<li>${q}</li>`).join('')}</ul>
        `;
    }
    if (Array.isArray(example) && example.length > 0) {
        extra += `
            <div class="section-title sub">🌟 Nhân vật tiêu biểu</div>
            <div class="example-box">
            ${example.map(p => `
                <div class="famous-person">
                    <strong>${p.name}</strong> ${p.birthDate ? `(sinh ${p.birthDate})` : ''}<br>
                    <span style="font-weight:300; font-size:14px;">${p.description || ''}</span>
                </div>
            `).join('<hr style="border:none;border-top:1px dashed #e0d2c4;margin:8px 0;">')}
            </div>
        `;
    }
    if (affirmation) {
        extra += `
            <div class="section-title sub">💖 Lời khẳng định</div>
            <div class="affirmation-box">“${affirmation}”</div>
        `;
    }
    if (extra) {
        extra = `<div class="print-chapter"><div class="section-title ch-appendix">📖 Phụ lục – Tham khảo thêm</div>${extra}</div>`;
    }

    const today = new Date().toLocaleDateString('vi-VN');
    let html = `
            <div class="cover-page">
                <div class="cover-border-inner"></div>
                <div class="cover-ornament">✦ ✦ ✦</div>
                <div class="cover-subtitle">Vivian Nhân Số Học</div>
                <div class="cover-divider"></div>
                <div class="cover-title">HỒ SƠ NHÂN SỐ HỌC</div>
                <div class="cover-title-sub">Cá Nhân</div>
                <div class="cover-divider2">
                    <span class="line"></span>
                    <span class="diamond"></span>
                    <span class="line"></span>
                </div>
                <div class="cover-package">Gói 4 – Full chi tiết &bull; Bảo mật tuyệt đối</div>
                <div class="cover-info-box">
                    <div class="cover-info">
                        <div class="row"><span class="label">Họ và tên</span><span class="value">${fullName}</span></div>
                        <div class="row"><span class="label">Ngày sinh</span><span class="value">${day}/${month}/${year}</span></div>
                        <div class="row"><span class="label">Giới tính</span><span class="value">${gender}</span></div>
                        <div class="row"><span class="label">Số chủ đạo</span><span class="value">${lifeName}</span></div>
                        <div class="row"><span class="label">Ngày lập</span><span class="value">${today}</span></div>
                    </div>
                </div>
                <div class="cover-footer">
                    <div class="footer-line"></div>
                    ✦ 6 năm chiêm nghiệm – Một bản đồ dành riêng cho hành trình của bạn ✦<br>
                    “Những con số không gieo rắc định mệnh, chúng chỉ là tấm gương phản chiếu linh hồn bạn đang khát khao trở thành ai.”<br>
                    &copy; ${currentYear} Vivian Numerology
                </div>
            </div>

        ${chapter1}
        ${chapter2}
        ${chapter3}
        ${chapter4}
        ${chapter5}
        ${chapter6}
        ${chapter7}
        ${chapter8}
        ${extra}

        <div class="print-chapter">
        <div class="section-title ch-closing">🎯 Lời kết – Tấm bản đồ và người dẫn đường là bạn</div>
        <p>Không một con số nào có thể tài giỏi hơn trái tim bạn. Những chỉ số này chỉ là la bàn – hướng đi, tốc độ và điểm dừng hoàn toàn thuộc về bạn. Hãy dùng chúng để thấu hiểu bản thân, nhưng đừng để chúng trói buộc bạn.</p>
        <p><strong>Ba điều bạn nên hành động ngay:</strong></p>
        <ol>
            <li>${action1}</li>
            <li>${action2}</li>
            <li>${action3}</li>
        </ol>

        <div class="footer-note">
            <strong>Vivian Nhân số học</strong> – Offline tại Đà Lạt • Online qua Google Meet<br>
            Bảo mật tuyệt đối – Mọi thông tin chỉ dành riêng cho bạn.<br>
            © ${currentYear} Vivian Numerology – Thiết kế dành riêng cho hành trình của bạn.
        </div>
        </div>
    `;

    return html;
}
