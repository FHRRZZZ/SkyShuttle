
// CRC16-CCITT (Poly 0x1021, Init 0xFFFF)
function crc16(data) {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
        let x = ((crc >> 8) ^ data.charCodeAt(i)) & 0xFF;
        x ^= x >> 4;
        crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xFFFF;
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

export const generateDynamicQris = (qrisString, amount) => {
    if (!qrisString || amount <= 0) return qrisString;

    let rawQris = qrisString;
    
    // 1. Remove existing CRC (last 4 chars) and its tag '6304'
    if (rawQris.slice(-8, -4) === '6304') {
        rawQris = rawQris.slice(0, -8);
    } else if (rawQris.slice(-4).match(/[0-9A-F]{4}/) && rawQris.includes('6304')) {
        // Fallback for cases where it's not exactly at the expected spot
        rawQris = rawQris.split('6304')[0];
    }

    // 2. Remove existing Amount Tag '54' if it exists to avoid duplicates
    // Tag 54 format: 54 + length(2 digits) + value
    const tag54Match = rawQris.match(/54(\d{2})/);
    if (tag54Match) {
        const length = parseInt(tag54Match[1], 10);
        const fullTag = '54' + tag54Match[1] + rawQris.substring(tag54Match.index + 4, tag54Match.index + 4 + length);
        rawQris = rawQris.replace(fullTag, '');
    }

    // 3. Prepare new Amount Tag '54'
    const amountStr = Math.round(amount).toString();
    const amountTag = '54' + amountStr.length.toString().padStart(2, '0') + amountStr;

    // 4. Inject Amount Tag
    // Standard: Insert after Tag 53 (Currency Code IDR = 360)
    const currencyTag = '5303360';
    const index = rawQris.indexOf(currencyTag);
    
    let qrisWithAmount = rawQris;

    if (index !== -1) {
        const splitIndex = index + currencyTag.length;
        qrisWithAmount = rawQris.slice(0, splitIndex) + amountTag + rawQris.slice(splitIndex);
    } else {
        // Fallback: append at end before CRC
        qrisWithAmount += amountTag; 
    }

    // 5. Append CRC Tag '6304'
    qrisWithAmount += '6304';

    // 6. Calculate CRC
    const crc = crc16(qrisWithAmount);

    return qrisWithAmount + crc;
};
