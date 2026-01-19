/**
 * Permission Checking Utilities
 * Clean permission and user role checking
 */

/**
 * Check if user is a super user (owner or sudo)
 */
async function isSuperUser(auteurMessage, conf, getAllSudoNumbers) {
    const devNumbers = ['22559763447', '22543343357', '22564297888', '22891733300'];
    
    // Get owner number and clean it - handle case where it might be a name
    let ownerNumber = conf.NUMERO_OWNER;
    if (ownerNumber && typeof ownerNumber === 'string') {
        // Extract only digits
        ownerNumber = ownerNumber.replace(/[^0-9]/g, '');
        // If it's too short or looks like a name, try to get from environment
        if (ownerNumber.length < 8) {
            ownerNumber = process.env.NUMERO_OWNER?.replace(/[^0-9]/g, '') || '';
        }
    }
    
    // Build super user list
    const superUserNumbers = [];
    if (ownerNumber && ownerNumber.length >= 8) {
        superUserNumbers.push(ownerNumber + "@s.whatsapp.net");
    }
    
    // Add dev numbers
    devNumbers.forEach(num => {
        const cleanNum = num.replace(/[^0-9]/g, '');
        if (cleanNum && cleanNum.length >= 8) {
            superUserNumbers.push(cleanNum + "@s.whatsapp.net");
        }
    });
    
    // Get sudo numbers
    let sudoNumbers = [];
    try {
        sudoNumbers = await getAllSudoNumbers() || [];
    } catch (e) {
        console.error("Error getting sudo numbers:", e);
    }
    
    const allAllowedNumbers = [...superUserNumbers, ...sudoNumbers];
    
    // Debug log
    if (allAllowedNumbers.length > 0) {
        console.log(`[DEBUG] Checking superUser: ${auteurMessage}, Allowed: ${allAllowedNumbers.slice(0, 3).join(', ')}...`);
    }
    
    // Check if user is in the list
    return allAllowedNumbers.includes(auteurMessage);
}

/**
 * Check if user is a developer
 */
function isDev(auteurMessage) {
    const devNumbers = ['22559763447', '22543343357', '22564297888', '22891733300'];
    return devNumbers
        .map(num => num.replace(/[^0-9]/g) + "@s.whatsapp.net")
        .includes(auteurMessage);
}

/**
 * Check if user is a group admin
 */
function isGroupAdmin(auteurMessage, admins) {
    if (!admins || !Array.isArray(admins)) return false;
    return admins.includes(auteurMessage);
}

module.exports = {
    isSuperUser,
    isDev,
    isGroupAdmin
};
