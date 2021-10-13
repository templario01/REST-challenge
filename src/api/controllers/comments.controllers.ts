import express from 'express';
import { Router } from 'express';
import {
  showComment,
  createComment,
  updateComment,
  deleteComment,
  getCommentsOfPost,
} from '../../services/comments.services';
import { createReportComment } from '../../services/reports.services';
import { Request, Response } from 'express';
import { setDislike, setLike } from '../../services/like.services';

import * as auth from '../middlewares/auth.middle';
import { GetUserSession } from '../utils/definitions';
import { dataWrap } from '../utils/wrappers';

export const commentPosts = Router();

// accoounts/:accountid/posts/:postid/comments

commentPosts
  .route('/:accountid/posts/:postid/comments')

  // Return all published comments of a specific post - OK
  .get(async (req: Request, res: Response) => {
    try {
      const query = await getCommentsOfPost(Number(req.params.postid));
      res.status(200).json(dataWrap(query));
    } catch (e) {
      return res.status(400).json(JSON.stringify(e));
    }
  })

