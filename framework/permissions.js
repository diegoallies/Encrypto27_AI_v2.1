/**
 * Permission Checking Utilities
 * Clean permission and user role checking
 */

/**
 * Check if user is a super user (owner or sudo)
 */
async function isSuperUser(auteurMessage, conf, getAllSudoNumbers) {
    const devNumbers = ['22559763447', '22543343357', '22564297888', '22891733300'];
    const ownerNumber = conf.NUMERO_OWNER?.replace(/[^0-9]/g, '');
    
    const superUserNumbers = [
        ownerNumber,
        ...devNumbers
    ]
        .filter(Boolean)
        .map(num => num.replace(/[^0-9]/g) + "@s.whatsapp.net");
    
    const sudoNumbers = await getAllSudoNumbers();
    const allAllowedNumbers = [...superUserNumbers, ...sudoNumbers];
    
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
