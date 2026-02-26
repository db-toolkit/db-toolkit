import { Resend } from 'resend';
import { getDownloadStats } from '../../utils/download-db.js';
import { generateStatsEmailHTML } from '../../utils/email-template.js';
import { EMAIL_CONFIG } from '../../utils/constants.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    // Fetch stats from database
    const downloadStats = await getDownloadStats();

    // Generate HTML email
    const html = generateStatsEmailHTML(downloadStats.data);

    // Send email
    await resend.emails.send({
      from: EMAIL_CONFIG.FROM,
      to: EMAIL_CONFIG.TO,
      subject: EMAIL_CONFIG.SUBJECT,
      html
    });

    return res.status(200).json({ 
      success: true,
      message: 'Daily stats report sent successfully'
    });

  } catch (error) {
    console.error('Error sending daily report:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
