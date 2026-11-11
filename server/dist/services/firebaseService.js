"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivityToFirebase = void 0;
const app_1 = require("firebase-admin/app");
const database_1 = require("firebase-admin/database");
const logActivityToFirebase = async (activityData) => {
    if (!(0, app_1.getApps)().length) {
        console.warn('Firebase not initialized. Skipping RTDB write.');
        return;
    }
    try {
        const db = (0, database_1.getDatabase)();
        const ref = db.ref('activities');
        await ref.push({
            ...activityData,
            timestamp: database_1.ServerValue.TIMESTAMP
        });
    }
    catch (error) {
        console.error('Firebase DB write error:', error);
    }
};
exports.logActivityToFirebase = logActivityToFirebase;
//# sourceMappingURL=firebaseService.js.map