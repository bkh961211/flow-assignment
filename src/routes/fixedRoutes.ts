import { Router } from 'express';
import { getFixedExtensions, setFixedExtensionState } from '../services/fixedService';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const items = await getFixedExtensions();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.put('/:ext', async (req, res, next) => {
  try {
    const { ext } = req.params;
    const { blocked } = req.body;
    if (typeof blocked !== 'boolean') {
      return res.status(400).json({ error: 'blocked 값이 필요합니다.' });
    }
    const updated = await setFixedExtensionState(ext, blocked);
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

export default router;
