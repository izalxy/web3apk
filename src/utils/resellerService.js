/**
 * Reseller Service
 * Manages reseller privileges and data
 */

const fs = require('fs-extra');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'resellers.json');

class ResellerService {
    constructor() {
        this.resellers = {};
        this.loadDatabase();
    }

    loadDatabase() {
        if (fs.existsSync(DB_PATH)) {
            try {
                const data = fs.readFileSync(DB_PATH, 'utf8');
                this.resellers = JSON.parse(data);
                console.log(`💼 Resellers loaded: ${Object.keys(this.resellers).length} resellers`);
            } catch (e) {
                console.error('Failed to load resellers:', e.message);
                this.resellers = {};
            }
        }
    }

    persist() {
        try {
            fs.writeFileSync(DB_PATH, JSON.stringify(this.resellers, null, 2));
        } catch (e) {
            console.error('Failed to save resellers:', e.message);
        }
    }

    /**
     * Add a new reseller
     * @param {string|number} userId - Telegram User ID
     * @param {string} name - Reseller Name
     * @returns {object} - { success, error }
     */
    addReseller(userId, name) {
        const id = String(userId).trim();

        if (this.resellers[id]) {
            return { success: false, error: 'User ini sudah menjadi reseller' };
        }

        this.resellers[id] = {
            id: id,
            name: name,
            createdAt: new Date().toISOString()
        };

        this.persist();
        return { success: true };
    }

    /**
     * Remove a reseller
     * @param {string|number} userId - Telegram User ID
     * @returns {object} - { success, error }
     */
    removeReseller(userId) {
        const id = String(userId).trim();

        if (!this.resellers[id]) {
            return { success: false, error: 'User bukan reseller' };
        }

        delete this.resellers[id];
        this.persist();
        return { success: true };
    }

    /**
     * Check if user is a reseller
     * @param {string|number} userId 
     * @returns {boolean}
     */
    isReseller(userId) {
        const id = String(userId).trim();
        return !!this.resellers[id];
    }

    /**
     * Get all resellers
     * @returns {Array}
     */
    listResellers() {
        return Object.values(this.resellers);
    }

    /**
     * Get reseller details
     * @param {string|number} userId
     * @returns {object|null}
     */
    getReseller(userId) {
        const id = String(userId).trim();
        return this.resellers[id] || null;
    }
}

module.exports = new ResellerService();
