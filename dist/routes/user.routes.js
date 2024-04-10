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
const user = __importStar(require("../controllers/user_controller"));
const multer_1 = require("../lib/multer");
const verify_token_1 = require("../middleware/verify_token");
const router = (0, express_1.Router)();
router.post('/user', user.createUser);
router.get('/user/get-User-By-Id', verify_token_1.verifyToken, user.getUserById);
router.get('/user/verify-email/:code/:email', user.verifyEmail);
// Middleware [ Token, image ]  - Profile Image required
router.put('/user/update-cover', [verify_token_1.verifyToken, multer_1.uploadsCover.single('cover')], user.updatePictureCover);
router.put('/user/update-image-profile', [verify_token_1.verifyToken, multer_1.uploadsProfile.single('profile')], user.updatePictureProfile);
router.put('/user/update-data-profile', verify_token_1.verifyToken, user.updateProfile);
router.put('/user/change-password', verify_token_1.verifyToken, user.changePassword);
router.put('/user/change-account-privacy', verify_token_1.verifyToken, user.changeAccountPrivacy);
router.get('/user/get-search-user/:username', verify_token_1.verifyToken, user.getSearchUser);
router.get('/user/get-another-user-by-id/:idUser', verify_token_1.verifyToken, user.getAnotherUserById);
router.post('/user/add-new-friend', verify_token_1.verifyToken, user.AddNewFollowing);
router.post('/user/accept-follower-request', verify_token_1.verifyToken, user.AcceptFollowerRequest);
router.delete('/user/delete-following/:idUser', verify_token_1.verifyToken, user.deleteFollowing);
router.get('/user/get-all-following', verify_token_1.verifyToken, user.getAllFollowings);
router.get('/user/get-all-followers', verify_token_1.verifyToken, user.getAllFollowers);
router.delete('/user/delete-followers/:idUser', verify_token_1.verifyToken, user.deleteFollowers);
exports.default = router;
