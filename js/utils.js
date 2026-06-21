function removeVietnameseAccents(str) {
    const map = {
        'á':'a','à':'a','ả':'a','ã':'a','ạ':'a',
        'ă':'a','ắ':'a','ằ':'a','ẳ':'a','ẵ':'a','ặ':'a',
        'â':'a','ấ':'a','ầ':'a','ẩ':'a','ẫ':'a','ậ':'a',
        'đ':'d',
        'é':'e','è':'e','ẻ':'e','ẽ':'e','ẹ':'e',
        'ê':'e','ế':'e','ề':'e','ể':'e','ễ':'e','ệ':'e',
        'í':'i','ì':'i','ỉ':'i','ĩ':'i','ị':'i',
        'ó':'o','ò':'o','ỏ':'o','õ':'o','ọ':'o',
        'ô':'o','ố':'o','ồ':'o','ổ':'o','ỗ':'o','ộ':'o',
        'ơ':'o','ớ':'o','ờ':'o','ở':'o','ỡ':'o','ợ':'o',
        'ú':'u','ù':'u','ủ':'u','ũ':'u','ụ':'u',
        'ư':'u','ứ':'u','ừ':'u','ử':'u','ữ':'u','ự':'u',
        'ý':'y','ỳ':'y','ỷ':'y','ỹ':'y','ỵ':'y'
    };
    return str.split('').map(ch => map[ch] || ch).join('');
}

function reduceToMaster(num) {
    if (num === 11 || num === 22) return num;
    let sum = num;
    while (sum > 9 && sum !== 11 && sum !== 22) {
        sum = String(sum).split('').reduce((a, b) => a + Number(b), 0);
    }
    return sum;
}

function reduceToSingle(num) {
    while (num > 9) {
        num = String(num).split('').reduce((a, b) => a + Number(b), 0);
    }
    return num;
}
