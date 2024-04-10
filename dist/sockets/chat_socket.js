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
exports.socketChatMessages = void 0;
const chat_controller_1 = require("../controllers/chat_controller");
const user_controller_1 = require("../controllers/user_controller");
const verify_token_1 = require("../middleware/verify_token");
const socketChatMessages = (io) => {
    const nameSpaceChat = io.of('/socket-chat-message');
    nameSpaceChat.on('connection', (client) => __awaiter(void 0, void 0, void 0, function* () {
        const [verify, uidPerson] = (0, verify_token_1.verifyTokenSocket)(client.handshake.headers['xxx-token']);
        if (!verify) {
            return client.disconnect();
        }
        console.log('USER CONNECTED');
        yield (0, user_controller_1.updateOnlineUser)(uidPerson);
        client.join(uidPerson);
        client.on('message-personal', (payload) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(payload);
            yield (0, chat_controller_1.InsertListChat)(payload.from, payload.to);
            yield (0, chat_controller_1.updateLastMessage)(payload.to, payload.from, payload.message);
            yield (0, chat_controller_1.addNewMessage)(payload.from, payload.to, payload.message);
            nameSpaceChat.to(payload.to).emit('message-personal', payload);
        }));
        client.on('disconnect', (_) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, user_controller_1.updateOfflineUser)(uidPerson);
            console.log('USER DISCONNECT');
        }));
    }));
};
exports.socketChatMessages = socketChatMessages;
