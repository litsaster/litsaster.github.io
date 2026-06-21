
const letterMap = { a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8 };

function getNumberFromName(str) {
    let total = 0;
    for (let ch of str.toLowerCase()) {
        if (letterMap[ch]) total += letterMap[ch];
    }
    return reduceToMaster(total);
}

function getVowels(str) {
    const vowels = 'aeiouy';
    const map = { a:1, e:5, i:9, o:6, u:3, y:7 };
    let total = 0;
    for (let ch of str.toLowerCase()) {
        if (vowels.includes(ch) && map[ch]) total += map[ch];
    }
    return reduceToMaster(total);
}

function getConsonants(str) {
    const vowels = 'aeiouy';
    let total = 0;
    for (let ch of str.toLowerCase()) {
        if (!vowels.includes(ch) && letterMap[ch]) total += letterMap[ch];
    }
    return reduceToMaster(total);
}

function getLifePath(day, month, year) {
    const dateStr = String(day) + String(month) + String(year);
    const total = dateStr.split('').reduce((sum, d) => sum + Number(d), 0);
    return reduceToMaster(total);
}

function getPersonalYear(day, month) {
    const currentYear = new Date().getFullYear();
    let total = day + month + currentYear;
    let sum = String(total).split('').reduce((a, b) => a + Number(b), 0);
    return reduceToMaster(sum);
}

function getBirthDayNumber(day) {
    const map = {
        1:1, 10:1, 19:1, 28:1,
        2:2, 20:2,
        3:3, 12:3, 21:3, 30:3,
        4:4, 13:4, 22:4, 31:4,
        5:5, 14:5, 23:5,
        6:6, 15:6, 24:6,
        7:7, 16:7, 25:7,
        8:8, 17:8, 26:8,
        9:9, 18:9, 27:9,
        11:11, 29:11
    };
    return map[day] || reduceToMaster(day);
}

function getPeaks(day, month, year) {
    const d = reduceToSingle(day);
    const m = reduceToSingle(month);
    const y = reduceToSingle(year);
    let p1 = reduceToSingle(m + d);
    let p2 = reduceToSingle(d + y);
    let p3 = reduceToSingle(p1 + p2);
    let p4 = reduceToSingle(m + y);
    return [p1, p2, p3, p4];
}

function getPeakAges(lifePath) {
    const base = 36 - reduceToSingle(lifePath);
    if (base < 0) return [9, 18, 27, 36];
    return [base, base + 9, base + 18, base + 27];
}

function getChallenges(day, month, year) {
    const d = reduceToSingle(day);
    const m = reduceToSingle(month);
    const y = reduceToSingle(year);
    let c1 = reduceToSingle(Math.abs(d - m));
    let c2 = reduceToSingle(Math.abs(y - d));
    let c3 = reduceToSingle(Math.abs(c2 - c1));
    let c4 = reduceToSingle(Math.abs(y - m));
    return [c1, c2, c3, c4];
}

function getKarmicLessonsFromName(name, coreNumbers) {
    const counts = { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 };
    for (let ch of name.toLowerCase()) {
        if (letterMap[ch]) counts[letterMap[ch]]++;
    }
    const missing = [];
    for (let n = 1; n <= 9; n++) {
        if (counts[n] === 0 && !coreNumbers.includes(n)) {
            missing.push(n);
        }
    }
    return missing;
}

function buildEventCycle(name) {
    const letters = name.toLowerCase().split('');
    const cycle = [];
    for (const ch of letters) {
        const val = letterMap[ch];
        if (val) {
            for (let i = 0; i < val; i++) {
                cycle.push(val);
            }
        }
    }
    return cycle;
}

function getCycleValueAtYear(cycle, birthYear, targetYear) {
    if (cycle.length === 0) return 0;
    const age = targetYear - birthYear;
    return cycle[age % cycle.length];
}

function buildEventTableHTML(last, middle, first, birthYear, targetYear) {
    const physicalCycle = buildEventCycle(removeVietnameseAccents(first).replace(/\s/g, '').toLowerCase());
    const mentalCycle = buildEventCycle(removeVietnameseAccents(middle).replace(/\s/g, '').toLowerCase());
    const spiritualCycle = buildEventCycle(removeVietnameseAccents(last).replace(/\s/g, '').toLowerCase());

    const years = [];
    for (let y = birthYear; y <= targetYear; y++) {
        years.push(y);
    }

    let yearCells = years.map(y => `<td>${String(y).slice(-2)}</td>`).join('');
    let ageCells = years.map(y => `<td>${y - birthYear}</td>`).join('');
    let physicalCells = years.map(y => `<td>${getCycleValueAtYear(physicalCycle, birthYear, y)}</td>`).join('');
    let mentalCells = years.map(y => `<td>${getCycleValueAtYear(mentalCycle, birthYear, y)}</td>`).join('');
    let spiritualCells = years.map(y => `<td>${getCycleValueAtYear(spiritualCycle, birthYear, y)}</td>`).join('');
    let essenceCells = years.map(y => {
        const e = reduceToMaster(
            getCycleValueAtYear(physicalCycle, birthYear, y) +
            getCycleValueAtYear(mentalCycle, birthYear, y) +
            getCycleValueAtYear(spiritualCycle, birthYear, y)
        );
        return `<td>${e}</td>`;
    }).join('');

    return `
        <div class="table-wrap">
        <table>
            <tbody>
                <tr class="row-year"><td class="label-cell">Năm</td>${yearCells}</tr>
                <tr class="row-age"><td class="label-cell">Tuổi</td>${ageCells}</tr>
                <tr class="row-physical"><td class="label-cell">Thể chất</td>${physicalCells}</tr>
                <tr class="row-mental"><td class="label-cell">Tinh thần</td>${mentalCells}</tr>
                <tr class="row-spiritual"><td class="label-cell">Linh hồn</td>${spiritualCells}</tr>
                <tr class="row-essence"><td class="label-cell">Thông điệp</td>${essenceCells}</tr>
            </tbody>
        </table>
        </div>
    `;
}
