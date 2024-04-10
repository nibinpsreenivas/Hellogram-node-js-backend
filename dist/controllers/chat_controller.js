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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMessagesByUser = exports.addNewMessage = exports.updateLastMessage = exports.InsertListChat = exports.getListMessagesByUser = void 0;
const uuid_1 = require("uuid");
const connection_1 = require("../database/connection");
const getListMessagesByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const listdb = yield conn.query(`CALL SP_GET_ALL_MESSAGE_BY_USER(?);`, [req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'All Messages list by user',
            listChat: listdb[0][0]
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.getListMessagesByUser = getListMessagesByUser;
const InsertListChat = (uidSource, uidTarget) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield (0, connection_1.connect)();
    const verifyExistsSourceone = yield conn.query('SELECT COUNT(uid_list_chat) AS chat FROM list_chats WHERE source_uid = ? AND target_uid = ? LIMIT 1', [uidSource, uidTarget]);
    if (verifyExistsSourceone[0][0].chat == 0) {
        yield conn.query('INSERT INTO list_chats (uid_list_chat, source_uid, target_uid) VALUE (?,?,?)', [(0, uuid_1.v4)(), uidSource, uidTarget]);
    }
    conn.end();
});
exports.InsertListChat = InsertListChat;
const updateLastMessage = (uidTarget, uidPerson, message) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield (0, connection_1.connect)();
    const update = new Date().toISOString().slice(0, 19).replace('T', ' ');
    yield conn.query('UPDATE list_chats SET last_message = ?, updated_at = ? WHERE source_uid = ? AND target_uid = ?', [message, update, uidPerson, uidTarget]);
    conn.end();
});
exports.updateLastMessage = updateLastMessage;
const addNewMessage = (uidSource, uidTarget, message) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield (0, connection_1.connect)();
    yield conn.query('INSERT INTO messages (uid_messages, source_uid, target_uid, message) VALUE (?,?,?,?)', [(0, uuid_1.v4)(), uidSource, uidTarget, message]);
    conn.end();
});
exports.addNewMessage = addNewMessage;
const getAllMessagesByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const messagesdb = yield conn.query(`CALL SP_ALL_MESSAGE_BY_USER(?,?);`, [req.idPerson, req.params.from]);
        conn.end();
        return res.json({
            resp: true,
            message: 'get all messages by user',
            listMessage: messagesdb[0][0]
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.getAllMessagesByUser = getAllMessagesByUser;
