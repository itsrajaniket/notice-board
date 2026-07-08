import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { Priority, Category } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: 'desc' }, // 'Urgent' > 'Normal'
          { publishDate: 'desc' }, // Newest first
        ],
      });
      return res.status(200).json(notices);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, body, category, priority, publishDate, image } = req.body;

      // Validation
      if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ message: 'Title is required' });
      }
      if (!body || typeof body !== 'string' || body.trim() === '') {
        return res.status(400).json({ message: 'Body is required' });
      }
      if (!publishDate || isNaN(Date.parse(publishDate))) {
        return res.status(400).json({ message: 'Valid publish date is required' });
      }
      if (!category || !Object.values(Category).includes(category)) {
        return res.status(400).json({ message: 'Valid category is required' });
      }
      if (!priority || !Object.values(Priority).includes(priority)) {
        return res.status(400).json({ message: 'Valid priority is required' });
      }

      const notice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category: category as Category,
          priority: priority as Priority,
          publishDate: new Date(publishDate),
          image: image || null,
        },
      });

      return res.status(201).json(notice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
