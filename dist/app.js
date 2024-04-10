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
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const socket_io_1 = __importDefault(require("socket.io"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const notifications_routes_1 = __importDefault(require("./routes/notifications.routes"));
const story_routes_1 = __importDefault(require("./routes/story.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const chat_socket_1 = require("./sockets/chat_socket");
class App {
    constructor() {
        this.apiRoutes = {
            user: '/api',
            auth: '/api',
            post: '/api',
            notification: '/api',
            story: '/api',
            chat: '/api',
        };
        this.app = (0, express_1.default)();
        this.httpServer = (0, http_1.createServer)(this.app);
        this.middlewares();
        this.routes();
        this.configServerSocket();
    }
    middlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(express_1.default.static(path_1.default.resolve('uploads/profile')));
        this.app.use(express_1.default.static(path_1.default.resolve('uploads/profile/cover')));
        this.app.use(express_1.default.static(path_1.default.resolve('uploads/posts')));
        this.app.use(express_1.default.static(path_1.default.resolve('uploads/stories')));
    }
    routes() {
        this.app.use(this.apiRoutes.user, user_routes_1.default);
        this.app.use(this.apiRoutes.auth, auth_routes_1.default);
        this.app.use(this.apiRoutes.post, post_routes_1.default);
        this.app.use(this.apiRoutes.notification, notifications_routes_1.default);
        this.app.use(this.apiRoutes.story, story_routes_1.default);
        this.app.use(this.apiRoutes.chat, chat_routes_1.default);
    }
    configServerSocket() {
        const io = new socket_io_1.default(this.httpServer);
        (0, chat_socket_1.socketChatMessages)(io);
    }
    listen(port) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.httpServer.listen(port);
            console.log(`SERVER RUN ON PORT ${port}`);
        });
    }
}
exports.App = App;
