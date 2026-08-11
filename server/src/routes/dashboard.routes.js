import { Router } from 'express';
import { requireDashboardAuth } from '../middleware/auth.js';
import {
  summary,
  trend,
  caseStatusBreakdown,
  caseFlow,
  priorityCases,
  riskMap,
  reminders,
  systemNotifications,
  nearbyServices,
  submittedReports,
} from '../data/store.js';
import { listAudit, verifyChain } from '../utils/audit.js';

const router = Router();

// Every route below requires a valid admin (dashboard) session - this is
// the internal, RBAC-protected investigator/case-worker surface.
router.use(requireDashboardAuth);

router.get('/overview', (req, res) => {
  res.json({
    summary,
    trend,
    caseStatusBreakdown,
    caseFlow,
    priorityCases,
    riskMap,
    reminders,
    systemNotifications,
    nearbyServices,
  });
});

router.get('/cases', (req, res) => {
  // Combine the seeded priority cases with anything submitted at runtime via
  // the portal/mobile reporting flow, newest first.
  const live = submittedReports.map((r) => ({
    id: r.id,
    severity: r.severity || 'MEDIUM',
    category: r.categoryLabel,
    victim: r.reporterRole,
    location: r.location || 'Tidak diketahui',
    ago: 'Baru masuk',
    status: r.status,
  }));
  res.json({ cases: [...live, ...priorityCases] });
});

router.get('/audit-log', (req, res) => {
  res.json({ entries: listAudit({ limit: 200 }), chain: verifyChain() });
});

export default router;
