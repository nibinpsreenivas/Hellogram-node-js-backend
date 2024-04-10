"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenSocket = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Verify token to Routes
const verifyToken = (req, res, next) => {
    let token = req.header('xxx-token');
    if (!token) {
        return res.status(401).json({
            resp: false,
            message: 'Acceso denegado'
        });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET || 'Frave_Social');
        req.idPerson = payload.idPerson;
        next();
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
};
exports.verifyToken = verifyToken;
// Verify token to Socket 
const verifyTokenSocket = (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET || 'Frave_Social');
        return [true, payload.idPerson];
    }
    catch (err) {
        return [false, ''];
    }
};
exports.verifyTokenSocket = verifyTokenSocket;
