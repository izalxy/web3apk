const resellerService = require('./resellerService');

/**
 * Check if a user is an admin
 * @param {string|number} userId 
 * @returns {boolean}
 */
function isAdmin(userId) {
    const adminIds = process.env.ADMIN_IDS?.split(',').map(id => id.trim()) || [];
    return adminIds.includes(String(userId));
}

/**
 * Check if a user is a reseller
 * @param {string|number} userId 
 * @returns {boolean}
 */
function isReseller(userId) {
    return resellerService.isReseller(userId);
}

module.exports = { isAdmin, isReseller };
