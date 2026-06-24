const dataCache = {};

function fetchNumberData(number) {
    return new Promise((resolve, reject) => {
        const key = String(number);
        if (dataCache[key]) {
            resolve(dataCache[key]);
            return;
        }
        fetch(`data/${key}.json`)
            .then(res => {
                if (!res.ok) throw new Error(`Không tìm thấy dữ liệu cho số ${key}`);
                return res.json();
            })
            .then(data => {
                dataCache[key] = data;
                resolve(data);
            })
            .catch(err => {
                console.warn(`Lỗi tải data/${key}.json, dùng dữ liệu mặc định.`, err);
                const defaultData = {
                    name: `Số ${key}`,
                    lifePathNumber: { title: `Số Đường Đời`, description: `Mô tả cho số ${key} (chưa có dữ liệu)` },
                    lifePath: `Mô tả cho số ${key} (chưa có dữ liệu)`,
                    personalYear: `Mô tả năm cá nhân ${key} (chưa có)`,
                    action: `Hành động gợi ý cho số ${key}`,
                    soulNumber: { title: `Số Linh Hồn`, description: `Mô tả linh hồn ${key}` },
                    soul: `Mô tả linh hồn ${key}`,
                    personalityNumber: { title: `Số Tính Cách`, description: `Mô tả nhân cách ${key}` },
                    personality: `Mô tả nhân cách ${key}`,
                    destinyNumber: { title: `Số Sứ Mệnh`, description: `Mô tả sứ mệnh ${key}` },
                    destiny: `Mô tả sứ mệnh ${key}`,
                    birthDayNumber: { title: `Số Ngày Sinh`, description: `Mô tả ngày sinh ${key}` },
                    birthDay: `Mô tả ngày sinh ${key}`,
                    peak: `Mô tả đỉnh cao ${key}`,
                    challenge: `Mô tả thử thách ${key}`,
                    maturityNumber: { title: `Số Trưởng Thành`, description: `Mô tả cho số trưởng thành ${key}` },
                    karmicLessonNumber: { title: `Bài Học Nhân Quả`, description: `Mô tả bài học nhân quả ${key}` },
                    cycle1: `Mô tả chu kỳ 1`,
                    cycle2: `Mô tả chu kỳ 2`,
                    cycle3: `Mô tả chu kỳ 3`,
                    personalMessage: `Thông điệp cá nhân cho số ${key} (chưa có dữ liệu)`,
                    strengths: [],
                    weaknesses: [],
                    lifeLessons: [],
                    verificationQuestions: [],
                    example: [],
                    affirmation: ''
                };
                dataCache[key] = defaultData;
                resolve(defaultData);
            });
    });
}

function fetchMultipleNumbers(numbers) {
    const unique = [...new Set(numbers.map(n => String(n)))];
    return Promise.all(unique.map(num => fetchNumberData(num)));
}
