import { Request, Response, NextFunction } from 'express';

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  
  next();
}


export default authenticateToken;