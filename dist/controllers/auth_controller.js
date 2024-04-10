"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renweLogin = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const connection_1 = require("../database/connection");
const generate_jwt_1 = require("../lib/generate_jwt");
// import { sendEmailVerify } from '../lib/nodemail';
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const conn = yield (0, connection_1.connect)();
        // Check is exists Email on database 
        const [verifyUserdb] = yield conn.query('SELECT email, passwordd, email_verified FROM users WHERE email = ?', [email]);
        if (verifyUserdb.length == 0) {
            return res.status(401).json({
                resp: false,
                message: 'Credentials are not registered'
            });
        }
        const verifyUser = verifyUserdb[0];
        // Check Email is Verified
        if (!verifyUser.email_verified) {
            resendCodeEmail(verifyUser.email);
            return res.status(401).json({
                resp: false,
                message: 'Please check your email'
            });
        }
        // Check Password
        if (!(yield bcrypt_1.default.compareSync(password, verifyUser.passwordd))) {
            return res.status(401).json({
                resp: false,
                message: 'Incorrect credentials'
            });
        }
        const uidPersondb = yield conn.query('SELECT person_uid as uid FROM users WHERE email = ?', [email]);
        const { uid } = uidPersondb[0][0];
        let token = (0, generate_jwt_1.generateJsonWebToken)(uid);
        conn.end();
        return res.json({
            resp: true,
            message: 'Welcome to Hellogram',
            token: token
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.login = login;
const renweLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, generate_jwt_1.generateJsonWebToken)(req.idPerson);
        return res.json({
            resp: true,
            message: 'Welcome to Hellogram',
            token: token
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.renweLogin = renweLogin;
const resendCodeEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield (0, connection_1.connect)();
    var randomNumber = Math.floor(10000 + Math.random() * 90000);
    yield conn.query('UPDATE users SET token_temp = ? WHERE email = ?', [randomNumber, email]);
    // await sendEmailVerify('Codigo de verificación', email, `<h1> Social Frave </h1><hr> <b>${ randomNumber } </b>`);
    conn.end();
});
