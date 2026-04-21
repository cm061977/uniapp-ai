import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string;
      username: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
