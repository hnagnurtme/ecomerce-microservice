import { Router } from 'express';

const healthRouter = Router();

healthRouter.get('', (req, res) => {
    res.send('Auth Service is healthy!');
});

export default healthRouter;
