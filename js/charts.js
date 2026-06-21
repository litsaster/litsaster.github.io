
function buildChartSVG(counts) {
    const cols = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];
    const rows = [
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9]
    ];

    const boxW = 70;
    const boxH = 50;
    const gapX = 115;
    const gapY = 90;
    const padding = 50;

    const pos = {};
    for (let colIdx = 0; colIdx < 3; colIdx++) {
        for (let rowIdx = 0; rowIdx < 3; rowIdx++) {
            const num = cols[colIdx][rowIdx];
            const x = colIdx * gapX;
            const y = (2 - rowIdx) * gapY;
            pos[num] = { x, y };
        }
    }

    const minX = -padding;
    const maxX = 2 * gapX + boxW + padding;
    const minY = -padding;
    const maxY = 2 * gapY + boxH + padding;
    const width = maxX - minX;
    const height = maxY - minY;
    const offsetX = -minX;
    const offsetY = -minY;

    let svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto; max-width:100%; overflow:visible;">
        <defs>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.1"/>
            </filter>
        </defs>
    `;

    function drawCell(num, x, y) {
        const count = counts[num] || 0;
        const hasDots = count > 0;
        const cls = hasDots ? 'cell-box' : 'cell-box empty';
        svg += `<rect x="${x - boxW/2}" y="${y - boxH/2}" width="${boxW}" height="${boxH}" class="${cls}" filter="url(#shadow)" />`;
        svg += `<text x="${x}" y="${y - 6}" class="cell-text">${num}</text>`;
        if (hasDots) {
            const dotsPerRow = 3;
            const dotSize = 6;
            const spacing = 4;
            const startX = x - (dotsPerRow - 1) * (dotSize + spacing) / 2;
            const startY = y + 12;
            for (let i = 0; i < count && i < 9; i++) {
                const row = Math.floor(i / dotsPerRow);
                const col = i % dotsPerRow;
                const dx = startX + col * (dotSize + spacing);
                const dy = startY + row * (dotSize + spacing);
                svg += `<circle cx="${dx}" cy="${dy}" r="${dotSize/2}" class="dot" />`;
            }
        }
    }

    function drawSegment(num1, num2, cls) {
        const p1 = pos[num1];
        const p2 = pos[num2];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.sqrt(dx*dx + dy*dy);
        if (len === 0) return;
        const ux = dx/len;
        const uy = dy/len;
        let t1 = Math.min(boxW/2 / Math.abs(ux), boxH/2 / Math.abs(uy));
        if (t1 === Infinity) t1 = 0;
        const x1 = p1.x + t1 * ux + offsetX;
        const y1 = p1.y + t1 * uy + offsetY;
        let t2 = Math.min(boxW/2 / Math.abs(ux), boxH/2 / Math.abs(uy));
        if (t2 === Infinity) t2 = 0;
        const x2 = p2.x - t2 * ux + offsetX;
        const y2 = p2.y - t2 * uy + offsetY;
        svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" />`;
    }

    const colFull = cols.map(col => col.every(num => counts[num] > 0));
    const colNone = cols.map(col => col.every(num => counts[num] === 0));
    const rowFull = rows.map(row => row.every(num => counts[num] > 0));
    const rowNone = rows.map(row => row.every(num => counts[num] === 0));
    const diag1 = [1, 5, 9];
    const diag2 = [3, 5, 7];
    const diag1Full = diag1.every(num => counts[num] > 0);
    const diag1None = diag1.every(num => counts[num] === 0);
    const diag2Full = diag2.every(num => counts[num] > 0);
    const diag2None = diag2.every(num => counts[num] === 0);

    for (let num = 1; num <= 9; num++) {
        const p = pos[num];
        drawCell(num, p.x + offsetX, p.y + offsetY);
    }

    function drawArrow(arrowType, x, y) {
        const size = 7;
        let points = '';
        if (arrowType === 'up') {
            points = `${x},${y - size} ${x - size},${y + size/2} ${x + size},${y + size/2}`;
        } else if (arrowType === 'right') {
            points = `${x + size},${y} ${x - size/2},${y - size} ${x - size/2},${y + size}`;
        } else if (arrowType === 'left-up') {
            points = `${x - size},${y - size} ${x + size},${y - size/2} ${x - size/2},${y + size}`;
        } else if (arrowType === 'right-up') {
            points = `${x + size},${y - size} ${x - size},${y - size/2} ${x + size/2},${y + size}`;
        }
        svg += `<polygon points="${points}" class="arrow-head" />`;
    }

    for (let colIdx = 0; colIdx < 3; colIdx++) {
        if (colFull[colIdx] || colNone[colIdx]) {
            const cls = colFull[colIdx] ? 'line-connect' : 'line-connect dashed';
            const nums = cols[colIdx];
            drawSegment(nums[0], nums[1], cls);
            drawSegment(nums[1], nums[2], cls);
        }
    }

    for (let rowIdx = 0; rowIdx < 3; rowIdx++) {
        if (rowFull[rowIdx] || rowNone[rowIdx]) {
            const cls = rowFull[rowIdx] ? 'line-connect' : 'line-connect dashed';
            const nums = rows[rowIdx];
            drawSegment(nums[0], nums[1], cls);
            drawSegment(nums[1], nums[2], cls);
        }
    }

    if (diag1Full || diag1None) {
        const cls = diag1Full ? 'line-connect' : 'line-connect dashed';
        drawSegment(1, 5, cls);
        drawSegment(5, 9, cls);
    }

    if (diag2Full || diag2None) {
        const cls = diag2Full ? 'line-connect' : 'line-connect dashed';
        drawSegment(3, 5, cls);
        drawSegment(5, 7, cls);
    }

    for (let colIdx = 0; colIdx < 3; colIdx++) {
        if (colFull[colIdx] || colNone[colIdx]) {
            const topNum = cols[colIdx][2];
            const pTop = pos[topNum];
            const x = pTop.x + offsetX;
            const y = pTop.y - boxH/2 + offsetY - 8;
            drawArrow('up', x, y);
        }
    }

    for (let rowIdx = 0; rowIdx < 3; rowIdx++) {
        if (rowFull[rowIdx] || rowNone[rowIdx]) {
            const rightNum = rows[rowIdx][2];
            const pRight = pos[rightNum];
            const x = pRight.x + boxW/2 + offsetX + 8;
            const y = pRight.y + offsetY;
            drawArrow('right', x, y);
        }
    }

    if (diag1Full || diag1None) {
        const p9 = pos[9];
        const x = p9.x + boxW/2 + offsetX + 8;
        const y = p9.y - boxH/2 + offsetY - 8;
        drawArrow('right-up', x, y);
    }

    if (diag2Full || diag2None) {
        const p3 = pos[3];
        const x = p3.x - boxW/2 + offsetX - 8;
        const y = p3.y - boxH/2 + offsetY - 8;
        drawArrow('left-up', x, y);
    }

    svg += `</svg>`;
    return svg;
}

function buildNameChartSVG(fullName) {
    const clean = removeVietnameseAccents(fullName).replace(/\s/g, '').toLowerCase();
    const map = { a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8 };
    const counts = { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 };
    for (let ch of clean) {
        if (map[ch]) counts[map[ch]]++;
    }
    return buildChartSVG(counts);
}

function buildBirthChartSVG(day, month, year) {
    const dateStr = String(day) + String(month) + String(year);
    const digits = dateStr.split('').map(Number).filter(d => d !== 0);
    const counts = { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 };
    for (let d of digits) {
        if (counts.hasOwnProperty(d)) counts[d]++;
    }
    return buildChartSVG(counts);
}

function buildPyramidSVG(month, day, year, peaks, peakAges, challenges, challengeAges, dicts) {
    const m = reduceToSingle(month);
    const d = reduceToSingle(day);
    const y = reduceToSingle(year);

    const gapX = 280;
    const gapY = 150;
    const boxW = 70;
    const boxH = 50;

    const baseX = [-gapX, 0, gapX];
    const baseY = 0;

    const row1Y = -gapY;
    const row1X = [-gapX/2, gapX/2];

    const row2Y = -2*gapY;
    const row2X = 0;

    const row3Y = -3*gapY;
    const row3X = 0;

    const rowMinus1Y = gapY;
    const rowMinus1X = [-gapX/2, gapX/2];

    const rowMinus2Y = 2*gapY;
    const rowMinus2X = 0;

    const rowMinus3Y = 3*gapY;
    const rowMinus3X = 0;

    const cells = [
        { id: 'month', x: baseX[0], y: baseY, label: 'Tháng', value: m, extra: month },
        { id: 'day', x: baseX[1], y: baseY, label: 'Ngày', value: d, extra: day },
        { id: 'year', x: baseX[2], y: baseY, label: 'Năm', value: y, extra: year },
        { id: 'peak1', x: row1X[0], y: row1Y, label: 'Đỉnh 1', value: peaks[0], age: peakAges[0], cls: 'peak' },
        { id: 'peak2', x: row1X[1], y: row1Y, label: 'Đỉnh 2', value: peaks[1], age: peakAges[1], cls: 'peak' },
        { id: 'peak3', x: row2X, y: row2Y, label: 'Đỉnh 3', value: peaks[2], age: peakAges[2], cls: 'peak' },
        { id: 'peak4', x: row3X, y: row3Y, label: 'Đỉnh 4', value: peaks[3], age: peakAges[3], cls: 'peak-highlight' },
        { id: 'challenge1', x: rowMinus1X[0], y: rowMinus1Y, label: 'TT1', value: challenges[0], age: challengeAges[0], cls: 'challenge' },
        { id: 'challenge2', x: rowMinus1X[1], y: rowMinus1Y, label: 'TT2', value: challenges[1], age: challengeAges[1], cls: 'challenge' },
        { id: 'challenge3', x: rowMinus2X, y: rowMinus2Y, label: 'TT3', value: challenges[2], age: challengeAges[2], cls: 'challenge' },
        { id: 'challenge4', x: rowMinus3X, y: rowMinus3Y, label: 'TT4', value: challenges[3], age: challengeAges[3], cls: 'challenge-highlight' }
    ];

    const cellMap = {};
    cells.forEach(c => cellMap[c.id] = c);

    const allX = cells.map(c => c.x);
    const allY = cells.map(c => c.y);
    const minX = Math.min(...allX) - boxW/2 - 100;
    const maxX = Math.max(...allX) + boxW/2 + 100;
    const minY = Math.min(...allY) - boxH/2 - 100;
    const maxY = Math.max(...allY) + boxH/2 + 100;
    const width = maxX - minX;
    const height = maxY - minY;
    const offsetX = -minX;
    const offsetY = -minY;

    let svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:auto; max-width:850px;">
        <defs>
            <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.1"/>
            </filter>
        </defs>
    `;

    function drawLine(x1, y1, x2, y2, cls = 'connector') {
        svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" />`;
    }

    const monthPos = cellMap['month'];
    const dayPos = cellMap['day'];
    const yearPos = cellMap['year'];
    const p1 = cellMap['peak1'];
    const p2 = cellMap['peak2'];
    const p3 = cellMap['peak3'];
    const p4 = cellMap['peak4'];
    const c1 = cellMap['challenge1'];
    const c2 = cellMap['challenge2'];
    const c3 = cellMap['challenge3'];
    const c4 = cellMap['challenge4'];

    drawLine(monthPos.x + offsetX, monthPos.y + offsetY, p1.x + offsetX, p1.y + offsetY, 'connector');
    drawLine(dayPos.x + offsetX, dayPos.y + offsetY, p1.x + offsetX, p1.y + offsetY, 'connector');
    drawLine(dayPos.x + offsetX, dayPos.y + offsetY, p2.x + offsetX, p2.y + offsetY, 'connector');
    drawLine(yearPos.x + offsetX, yearPos.y + offsetY, p2.x + offsetX, p2.y + offsetY, 'connector');
    drawLine(p1.x + offsetX, p1.y + offsetY, p3.x + offsetX, p3.y + offsetY, 'connector');
    drawLine(p2.x + offsetX, p2.y + offsetY, p3.x + offsetX, p3.y + offsetY, 'connector');

    const monthLeftX = monthPos.x - boxW/2 + offsetX;
    const yearRightX = yearPos.x + boxW/2 + offsetX;
    const p4x = p4.x + offsetX;
    const p4y = p4.y + offsetY;
    drawLine(monthLeftX, monthPos.y + offsetY, p4x, p4y, 'connector');
    drawLine(yearRightX, yearPos.y + offsetY, p4x, p4y, 'connector');

    drawLine(monthPos.x + offsetX, monthPos.y + offsetY, c1.x + offsetX, c1.y + offsetY, 'connector challenge');
    drawLine(dayPos.x + offsetX, dayPos.y + offsetY, c1.x + offsetX, c1.y + offsetY, 'connector challenge');
    drawLine(dayPos.x + offsetX, dayPos.y + offsetY, c2.x + offsetX, c2.y + offsetY, 'connector challenge');
    drawLine(yearPos.x + offsetX, yearPos.y + offsetY, c2.x + offsetX, c2.y + offsetY, 'connector challenge');
    drawLine(c1.x + offsetX, c1.y + offsetY, c3.x + offsetX, c3.y + offsetY, 'connector challenge');
    drawLine(c2.x + offsetX, c2.y + offsetY, c3.x + offsetX, c3.y + offsetY, 'connector challenge');

    const c4x = c4.x + offsetX;
    const c4y = c4.y + offsetY;
    drawLine(monthLeftX, monthPos.y + offsetY, c4x, c4y, 'connector challenge');
    drawLine(yearRightX, yearPos.y + offsetY, c4x, c4y, 'connector challenge');

    cells.forEach(c => {
        const x = c.x + offsetX;
        const y = c.y + offsetY;
        const cls = c.cls ? `cell-box ${c.cls}` : 'cell-box';
        svg += `<rect x="${x - boxW/2}" y="${y - boxH/2}" width="${boxW}" height="${boxH}" class="${cls}" filter="url(#shadow)" />`;

        if (c.id === 'peak4' || c.id === 'challenge4') {
            if (c.label) {
                svg += `<text x="${x}" y="${y - boxH/2 - 6}" class="cell-text small" style="font-size:13px;">${c.label}</text>`;
            }
            svg += `<text x="${x}" y="${y - 2}" class="cell-text">${c.value}</text>`;
            if (c.age !== undefined) {
                svg += `<text x="${x}" y="${y + boxH/2 - 6}" class="cell-text age">${c.age} tuổi</text>`;
            }
        } else {
            svg += `<text x="${x}" y="${y - 4}" class="cell-text">${c.value}</text>`;
            if (c.age !== undefined) {
                svg += `<text x="${x}" y="${y + 16}" class="cell-text age">${c.age} tuổi</text>`;
            }
            if (c.label) {
                const labelY = y + (c.age !== undefined ? 34 : 18);
                svg += `<text x="${x}" y="${labelY}" class="cell-text small">${c.label}</text>`;
            }
        }
    });

    const dayX = dayPos.x + offsetX;
    const dayY = dayPos.y + offsetY;
    const p1x = p1.x + offsetX;
    const p1y = p1.y + offsetY;
    const p2x = p2.x + offsetX;
    const p2y = p2.y + offsetY;
    const p3x = p3.x + offsetX;
    const p3y = p3.y + offsetY;
    const minX_peak = Math.min(dayX, p1x, p2x, p3x) - boxW/2;
    const maxX_peak = Math.max(dayX, p1x, p2x, p3x) + boxW/2;
    const minY_peak = Math.min(dayY, p1y, p2y, p3y) - boxH/2;
    const maxY_peak = Math.max(dayY, p1y, p2y, p3y) + boxH/2;
    const centerX_peak = (minX_peak + maxX_peak) / 2;
    const centerY_peak = (minY_peak + maxY_peak) / 2;

    const c1x = c1.x + offsetX;
    const c1y = c1.y + offsetY;
    const c2x = c2.x + offsetX;
    const c2y = c2.y + offsetY;
    const c3x = c3.x + offsetX;
    const c3y = c3.y + offsetY;
    const minX_chal = Math.min(dayX, c1x, c2x, c3x) - boxW/2;
    const maxX_chal = Math.max(dayX, c1x, c2x, c3x) + boxW/2;
    const minY_chal = Math.min(dayY, c1y, c2y, c3y) - boxH/2;
    const maxY_chal = Math.max(dayY, c1y, c2y, c3y) + boxH/2;
    const centerX_chal = (minX_chal + maxX_chal) / 2;
    const centerY_chal = (minY_chal + maxY_chal) / 2;

    svg += `<text x="${centerX_peak}" y="${centerY_peak - 18}" class="label-side" fill="#a67c4e" font-size="28">▲</text>`;
    svg += `<text x="${centerX_peak}" y="${centerY_peak + 10}" class="label-side" style="font-size:16px;" fill="#4d3425">Đỉnh cao</text>`;

    svg += `<text x="${centerX_chal}" y="${centerY_chal - 18}" class="label-side" fill="#b88a6b" font-size="28">▼</text>`;
    svg += `<text x="${centerX_chal}" y="${centerY_chal + 10}" class="label-side" style="font-size:16px;" fill="#4d3425">Thử thách</text>`;

    svg += `<text x="${-gapX/2 + offsetX}" y="${-gapY/2 + offsetY}" class="operator">+</text>`;
    svg += `<text x="${gapX/2 + offsetX}" y="${-gapY/2 + offsetY}" class="operator">+</text>`;
    svg += `<text x="${0 + offsetX}" y="${-gapY - gapY/2 + offsetY}" class="operator">+</text>`;
    svg += `<text x="${-gapX/2 + offsetX}" y="${gapY/2 + offsetY}" class="operator challenge">–</text>`;
    svg += `<text x="${gapX/2 + offsetX}" y="${gapY/2 + offsetY}" class="operator challenge">–</text>`;
    svg += `<text x="${0 + offsetX}" y="${gapY + gapY/2 + offsetY}" class="operator challenge">–</text>`;

    svg += `</svg>`;
    return svg;
}
