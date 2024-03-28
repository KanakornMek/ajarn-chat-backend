import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: jwt.VerifyErrors | null, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = { id: decoded.userId };
    next();
  });
};


export const authenticateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: jwt.VerifyErrors | null, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = decoded as User;
    next();
  });
};



export default authenticateToken;