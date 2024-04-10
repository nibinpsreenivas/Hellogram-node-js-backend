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
exports.updateOfflineUser = exports.updateOnlineUser = exports.deleteFollowers = exports.getAllFollowers = exports.getAllFollowings = exports.deleteFollowing = exports.AcceptFollowerRequest = exports.AddNewFollowing = exports.getAnotherUserById = exports.getSearchUser = exports.changeAccountPrivacy = exports.changePassword = exports.updateProfile = exports.updatePictureProfile = exports.updatePictureCover = exports.verifyEmail = exports.getUserById = exports.createUser = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const connection_1 = require("../database/connection");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, fullname, email, password } = req.body;
        const conn = yield (0, connection_1.connect)();
        const [existsEmail] = yield conn.query('SELECT email FROM users WHERE email = ?', [email]);
        if (existsEmail.length > 0) {
            return res.status(401).json({
                resp: false,
                message: 'El correo ya existe!'
            });
        }
        let salt = bcrypt_1.default.genSaltSync();
        const pass = bcrypt_1.default.hashSync(password, salt);
        var randomNumber = Math.floor(10000 + Math.random() * 90000);
        yield conn.query(`CALL SP_REGISTER_USER(?,?,?,?,?,?,?);`, [(0, uuid_1.v4)(), fullname, username, email, pass, (0, uuid_1.v4)(), randomNumber]);
        // await sendEmailVerify('Codigo de verificación', email, `<h1> Social Frave </h1><hr> <b>${ randomNumber } </b>`);
        conn.end();
        return res.json({
            resp: true,
            message: 'Usuario registrado con exito'
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.createUser = createUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const [userdb] = yield conn.query(`CALL SP_GET_USER_BY_ID(?);`, [req.idPerson]);
        const posters = yield conn.query('	SELECT COUNT(person_uid) AS posters FROM posts WHERE person_uid = ?', [req.idPerson]);
        const friends = yield conn.query('SELECT COUNT(person_uid) AS friends FROM friends WHERE person_uid = ?', [req.idPerson]);
        const followers = yield conn.query('SELECT COUNT(person_uid) AS followers FROM followers WHERE person_uid = ?', [req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Get User by id',
            user: userdb[0][0],
            posts: {
                'posters': posters[0][0].posters,
                'friends': friends[0][0].friends,
                'followers': followers[0][0].followers
            },
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.getUserById = getUserById;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const [codedb] = yield conn.query('SELECT token_temp FROM users WHERE email = ? LIMIT 1', [req.params.email]);
        const { token_temp } = codedb[0];
        if (req.params.code != token_temp) {
            return res.status(401).json({
                resp: false,
                message: 'Verificación sin exito...'
            });
        }
        yield conn.query('UPDATE users SET email_verified = ?, token_temp = ? WHERE email = ?', [true, '', req.params.email]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Bienvenido validado con exito...'
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.verifyEmail = verifyEmail;
const updatePictureCover = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const coverPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        const conn = yield (0, connection_1.connect)();
        const imagedb = yield conn.query('SELECT cover FROM person WHERE uid = ? LIMIT 1', [req.idPerson]);
        if (imagedb[0][0].cover != null) {
            yield fs_extra_1.default.unlink(path_1.default.resolve('uploads/profile/cover/' + imagedb[0][0].cover));
        }
        yield conn.query('UPDATE person SET cover = ? WHERE uid = ?', [coverPath, req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Updated Cover'
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.updatePictureCover = updatePictureCover;
const updatePictureProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const profilePath = (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename;
        const conn = yield (0, connection_1.connect)();
        const imagedb = yield conn.query('SELECT image FROM person WHERE uid = ? LIMIT 1', [req.idPerson]);
        if (imagedb[0].length > 0) {
            if (imagedb[0][0].image != 'avatar-default.png') {
                yield fs_extra_1.default.unlink(path_1.default.resolve('uploads/profile/' + imagedb[0][0].image));
            }
        }
        yield conn.query('UPDATE person SET image = ? WHERE uid = ?', [profilePath, req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Updated Profile'
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.updatePictureProfile = updatePictureProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, description, fullname, phone } = req.body;
        const conn = yield (0, connection_1.connect)();
        yield conn.query('UPDATE users SET username = ?, description = ? WHERE person_uid = ?', [user, description, req.idPerson]);
        yield conn.query('UPDATE person SET fullname = ?, phone = ? WHERE uid = ?', [fullname, phone, req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'updated profile'
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.updateProfile = updateProfile;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentPassword, newPassword } = req.body;
        const conn = yield (0, connection_1.connect)();
        const passdb = yield conn.query('SELECT passwordd FROM users WHERE person_uid = ?', [req.idPerson]);
        if (!bcrypt_1.default.compareSync(currentPassword, passdb[0][0].passwordd)) {
            return res.status(400).json({
                resp: false,
                message: 'La contraseña no coincide'
            });
        }
        const salt = bcrypt_1.default.genSaltSync();
        const newPass = bcrypt_1.default.hashSync(newPassword, salt);
        yield conn.query('UPDATE users SET passwordd = ? WHERE person_uid = ?', [newPass, req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Password changed successfully',
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.changePassword = changePassword;
const changeAccountPrivacy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const accountdb = yield conn.query('SELECT is_private FROM users WHERE person_uid = ? LIMIT 1', [req.idPerson]);
        if (accountdb[0][0].is_private == 1) {
            yield conn.query('UPDATE users SET is_private = ? WHERE person_uid = ?', [0, req.idPerson]);
        }
        else {
            yield conn.query('UPDATE users SET is_private = ? WHERE person_uid = ?', [1, req.idPerson]);
        }
        conn.end();
        return res.json({
            resp: true,
            message: 'Account changed successfully',
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.changeAccountPrivacy = changeAccountPrivacy;
const getSearchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const userdb = yield conn.query(`CALL SP_SEARCH_USERNAME(?);`, [req.params.username]);
        conn.end();
        return res.json({
            resp: true,
            message: 'User finded',
            userFind: userdb[0][0]
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.getSearchUser = getSearchUser;
const getAnotherUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const [userdb] = yield conn.query(`CALL SP_GET_USER_BY_ID(?);`, [req.params.idUser]);
        const posters = yield conn.query('	SELECT COUNT(person_uid) AS posters FROM posts WHERE person_uid = ?', [req.params.idUser]);
        const friends = yield conn.query('SELECT COUNT(person_uid) AS friends FROM friends WHERE person_uid = ?', [req.params.idUser]);
        const followers = yield conn.query('SELECT COUNT(person_uid) AS followers FROM followers WHERE person_uid = ?', [req.params.idUser]);
        const posts = yield conn.query(`CALL SP_GET_POST_BY_IDPERSON(?);`, [req.params.idUser]);
        const isFollowing = yield conn.query('CALL SP_IS_FRIEND(?,?);', [req.idPerson, req.params.idUser]);
        const isPendingFollowers = yield conn.query(`CALL SP_IS_PENDING_FOLLOWER(?,?)`, [req.params.idUser, req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Get Another User by id',
            anotherUser: userdb[0][0],
            analytics: {
                'posters': posters[0][0].posters,
                'friends': friends[0][0].friends,
                'followers': followers[0][0].followers
            },
            postsUser: posts[0][0],
            is_friend: isFollowing[0][0][0].is_friend,
            isPendingFollowers: isPendingFollowers[0][0][0].is_pending_follower
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.getAnotherUserById = getAnotherUserById;
const AddNewFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uidFriend } = req.body;
        const conn = yield (0, connection_1.connect)();
        const isPrivateAccount = yield conn.query('SELECT is_private FROM users WHERE person_uid = ?', [uidFriend]);
        if (!isPrivateAccount[0][0].is_private) {
            yield conn.query('INSERT INTO friends (uid, person_uid, friend_uid) VALUE (?,?,?)', [(0, uuid_1.v4)(), req.idPerson, uidFriend]);
            yield conn.query('INSERT INTO followers (uid, person_uid, followers_uid) VALUE (?,?,?)', [(0, uuid_1.v4)(), uidFriend, req.idPerson]);
            conn.end();
            return res.json({
                resp: true,
                message: 'New friend'
            });
        }
        yield conn.query('INSERT INTO notifications (uid_notification, type_notification, user_uid, followers_uid) VALUE (?,?,?,?)', [(0, uuid_1.v4)(), '1', uidFriend, req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'New friend'
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.AddNewFollowing = AddNewFollowing;
const AcceptFollowerRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uidFriend, uidNotification } = req.body;
        const conn = yield (0, connection_1.connect)();
        yield conn.query('INSERT INTO friends (uid, person_uid, friend_uid) VALUE (?,?,?)', [(0, uuid_1.v4)(), uidFriend, req.idPerson]);
        yield conn.query('INSERT INTO followers (uid, person_uid, followers_uid) VALUE (?,?,?)', [(0, uuid_1.v4)(), req.idPerson, uidFriend]);
        yield conn.query('UPDATE notifications SET type_notification = ? WHERE uid_notification = ?', ['3', uidNotification]);
        conn.end();
        return res.json({
            resp: true,
            message: 'New friend'
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.AcceptFollowerRequest = AcceptFollowerRequest;
const deleteFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        yield conn.query('DELETE FROM friends WHERE person_uid = ? AND friend_uid = ?', [req.idPerson, req.params.idUser]);
        yield conn.query('DELETE FROM followers WHERE person_uid = ? AND followers_uid = ?', [req.params.idUser, req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Deleted friend'
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.deleteFollowing = deleteFollowing;
const getAllFollowings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const followings = yield conn.query(`CALL SP_GET_ALL_FOLLOWING(?);`, [req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Get All Following',
            followings: followings[0][0]
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.getAllFollowings = getAllFollowings;
const getAllFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        const followers = yield conn.query(`CALL SP_GET_ALL_FOLLOWERS(?);`, [req.idPerson]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Get All Following',
            followers: followers[0][0]
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.getAllFollowers = getAllFollowers;
const deleteFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield (0, connection_1.connect)();
        yield conn.query('DELETE FROM friends WHERE person_uid = ? AND friend_uid = ?', [req.params.idUser, req.idPerson]);
        yield conn.query('DELETE FROM followers WHERE person_uid = ? AND followers_uid = ?', [req.idPerson, req.params.idUser]);
        yield conn.query('DELETE FROM notifications WHERE type_notification = 3 AND user_uid = ? AND followers_uid = ?', [req.idPerson, req.params.idUser]);
        conn.end();
        return res.json({
            resp: true,
            message: 'Deleted friend'
        });
    }
    catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
});
exports.deleteFollowers = deleteFollowers;
const updateOnlineUser = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield (0, connection_1.connect)();
    yield conn.query('UPDATE users SET is_online = true WHERE person_uid = ?', [uid]);
    conn.end();
});
exports.updateOnlineUser = updateOnlineUser;
const updateOfflineUser = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield (0, connection_1.connect)();
    yield conn.query('UPDATE users SET is_online = false WHERE person_uid = ?', [uid]);
    conn.end();
});
exports.updateOfflineUser = updateOfflineUser;
