"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFileSchema = void 0;
const zod_1 = require("zod");
exports.updateFileSchema = zod_1.z.object({
    filename: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional()
});
//# sourceMappingURL=index.js.map