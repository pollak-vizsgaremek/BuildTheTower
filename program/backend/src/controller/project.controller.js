import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { listProjects, saveProject, saveMilestone, importSamples } from '../service/project.service.js';

export const projectRouter = Router();
projectRouter.use(requireAuth);
projectRouter.get('/', async (req, res) => res.json({ projects: await listProjects(req.user.id) }));
projectRouter.post('/', async (req, res) => res.status(201).json({ project: await saveProject(req.user.id, null, req.body) }));
projectRouter.post('/samples', async (req, res) => res.status(201).json({ projects: await importSamples(req.user.id) }));
projectRouter.put('/:id', async (req, res) => res.json({ project: await saveProject(req.user.id, req.params.id, req.body) }));
projectRouter.post('/:id/milestones', async (req, res) => res.status(201).json({ milestone: await saveMilestone(req.user.id, req.params.id, null, req.body) }));
projectRouter.put('/:id/milestones/:milestoneId', async (req, res) => res.json({ milestone: await saveMilestone(req.user.id, req.params.id, req.params.milestoneId, req.body) }));
