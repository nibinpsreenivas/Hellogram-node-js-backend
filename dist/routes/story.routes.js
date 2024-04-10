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
const story = __importStar(require("../controllers/story_controller"));
const multer_1 = require("../lib/multer");
const router = (0, express_1.Router)();
router.post('/story/create-new-story', [verify_token_1.verifyToken, multer_1.uploadsStory.single('imageStory')], story.addNewStory);
router.get('/story/get-all-stories-home', [verify_token_1.verifyToken], story.getAllStoryHome);
router.get('/story/get-story-by-user/:idStory', [verify_token_1.verifyToken], story.getStoryByUser);
exports.default = router;
