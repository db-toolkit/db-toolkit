import { Resend } from 'resend';
import { EMAIL_CONFIG } from '../../utils/constants.js';
import { generateIssueReportHTML } from '../../utils/email-template.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, description, issue_type, environment, issue_id, created_at } = req.body;

  if (!title || !description || !issue_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const html = generateIssueReportHTML({
    title,
    description,
    issue_type,
    environment,
    issue_id,
    created_at
  });

  try {
    await resend.emails.send({
      from: EMAIL_CONFIG.FROM,
      to: EMAIL_CONFIG.TO,
      subject: `${EMAIL_CONFIG.ISSUE_SUBJECT_PREFIX}: ${title}`,
      html
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email send failed:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
