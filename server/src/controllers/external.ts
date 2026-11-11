import { Request, Response, NextFunction } from 'express';

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${req.params.id}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
};
