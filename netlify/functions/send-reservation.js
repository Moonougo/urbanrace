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

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Variables GMAIL_USER ou GMAIL_APP_PASSWORD manquantes');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const adminEmail = 'fadpsg@gmail.com';
    const clientEmail = data.email || '';

    const adminText = [
      'Nouvelle demande de réservation Taxi Moto Premium',
      '',
      'Nom : ' + (data.Nom || ''),
      'Email : ' + clientEmail,
      'Téléphone : ' + (data['Téléphone'] || ''),
      'Date de la course : ' + (data.Date_de_la_course || ''),
      'Heure de la course : ' + (data.Heure_de_la_course || ''),
      'Adresse de départ : ' + (data['Adresse_de_départ'] || ''),
      "Adresse d'arrivée : " + (data["Adresse_d'arrivée"] || ''),
      'Type de tarif : ' + (data.Type_de_tarif || ''),
      'Distance estimative : ' + (data.Distance_estimative_km || ''),
      'Tarif estimatif : ' + (data.Tarif_estimatif || ''),
      'Informations complémentaires : ' + (data['Informations_complémentaires'] || '')
    ].join('\n');

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: adminEmail,
      subject: 'Nouvelle réservation - ' + (data.Nom || 'Client') + ' - ' + (data.Tarif_estimatif || ''),
      text: adminText,
      replyTo: clientEmail || process.env.GMAIL_USER
    });

    if (clientEmail) {
      const clientText = [
        'Bonjour ' + (data.Nom || ''),
        '',
        'Nous avons bien reçu votre demande de réservation Taxi Moto Premium.',
        'Tarif estimatif retenu : ' + (data.Tarif_estimatif || ''),
        'Votre demande va être traitée dans les 5 minutes.',
        '',
        'Récapitulatif :',
        '- Départ : ' + (data['Adresse_de_départ'] || ''),
        "- Arrivée : " + (data["Adresse_d'arrivée"] || ''),
        '- Date : ' + (data.Date_de_la_course || ''),
        '- Heure : ' + (data.Heure_de_la_course || ''),
        '',
        'Merci pour votre confiance.'
      ].join('\n');

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: clientEmail,
        subject: 'Confirmation de votre demande Taxi Moto Premium',
        text: clientText
      });
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, message: 'Email envoyé' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, message: error.message })
    };
  }
};
