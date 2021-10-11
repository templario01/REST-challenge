import passport from 'passport';
import passportLocal from 'passport-local';

import createError from 'http-errors';
import bcrypt from 'bcrypt';

import { PrismaClient } from '@prisma/client';

import { UserId } from '../../models/models';
import { config } from '../../config/config';
import { NextFunction, Request, Response } from 'express';
import { GetExpressUserId, GetUserRoleRequest, GetUserSession } from '../utils/definitions';

const prisma = new PrismaClient();

const LocalStrategy = passportLocal.Strategy;

const jwt = require('jsonwebtoken');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;

passport.serializeUser<any, any>((req, user, done) => {
  return done(undefined, user)
})

passport.deserializeUser(async (id : number, done) => {
  console.log('desear: ', id)
  try {
    const user = await prisma.users.findUnique({
      where : {
        id: id
      }
    })
    console.log('user: ', user)
    const err = new createError.NotFound('User not registered');
    if (!user) {
      return done(err);
    } else{
      return done(user);
    }
  } catch (e) {
    console.log('here', e)
    return done(e);
  }
})

// JWT config

export const getToken = function (user: any) {
  console.log('getToken: ', user)
  return jwt.sign(user, config.secretKey, {
    expiresIn: '1h',
  });
};

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secretKey
};

export const jwtPassport = passport.use(
  new JwtStrategy(opts, async (jwt_payload: any, done: any) => {
    console.log('JWT payload: ', jwt_payload);
    try {
      // console.log(username);
      const user = await prisma.users.findUnique({
        where: {
          id: jwt_payload._id,
        },
      });
      // console.log(user);
      if (user) {
        // console.log('OK USER')
        return done(undefined, user);
      } else {
        return done(undefined, false)
      }
    } catch (e) {
      return done(e, false);
    }
  }),
);

export const verifyAdmin = (req: GetUserRoleRequest, res: Response, next: NextFunction) => {
  if (req.user ?.role === 'MODERATOR') {
    return next();
  } else {
    const err = new Error('You are not authorized');
    res.statusCode = 403;
    return next(err);
  }
}

/**
 * Sign in using Email and Password.
 */
export const local = passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // console.log(username);
      const user = await prisma.users.findUnique({
        where: {
          username: username,
        },
      });
      // console.log(user);
      if (!user) {
        const err = new createError.NotFound('User not registered');
        // console.log('not USER')
        return done(undefined, false, {
          message: `Username ${username} not found.`,
        });
      }
      // Compare password
      if (!bcrypt.compareSync(password, user.password)) {
        console.log('INVALID PASSWORD');
        return done(undefined, false, {
          message: 'Invalid username or password.',
        });
      }
      console.log('VALID PASS')
      return done(undefined, user);
    } catch (e) {
      return done(e);
    }
  }),
);