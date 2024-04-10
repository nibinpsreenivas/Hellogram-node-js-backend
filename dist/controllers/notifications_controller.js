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
exports.getNotificationsByUser = void 0;
const connection_1 = require("../database/connection");
const getNotificationsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const notificationdb = yield conn.query(`CALL SP_GET_NOTIFICATION_BY_USER(?)`, [req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Get Notifications',
            notificationsdb: notificationdb[0][0]
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.getNotificationsByUser = getNotificationsByUser;
