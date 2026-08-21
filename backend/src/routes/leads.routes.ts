import { Router } from 'express';
import { LeadController } from '../controllers/leads/LeadController';

const router = Router();
const leadController = new LeadController();

router.post('/', leadController.createLead.bind(leadController));
router.get('/', leadController.getAllLeads.bind(leadController));
router.get('/:id', leadController.getLead.bind(leadController));

export default router;
