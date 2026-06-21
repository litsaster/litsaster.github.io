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
                    lifePath: `Mô tả cho số ${key} (chưa có dữ liệu)`,
                    personalYear: `Mô tả năm cá nhân ${key} (chưa có)`,
                    action: `Hành động gợi ý cho số ${key}`,
                    soul: `Mô tả linh hồn ${key}`,
                    personality: `Mô tả nhân cách ${key}`,
                    destiny: `Mô tả sứ mệnh ${key}`,
                    peak: `Mô tả đỉnh cao ${key}`,
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
