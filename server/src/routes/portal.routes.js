import { Router } from 'express';
import { requirePortalAuth } from '../middleware/auth.js';
import {
  reportCategories,
  reporterPersonas,
  partnerAgencies,
  submittedReports,
} from '../data/store.js';

const router = Router();

// Gated behind the demo "portal" login for this mockup phase (see README) -
// in the real product this content is public, but while this build is only
// meant for internal/stakeholder preview it sits behind requirePortalAuth
// like the dashboard does.
router.use(requirePortalAuth);

router.get('/content', (req, res) => {
  res.json({ reportCategories, reporterPersonas, partnerAgencies });
});

router.get('/reports', (req, res) => {
  res.json({ reports: submittedReports.slice().reverse() });
});

export default router;
