const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, message: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('Variables SMTP manquantes dans Netlify');
    }

    const transporter = nodemailer.createTransport({
      host: 'mail.webador.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const adminEmail = 'info@urbanrace-taxi-moto.fr';
    const clientEmail = data.email || '';
    const fromEmail = '"Urbanrace Taxi Moto" <info@urbanrace-taxi-moto.fr>';

    const adminText = [
      'Nouvelle demande de réservation Taxi Moto Premium',
      '',
      'Nom : ' + (data.Nom || ''),
      
