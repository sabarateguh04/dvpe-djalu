import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.js';
import { reportLimiter, panicLimiter, statusLimiter } from '../middleware/rateLimiters.js';
import { reportCategories, submittedReports, genReportId } from '../data/store.js';
import { recordAudit } from '../utils/audit.js';

const router = Router();

// These endpoints are intentionally NOT behind requirePortalAuth /
// requireDashboardAuth: in the real product, victims and witnesses submit
// reports and check status without any login (often anonymously, per the
// "Laporan Anonim" persona in the mockup), and this is also exactly what
// the Flutter mobile app calls. Protection here comes from rate limiting +
// strict input validation + non-guessable report IDs instead of auth.
const chronologySchema = z.object({
  categoryId: z.string().min(1).max(60),
  reporterRole: z.string().min(1).max(60),
  chronology: z.string().min(10, 'Ceritakan kronologi minimal 10 karakter.').max(2000),
  incidentAt: z.string().max(60).optional().nullable(),
  location: z.string().max(120).optional().nullable(),
  contact: z.string().max(120).optional().nullable(),
  anonymous: z.boolean().optional().default(false),
});

router.post('/reports', reportLimiter, validateBody(chronologySchema), (req, res) => {
  const body = req.body;
  const category = reportCategories.find((c) => c.id === body.categoryId);
  if (!category) {
    return res.status(400).json({ error: 'Kategori laporan tidak dikenali.' });
  }

  const report = {
    id: genReportId(),
    categoryId: category.id,
    categoryLabel: category.label,
    reporterRole: body.reporterRole,
    // Chronology text is stored as-is (plain text); the React clients render
    // it as text content only (never dangerouslySetInnerHTML), so it can't
    // be used to inject markup/scripts into the dashboard UI.
    chronology: body.chronology,
    incidentAt: body.incidentAt || null,
    location: body.location || null,
    contact: body.anonymous ? null : body.contact || null,
    anonymous: !!body.anonymous,
    status: 'Laporan diterima',
    createdAt: new Date().toISOString(),
  };
  submittedReports.push(report);

  recordAudit({
    actor: report.anonymous ? 'anonymous' : body.contact || 'unknown',
    action: 'report_submitted',
    area: 'reports',
    ip: req.ip,
    meta: { id: report.id, category: category.id },
  });

  res.status(201).json({
    id: report.id,
    status: report.status,
    message: 'Laporan Anda telah diterima dan akan segera diverifikasi.',
  });
});

router.get('/reports/:id/status', statusLimiter, (req, res) => {
  const { id } = req.params;
  const report = submittedReports.find((r) => r.id === id);
  if (!report) {
    return res.status(404).json({ error: 'Laporan dengan ID tersebut tidak ditemukan.' });
  }
  res.json({
    id: report.id,
    status: report.status,
    category: report.categoryLabel,
    createdAt: report.createdAt,
  });
});

const panicSchema = z.object({
  location: z.string().max(200).optional().nullable(),
});

router.post('/panic', panicLimiter, validateBody(panicSchema), (req, res) => {
  recordAudit({
    actor: 'anonymous',
    action: 'panic_button_triggered',
    area: 'reports',
    ip: req.ip,
    meta: { location: req.body.location || null },
  });
  res.status(201).json({
    ok: true,
    message: 'Sinyal darurat diterima. Tim respons akan segera dihubungi.',
    hotline: '0811-1000-129',
  });
});

export default router;
