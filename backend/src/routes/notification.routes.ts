import { Router } from 'express';
import { getMyNotifications, markAsRead, broadcastNotification, getBroadcasts, updateBroadcast, deleteBroadcast } from '../controllers/notification.controller';
import { verifyToken } from '../middlewares/verifyToken';
import { verifyAdmin } from '../middlewares/verifyAdmin';

const router = Router();

router.get('/', verifyToken, getMyNotifications);
router.patch('/:id/read', verifyToken, markAsRead);

router.get('/broadcast', verifyToken, verifyAdmin, getBroadcasts);
router.post('/broadcast', verifyToken, verifyAdmin, broadcastNotification);
router.put('/broadcast/:id', verifyToken, verifyAdmin, updateBroadcast);
router.delete('/broadcast/:id', verifyToken, verifyAdmin, deleteBroadcast);

export default router;
