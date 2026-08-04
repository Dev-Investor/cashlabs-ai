import { Router } from 'express';
import { db } from '../../lib/firebase-admin.ts';

const router = Router();

// Get all prompts (public + user's private)
router.get('/', async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const promptsSnapshot = await db.collection('prompts')
      .where('isPublic', '==', true)
      .get();
    
    const userPromptsSnapshot = await db.collection('prompts')
      .where('userId', '==', userId)
      .get();
    
    const prompts = [
      ...promptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ...userPromptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    ];
    
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
});

export default router;
