"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostById = exports.getPosts = void 0;
const express_1 = require("express");
const getPosts = async (req, res, next) => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        res.json(data);
    }
    catch (err) {
        next(err);
    }
};
exports.getPosts = getPosts;
const getPostById = async (req, res, next) => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${req.params.id}`);
        const data = await response.json();
        res.json(data);
    }
    catch (err) {
        next(err);
    }
};
exports.getPostById = getPostById;
//# sourceMappingURL=external.js.map