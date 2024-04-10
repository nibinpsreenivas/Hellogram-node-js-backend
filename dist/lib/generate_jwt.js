"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJsonWebToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Generate new Json Web Token 
const generateJsonWebToken = (idPerson) => {
    try {
        return jsonwebtoken_1.default.sign({ idPerson }, process.env.TOKEN_SECRET || 'Frave_Social', {
            expiresIn: '24h'
        });
    }
    catch (err) {
        return 'Error al generar el Jwt - Token';
    }
};
exports.generateJsonWebToken = generateJsonWebToken;
