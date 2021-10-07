import express from 'express';
import { Router } from 'express';
import {
  showComment,
  createComment,
  updateComment,
  deleteComment,
} from '../../services/comments';
import { createReport } from '../../services/reports';
import { Request, Response } from 'express';
import { createLike, UpdateLike } from '../../services/likeComments';

export const comments = Router();

comments
  .route('/:postid')

  // create a comment or draft
  .post(async (req: Request, res: Response) => {
    try {
      const query = await createComment(req.body);
      res.status(201).json({ data: { query } });
    } catch (e) {
      res.status(400).end();
    }
  });

comments
  .route('/:commentid')

  // Update an existing comment
  .put(async (req: Request, res: Response) => {
    try {
      const query = await updateComment(Number(req.params.commentid), req.body);
      res.status(201).json({ data: { query } });
    } catch (e) {
      res.status(400).end();
    }
  })

  // Delete an existing comment
  .delete(async (req: Request, res: Response) => {
    try {
      const query = await deleteComment(req.body.id);
      res.status(201).json({ data: { query } });
    } catch (e) {
      res.status(400).end();
    }
  });

comments
  .route('/:commentid/report')

  // Report a comment
  .post(async (req: Request, res: Response) => {
    try {
      const query = await createReport(req.body);
      res.status(201).json({ data: { query } });
    } catch (error) {
      res.status(400).end();
    }
  });

comments
  .route('/:postid/like')

  // toggle between like or dislike to a comment
  .patch(async (req: Request, res: Response) => {
    try {
      const query = await UpdateLike(req.body)
    } catch (error) {
      res.status(400).end();
    }
  })

  // remove like to a comment
  .delete();
