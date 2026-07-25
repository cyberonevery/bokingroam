import { Response } from 'express';
import { db } from '../db';
import { notifications, users, broadcasts } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { AuthRequest } from '../middlewares/verifyToken';

export const getMyNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const myNotifs = await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
    res.status(200).json({ success: true, data: myNotifs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, Number(id)));
    res.status(200).json({ success: true, message: 'Notifikasi ditandai sudah dibaca' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

export const broadcastNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Pesan wajib diisi' });
    
    const [result] = await db.insert(broadcasts).values({ message });
    const broadcastId = result.insertId;
    
    const allUsers = await db.select().from(users).where(eq(users.role, 'user'));
    if (allUsers.length > 0) {
      const insertData = allUsers.map(u => ({
        userId: u.id,
        broadcastId,
        message,
        isRead: false
      }));
      await db.insert(notifications).values(insertData);
    }
    
    res.status(200).json({ success: true, message: 'Pemberitahuan berhasil disiarkan', broadcastId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

export const getBroadcasts = async (req: AuthRequest, res: Response) => {
  try {
    const allBroadcasts = await db.select().from(broadcasts).orderBy(desc(broadcasts.createdAt));
    res.status(200).json({ success: true, data: allBroadcasts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

export const updateBroadcast = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Pesan wajib diisi' });
    
    await db.update(broadcasts).set({ message }).where(eq(broadcasts.id, Number(id)));
    await db.update(notifications).set({ message }).where(eq(notifications.broadcastId, Number(id)));
    
    res.status(200).json({ success: true, message: 'Pesan siaran berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

export const deleteBroadcast = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(notifications).where(eq(notifications.broadcastId, Number(id)));
    await db.delete(broadcasts).where(eq(broadcasts.id, Number(id)));
    
    res.status(200).json({ success: true, message: 'Pesan siaran berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};
