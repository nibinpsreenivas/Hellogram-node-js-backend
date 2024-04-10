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
exports.getStoryByUser = exports.getAllStoryHome = exports.addNewStory = void 0;
const uuid_1 = require("uuid");
const connection_1 = require("../database/connection");
const addNewStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const conn = yield (0, connection_1.connect)();
        const userdb = yield conn.query('SELECT uid_story FROM stories WHERE user_uid = ? LIMIT 1', req.idPerson);
        if (userdb[0].length > 0) {
            yield conn.query('INSERT INTO media_story (uid_media_story, media, story_uid) VALUE (?,?,?)', [(0, uuid_1.v4)(), (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename, userdb[0][0].uid_story]);
            return res.json({
                resp: true,
                message: 'new story'
            });
        }
        yield conn.query(`CALL SP_ADD_NEW_STORY(?,?,?,?);`, [(0, uuid_1.v4)(), req.idPerson, (0, uuid_1.v4)(), (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename]);
        return res.json({
            resp: true,
            message: 'new story',
            userdb: userdb[0],
            count: userdb[0].length
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.addNewStory = addNewStory;
const getAllStoryHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const storiesdb = yield conn.query(`CALL SP_GET_ALL_STORIES_HOME(?);`, [req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Get All Stories By User',
            stories: storiesdb[0][0]
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.getAllStoryHome = getAllStoryHome;
const getStoryByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const storydb = yield conn.query(`CALL SP_GET_STORY_BY_USER(?);`, [req.params.idStory]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Get Stories',
            listStories: storydb[0][0]
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.getStoryByUser = getStoryByUser;
