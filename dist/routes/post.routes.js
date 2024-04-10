"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_token_1 = require("../middleware/verify_token");
const post = __importStar(require("../controllers/post_controller"));
const multer_1 = require("../lib/multer");
const router = (0, express_1.Router)();
router.post('/post/create-new-post', [verify_token_1.verifyToken, multer_1.uploadsPost.array('imagePosts')], post.createNewPost);
router.get('/post/get-all-posts', verify_token_1.verifyToken, post.getAllPostHome);
router.get('/post/get-post-by-idPerson', verify_token_1.verifyToken, post.getPostByIdPerson);
router.post('/post/save-post-by-user', verify_token_1.verifyToken, post.savePostByUser);
router.get('/post/get-list-saved-posts', verify_token_1.verifyToken, post.getListSavedPostsByUser);
router.get('/post/get-all-posts-for-search', verify_token_1.verifyToken, post.getAllPostsForSearch);
router.post('/post/like-or-unlike-post', verify_token_1.verifyToken, post.likeOrUnLikePost);
router.get('/post/get-comments-by-idpost/:uidPost', verify_token_1.verifyToken, post.getCommentsByIdPost);
router.post('/post/add-new-comment', verify_token_1.verifyToken, post.addNewComment);
router.put('/post/like-or-unlike-comment', verify_token_1.verifyToken, post.likeOrUnLikeComment);
router.get('/post/get-all-post-by-user-id', verify_token_1.verifyToken, post.getAllPostByUserID);
exports.default = router;
