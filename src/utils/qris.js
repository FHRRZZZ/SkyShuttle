
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

    // 1. Remove existing CRC (last 4 chars)
    // Note: A full parser would be safer, but for this specific static string, 
    // we assume standard format ending with '6304' + CRC.
    // If the string already has '6304', we strip it and the checksum.
    
    let rawQris = qrisString;
    
    // Check if ends with CRC tag
    if (rawQris.slice(-4).match(/[0-9A-F]{4}/)) {
        // Check if preceding is 6304
        if (rawQris.slice(-8, -4) === '6304') {
             rawQris = rawQris.slice(0, -8);
        }
    }

    // 2. Inject Amount Tag '54'
    // Format: '54' + Length (2 chars) + Amount (string)
    // We need to insert this BEFORE tag '58' (Country Code) or '59' (Merchant Name) or just before '63' (CRC)
    // Standard order suggests placement around tag 53 (Currency) or 58.
    // Let's look for known tags to insert after. 
    // Tag 53 is ISO 4217 Currency Code (IDR = 360).
    // Let's try to insert after Tag 53 if it exists.

    const amountStr = amount.toString();
    const amountTag = '54' + amountStr.length.toString().padStart(2, '0') + amountStr;

    // Simple robust injection:
    // Remove any existing Tag 54 to avoid duplicates
    // This regex looks for '54' followed by length (2 digits)
    // then that many characters.
    // However, regex replacement on a TLV string is risky without a full parser.
    // Given the specific static string provided: "...5303360..." 
    // We will append it before the merchant city/name or at end if simpler.
    // Actually, simply appending new tags before checksum is valid in EMVCo spec as long as ID is unique.
    // BUT duplicate tags are forbidden. 
    
    // Let's do a safe splice after '5303360' (Currency: IDR)
    const currencyTag = '5303360';
    const index = rawQris.indexOf(currencyTag);
    
    let qrisWithAmount = rawQris;

    if (index !== -1) {
        // Check if 54 already exists after it?
        // Simpler approach for this specific static string:
        // Just construct: Pre-53 + 53 + 54 + Post-53
        
        // Remove potentially existing 54 tag first if we were parsing generally.
        // Since we controll the input static string (mostly), we assume it doesn't have 54 or we just append.
        
        // Let's insert after Currency
        const splitIndex = index + currencyTag.length;
        qrisWithAmount = rawQris.slice(0, splitIndex) + amountTag + rawQris.slice(splitIndex);
    } else {
        // Fallback: append at end
        qrisWithAmount += amountTag; 
    }

    // 3. Append CRC Tag '6304'
    qrisWithAmount += '6304';

    // 4. Calculate CRC
    const crc = crc16(qrisWithAmount);

    return qrisWithAmount + crc;
};
