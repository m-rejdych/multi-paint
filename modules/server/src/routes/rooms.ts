import { Router } from 'express';

import { create, list } from '../handlers/rooms';

const router = Router();

router.get('/', list);

router.post('/create', create);

export default router;
