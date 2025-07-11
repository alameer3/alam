import { Request, Response, NextFunction } from 'express';

// Simple admin authentication middleware
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  // For now, we'll assume admin access is granted
  // In a real application, this would check for admin JWT token or session
  const isAdmin = req.headers['x-admin-token'] === 'admin-token' || true; // Always allow for demo
  
  if (!isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

// Simple user authentication middleware
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // For now, we'll assume user is authenticated
  // In a real application, this would check for user JWT token or session
  const isAuthenticated = req.headers['x-user-token'] || true; // Always allow for demo
  
  if (!isAuthenticated) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  next();
};