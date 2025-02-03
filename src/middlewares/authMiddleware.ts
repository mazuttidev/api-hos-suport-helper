import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.header('API_KEY');

  if (!apiKey) {
    res.status(401).json({ message: 'API_KEY é obrigatório.' });
    return;
  }

  try {
    const decoded = jwt.verify(apiKey, secretKey) as { id: number; username: string; name: string; email: string; role: string };
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

export default authMiddleware;
