"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const firebase_1 = require("./config/firebase");
const PORT = process.env.PORT || 5000;
async function startServer() {
    try {
        // Connect to MongoDB if URI is provided
        if (process.env.MONGODB_URI) {
            await mongoose_1.default.connect(process.env.MONGODB_URI, {
                dbName: process.env.MONGODB_DB_NAME || 'cloudvault'
            });
            console.log('✅ MongoDB Atlas connected successfully');
        }
        else {
            console.warn('⚠️ MONGODB_URI not found. Starting in Dev Mode without DB.');
        }
        // Initialize Firebase Admin
        (0, firebase_1.initializeFirebase)();
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map