"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwt = void 0;
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
exports.checkJwt = process.env.AUTH0_ISSUER_BASE_URL && process.env.AUTH0_AUDIENCE
    ? (0, express_oauth2_jwt_bearer_1.auth)({
        audience: process.env.AUTH0_AUDIENCE,
        issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    })
    : (req, res, next) => {
        // Dev mode auth mock
        req.auth = { payload: { sub: 'dev-user-123' } };
        next();
    };
//# sourceMappingURL=auth.js.map