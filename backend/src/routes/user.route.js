import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getUserProfile, updateUserProfile , syncUser, getCurrentUser , followUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile/:username', getUserProfile);

router.post('/sync', protectRoute, syncUser);

router.post('/me', protectRoute, getCurrentUser);

router.patch('/profile', protectRoute, updateUserProfile);

router.post('/follow/:targetUserId', protectRoute, followUser);


export default router;