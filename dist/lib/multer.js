"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadsStory = exports.uploadsPost = exports.uploadsProfile = exports.uploadsCover = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
// Path to store the cover image
var storageCover = multer_1.default.diskStorage({
    destination: 'uploads/profile/cover',
    filename: (_, file, cb) => {
        cb(null, (0, uuid_1.v4)() + path_1.default.extname(file.originalname));
    }
});
// Path to store the Profile image
var storageProfile = multer_1.default.diskStorage({
    destination: 'uploads/profile',
    filename: (req, file, cb) => {
        cb(null, (0, uuid_1.v4)() + path_1.default.extname(file.originalname));
    }
});
// Path to store the posts images
var storagePost = multer_1.default.diskStorage({
    destination: 'uploads/posts',
    filename: (_, file, cb) => {
        cb(null, (0, uuid_1.v4)() + path_1.default.extname(file.originalname));
    }
});
// Path to store the Story image
var storageStory = multer_1.default.diskStorage({
    destination: 'uploads/stories',
    filename: (_, file, cb) => {
        cb(null, (0, uuid_1.v4)() + path_1.default.extname(file.originalname));
    }
});
exports.uploadsCover = (0, multer_1.default)({ storage: storageCover });
exports.uploadsProfile = (0, multer_1.default)({ storage: storageProfile });
exports.uploadsPost = (0, multer_1.default)({ storage: storagePost });
exports.uploadsStory = (0, multer_1.default)({ storage: storageStory });
