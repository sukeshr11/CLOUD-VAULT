import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

export const getProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const auth0Id = req.auth?.payload.sub;
    let user = await User.findOne({ auth0Id });
    if (!user) {
      user = await User.create({ auth0Id, email: `user-${Date.now()}@example.com`, name: 'New User' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const auth0Id = req.auth?.payload.sub;
    const user = await User.findOneAndUpdate({ auth0Id }, req.body, { new: true });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
