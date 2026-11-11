"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActivity = exports.getActivities = void 0;
const express_1 = require("express");
const Activity_1 = require("../models/Activity");
const User_1 = require("../models/User");
const firebaseService_1 = require("../services/firebaseService");
const getActivities = async (req, res, next) => {
    try {
        const auth0Id = req.auth?.payload.sub;
        const user = await User_1.User.findOne({ auth0Id });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const activities = await Activity_1.Activity.find({ userId: user._id }).sort({ createdAt: -1 });
        res.json(activities);
    }
    catch (err) {
        next(err);
    }
};
exports.getActivities = getActivities;
const createActivity = async (req, res, next) => {
    try {
        const auth0Id = req.auth?.payload.sub;
        const user = await User_1.User.findOne({ auth0Id });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const activity = await Activity_1.Activity.create({ userId: user._id, ...req.body });
        await (0, firebaseService_1.logActivityToFirebase)(activity.toObject());
        res.status(201).json(activity);
    }
    catch (err) {
        next(err);
    }
};
exports.createActivity = createActivity;
//# sourceMappingURL=activity.js.map