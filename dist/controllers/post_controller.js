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
exports.getAllPostByUserID = exports.likeOrUnLikeComment = exports.addNewComment = exports.getCommentsByIdPost = exports.likeOrUnLikePost = exports.getAllPostsForSearch = exports.getListSavedPostsByUser = exports.savePostByUser = exports.getPostByIdPerson = exports.getAllPostHome = exports.createNewPost = void 0;
const uuid_1 = require("uuid");
const connection_1 = require("../database/connection");
const createNewPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { comment, type_privacy, post_emotion } = req.body;
        const files = req.files;
        const conn = yield (0, connection_1.connect)();
        const uidPost = (0, uuid_1.v4)();
        yield conn.query('INSERT INTO posts (uid, type_privacy, person_uid,post_emotion) value (?,?,?,?)', [uidPost, type_privacy, req.idPerson, post_emotion]);
        yield conn.query('INSERT INTO comments (uid, comment, person_uid, post_uid) VALUE (?,?,?,?)', [(0, uuid_1.v4)(), comment, req.idPerson, uidPost]);
        files.forEach((img) => __awaiter(void 0, void 0, void 0, function* () {
            yield conn.query('INSERT INTO images_post (uid, image, post_uid) VALUES (?,?,?)', [(0, uuid_1.v4)(), img.filename, uidPost]);
        }));
        return res.json({
            resp: true,
            message: 'Posted'
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.createNewPost = createNewPost;
const getAllPostHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const postdb = yield conn.query(`CALL SP_GET_ALL_POSTS_HOME(?);`, [req.idPerson]);
        const imagesdb = postdb[0][0].testing;
        yield conn.end();
        return res.json({
            resp: true,
            message: 'Get All Post',
            posts: postdb[0][0],
            imagesdb
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.getAllPostHome = getAllPostHome;
const getPostByIdPerson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const postdb = yield conn.query(`CALL SP_GET_POST_BY_ID_PERSON(?);`, [req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Get Posts by IdPerson',
            post: postdb[0][0]
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.getPostByIdPerson = getPostByIdPerson;
const savePostByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { post_uid } = req.body;
        const conn = yield (0, connection_1.connect)();
        yield conn.query('INSERT INTO post_save(post_save_uid, post_uid, person_uid) VALUE (?,?,?)', [(0, uuid_1.v4)(), post_uid, req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Posted save'
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.savePostByUser = savePostByUser;
const getListSavedPostsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const listSavedPost = yield conn.query(`CALL SP_GET_LIST_POST_SAVED_BY_USER(?);`, [req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'List Saved Post',
            listSavedPost: listSavedPost[0][0]
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.getListSavedPostsByUser = getListSavedPostsByUser;
const getAllPostsForSearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const postsdb = yield conn.query(`CALL SP_GET_ALL_POSTS_FOR_SEARCH(?);`, [req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Get All Post For Search',
            posts: postsdb[0][0]
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.getAllPostsForSearch = getAllPostsForSearch;
const likeOrUnLikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uidPost, uidPerson } = req.body;
        const conn = yield (0, connection_1.connect)();
        const isLikedb = yield conn.query('SELECT COUNT(uid_likes) AS uid_likes FROM likes WHERE user_uid = ? AND post_uid = ? LIMIT 1', [req.idPerson, uidPost]);
        if (isLikedb[0][0].uid_likes > 0) {
            yield conn.query('DELETE FROM likes WHERE user_uid = ? AND post_uid = ?', [req.idPerson, uidPost]);
            yield conn.query('DELETE FROM notifications WHERE type_notification = 2 AND user_uid = ? AND post_uid = ?', [uidPerson, uidPost]);
            conn.end();
            return res.json({
                resp: true,
                message: 'unlike',
            });
        }
        yield conn.query('INSERT INTO likes (uid_likes, user_uid, post_uid) VALUE (?,?,?)', [(0, uuid_1.v4)(), req.idPerson, uidPost]);
        yield conn.query('INSERT INTO notifications (uid_notification, type_notification, user_uid, followers_uid, post_uid) VALUE (?,?,?,?,?)', [(0, uuid_1.v4)(), 2, uidPerson, req.idPerson, uidPost]);
        conn.end();
        return res.json({
            resp: true,
            message: 'like',
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.likeOrUnLikePost = likeOrUnLikePost;
const getCommentsByIdPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const commentsdb = yield conn.query(`CALL SP_GET_COMMNETS_BY_UIDPOST(?);`, [req.params.uidPost]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Get Commets',
            comments: commentsdb[0][0]
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.getCommentsByIdPost = getCommentsByIdPost;
const addNewComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uidPost, comment } = req.body;
        const conn = yield (0, connection_1.connect)();
        yield conn.query('INSERT INTO comments (uid, comment, person_uid, post_uid) VALUE (?,?,?,?)', [(0, uuid_1.v4)(), comment, req.idPerson, uidPost]);
        conn.end();
        return res.json({
            resp: true,
            message: 'New comment'
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.addNewComment = addNewComment;
const likeOrUnLikeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uidComment } = req.body;
        const conn = yield (0, connection_1.connect)();
        const isLikedb = yield conn.query('SELECT is_like FROM comments WHERE uid = ? LIMIT 1', [uidComment]);
        if (isLikedb[0][0].is_like > 0) {
            yield conn.query('UPDATE comments SET is_like = ? WHERE uid = ?', [0, uidComment]);
            conn.end();
            return res.json({
                resp: true,
                message: 'unlike comment',
            });
        }
        yield conn.query('UPDATE comments SET is_like = ? WHERE uid = ?', [1, uidComment]);
        conn.end();
        return res.json({
            resp: true,
            message: 'like comment',
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.likeOrUnLikeComment = likeOrUnLikeComment;
const getAllPostByUserID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const postsdb = yield conn.query(`CALL SP_GET_ALL_POST_BY_USER(?);`, [req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Posts By User ID',
            postUser: postsdb[0][0]
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.getAllPostByUserID = getAllPostByUserID;
