import { Router } from 'express';
import {
  addCustomExtension,
  listCustomExtensions,
  removeCustomExtension,
} from '../services/customService';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const items = await listCustomExtensions();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { ext } = req.body;
    if (typeof ext !== 'string') {
      return res.status(400).json({ error: 'ext 문자열이 필요합니다.' });
    }
    const created = await addCustomExtension(ext);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

router.delete('/:ext', async (req, res, next) => {
  try {
    const { ext } = req.params;
    await removeCustomExtension(ext);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
