import multer from 'multer';
import { createRouter } from 'next-connect';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = createRouter<NextApiRequest, NextApiResponse>();
