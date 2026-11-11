"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const express_1 = require("express");
const User_1 = require("../models/User");
const getProfile = async (req, res, next) => {
    try {
        const auth0Id = req.auth?.payload.sub;
        let user = await User_1.User.findOne({ auth0Id });
        if (!user) {
            user = await User_1.User.create({ auth0Id, email: `user-${Date.now()}@example.com`, name: 'New User' });
        }
        res.json(user);
    }
    catch (err) {
        next(err);
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res, next) => {
    try {
        const auth0Id = req.auth?.payload.sub;
        const user = await User_1.User.findOneAndUpdate({ auth0Id }, req.body, { new: true });
        res.json(user);
    }
    catch (err) {
        next(err);
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=auth.js.map