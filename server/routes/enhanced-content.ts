import { Router } from 'express';
import { storage } from '../storage.js';
import { 
  insertCastMemberSchema, 
  insertContentCastSchema, 
  insertContentImageSchema, 
  insertExternalRatingSchema 
} from '../../shared/schema.js';
import { z } from 'zod';

const router = Router();

// ================= Cast Members Routes =================

// Get all cast members
router.get('/cast-members', async (req, res) => {
  try {
    const castMembers = await storage.getAllCastMembers();
    res.json(castMembers);
  } catch (error) {
    console.error('Error fetching cast members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get cast member by ID
router.get('/cast-members/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const castMember = await storage.getCastMemberById(id);
    
    if (!castMember) {
      return res.status(404).json({ error: 'Cast member not found' });
    }
    
    res.json(castMember);
  } catch (error) {
    console.error('Error fetching cast member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new cast member
router.post('/cast-members', async (req, res) => {
  try {
    const validatedData = insertCastMemberSchema.parse(req.body);
    const castMember = await storage.createCastMember(validatedData);
    res.status(201).json(castMember);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error creating cast member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update cast member
router.put('/cast-members/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = insertCastMemberSchema.partial().parse(req.body);
    const castMember = await storage.updateCastMember(id, validatedData);
    res.json(castMember);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error updating cast member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete cast member
router.delete('/cast-members/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteCastMember(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Cast member not found' });
    }
    
    res.json({ message: 'Cast member deleted successfully' });
  } catch (error) {
    console.error('Error deleting cast member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ================= Content Cast Routes =================

// Get cast for specific content
router.get('/content/:contentId/cast', async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId);
    const contentCast = await storage.getContentCast(contentId);
    res.json(contentCast);
  } catch (error) {
    console.error('Error fetching content cast:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add cast member to content
router.post('/content/:contentId/cast', async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId);
    const validatedData = insertContentCastSchema.parse({
      ...req.body,
      contentId
    });
    
    const contentCast = await storage.addContentCast(validatedData);
    res.status(201).json(contentCast);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error adding content cast:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove cast member from content
router.delete('/content/:contentId/cast/:castMemberId', async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId);
    const castMemberId = parseInt(req.params.castMemberId);
    
    const success = await storage.removeContentCast(contentId, castMemberId);
    
    if (!success) {
      return res.status(404).json({ error: 'Content cast relation not found' });
    }
    
    res.json({ message: 'Cast member removed from content successfully' });
  } catch (error) {
    console.error('Error removing content cast:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ================= Content Images Routes =================

// Get images for specific content
router.get('/content/:contentId/images', async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId);
    const type = req.query.type as string;
    
    const images = await storage.getContentImages(contentId, type);
    res.json(images);
  } catch (error) {
    console.error('Error fetching content images:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add image to content
router.post('/content/:contentId/images', async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId);
    const validatedData = insertContentImageSchema.parse({
      ...req.body,
      contentId
    });
    
    const image = await storage.addContentImage(validatedData);
    res.status(201).json(image);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error adding content image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update content image
router.put('/content/images/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = insertContentImageSchema.partial().parse(req.body);
    
    const image = await storage.updateContentImage(id, validatedData);
    res.json(image);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error updating content image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete content image
router.delete('/content/images/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteContentImage(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Content image not found' });
    }
    
    res.json({ message: 'Content image deleted successfully' });
  } catch (error) {
    console.error('Error deleting content image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ================= External Ratings Routes =================

// Get external ratings for specific content
router.get('/content/:contentId/external-ratings', async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId);
    const ratings = await storage.getContentExternalRatings(contentId);
    res.json(ratings);
  } catch (error) {
    console.error('Error fetching external ratings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add external rating to content
router.post('/content/:contentId/external-ratings', async (req, res) => {
  try {
    const contentId = parseInt(req.params.contentId);
    const validatedData = insertExternalRatingSchema.parse({
      ...req.body,
      contentId
    });
    
    const rating = await storage.addExternalRating(validatedData);
    res.status(201).json(rating);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error adding external rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update external rating
router.put('/external-ratings/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = insertExternalRatingSchema.partial().parse(req.body);
    
    const rating = await storage.updateExternalRating(id, validatedData);
    res.json(rating);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error updating external rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete external rating
router.delete('/external-ratings/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteExternalRating(id);
    
    if (!success) {
      return res.status(404).json({ error: 'External rating not found' });
    }
    
    res.json({ message: 'External rating deleted successfully' });
  } catch (error) {
    console.error('Error deleting external rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;