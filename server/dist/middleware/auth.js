"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwt = void 0;
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const checkJwt = (req, res, next) => {
    const issuerBaseURL = process.env.AUTH0_ISSUER_BASE_URL;
    const audience = process.env.AUTH0_AUDIENCE;
    if (!issuerBaseURL || !audience) {
        console.error('Missing Auth0 backend configuration (AUTH0_ISSUER_BASE_URL or AUTH0_AUDIENCE)');
        return res.status(500).json({ error: 'Auth0 backend configuration is missing.' });
    }
    const jwtMiddleware = (0, express_oauth2_jwt_bearer_1.auth)({
        audience,
        issuerBaseURL,
    });
    return jwtMiddleware(req, res, next);
};
exports.checkJwt = checkJwt;
//# sourceMappingURL=auth.js.map