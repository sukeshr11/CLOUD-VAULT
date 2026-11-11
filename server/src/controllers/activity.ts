import { Request, Response, NextFunction } from 'express';
import { Activity } from '../models/Activity';
import { User } from '../models/User';
import { logActivityToFirebase } from '../services/firebaseService';

export const getActivities = async (req: any, res: Response, next: NextFunction) => {
  try {
    const auth0Id = req.auth?.payload.sub;
    
    let user;
    try {
      user = await User.findOne({ auth0Id });
      if (!user) return res.status(404).json({ error: 'User not found' });
    } catch (dbErr) {
      return res.status(503).json({ error: 'Database is not connected.' });
    }
    
    const activities = await Activity.find({ userId: user._id }).sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    next(err);
  }
};

export const createActivity = async (req: any, res: Response, next: NextFunction) => {
  try {
    const auth0Id = req.auth?.payload.sub;
    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const activity = await Activity.create({ userId: user._id, ...req.body });
    await logActivityToFirebase(activity.toObject());
    
    res.status(201).json(activity);
  } catch (err) {
    next(err);
  }
};
