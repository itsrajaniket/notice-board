import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { Priority, Category } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  if (req.method === 'GET') {
    try {
      const notice = await prisma.notice.findUnique({
        where: { id },
      });

      if (!notice) {
        return res.status(404).json({ message: 'Notice not found' });
      }

      return res.status(200).json(notice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
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

      const existingNotice = await prisma.notice.findUnique({ where: { id } });
      if (!existingNotice) {
        return res.status(404).json({ message: 'Notice not found' });
      }

      const notice = await prisma.notice.update({
        where: { id },
        data: {
          title: title.trim(),
          body: body.trim(),
          category: category as Category,
          priority: priority as Priority,
          publishDate: new Date(publishDate),
          image: image || null,
        },
      });

      return res.status(200).json(notice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const existingNotice = await prisma.notice.findUnique({ where: { id } });
      if (!existingNotice) {
        return res.status(404).json({ message: 'Notice not found' });
      }

      await prisma.notice.delete({
        where: { id },
      });

      return res.status(200).json({ message: 'Notice deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
