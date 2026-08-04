import { Router } from 'express';
import { db } from '../../lib/firebase-admin.ts';

const router = Router();

// Get all agents for a user
router.get('/', async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const agentsSnapshot = await db.collection('agents')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const agents = agentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Create a new agent
router.post('/', async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const { name, role, behavior } = req.body;
    
    const newAgent = {
      userId,
      name,
      role,
      behavior,
      status: 'active',
      createdAt: Date.now()
    };
    
    const docRef = await db.collection('agents').add(newAgent);
    res.json({ id: docRef.id, ...newAgent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

export default router;
