require('dotenv').config();
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');

const defaultFrom = `Benue BlockchainAI Fest <${process.env.EMAIL_FROM || 'onboarding@resend.dev'}>`;



const logoUrl = process.env.LOGO_URL;
const logoHtml = logoUrl 
  ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${logoUrl}" alt="Logo" style="max-height: 80px;" /></div>` 
  : `<div style="font-family: 'Courier New', Courier, monospace; font-weight: 900; text-align: center; line-height: 1;">
        <div style="font-size: 26px; color: #ffffff; letter-spacing: -1.5px; margin-bottom: 4px; text-transform: uppercase;">
          Benue <span style="color: #00d2ff;">Blockchain</span>
        </div>
        <div style="font-size: 14px; color: rgba(0, 210, 255, 0.7); text-transform: uppercase; letter-spacing: 5px; margin-top: 8px;">
          & AI Fest
        </div>
      </div>`;

async function sendResendEmail({ to, subject, html, text }) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: defaultFrom,
        to: [to],
        subject,
        html,
        text,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email via Resend API');
    }
    return data;
  } catch (err) {
    throw err;
  }
}


/**
 * @param {Object} user 
 * @param {string} user.firstName 
 * @param {string} user.corporateEmail 
 * @param {number} [attempt=1] 
 */
async function sendConfirmationEmail(user, attempt = 1) {
  const maxAttempts = 3;
  const retryDelayMs = 2000;

  const subject = 'Welcome to Africa\'s Premier Blockchain & AI Festival! – Benue Fest';
  const text = `Hello ${user.firstName},

Thank you for registering for the Benue BlockchainAI Fest! We are spotlighting innovation to onboard the next billion.

Get ready for an inaugural 5-day celebration featuring 700+ talented developers and 20+ leading Web3 & AI companies. This is not just a conference, but a platform to bring your craziest ideas to life!

Event Details:

Date: ${process.env.EVENT_DATE}
Venue: ${process.env.EVENT_VENUE}

Follow us for updates:

Twitter: ${process.env.SOCIAL_TWITTER}
Facebook: ${process.env.SOCIAL_FACEBOOK}
YouTube: ${process.env.SOCIAL_YOUTUBE}

Join our WhatsApp Community for more updates and information:
https://chat.whatsapp.com/K0RNdkd6FPJEAEKaHTHUQ7

We look forward to seeing you there!

Warm regards,
The Benue BlockchainAI Fest Team`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 40px 30px; text-align: center; }
    .header img { max-width: 200px; margin-bottom: 20px; }
    .header h1 { color: #00d4ff; margin: 0; font-size: 24px; }
    .header p { color: #aad4f5; margin: 8px 0 0; font-size: 14px; }
    .body { padding: 30px; color: #333333; }
    .body h2 { color: #1a1a2e; }
    .highlight-text { font-size: 16px; line-height: 1.6; color: #444; }
    .event-box { background: #f0f8ff; border-left: 4px solid #00d4ff; padding: 16px 20px; border-radius: 4px; margin: 20px 0; }
    .event-box p { margin: 6px 0; font-size: 15px; }
    .social { margin-top: 24px; }
    .social a { display: inline-block; margin-right: 12px; color: #00d4ff; text-decoration: none; font-weight: bold; }
    .footer { background: #1a1a2e; color: #aaa; text-align: center; padding: 24px; font-size: 12px; }
    .footer img { max-width: 150px; margin-top: 10px; opacity: 0.8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${logoHtml}
      <h1 style="margin-top: 30px;">🎉 Registration Confirmed!</h1>
    </div>

    <div class="body">
      <h2>Hello ${user.firstName},</h2>
      <p class="highlight-text">Thank you for registering for the <strong>Benue BlockchainAI Fest</strong>! We are spotlighting innovation to onboard the next billion.</p>
      
      <p class="highlight-text">Get ready for an inaugural 5-day celebration featuring <strong>700+ talented developers</strong> and <strong>20+ leading Web3 & AI companies</strong>. This is not just a conference, but a platform to bring your craziest ideas to life!</p>

      <div class="event-box">
        <p> <strong>Date:</strong> ${process.env.EVENT_DATE}</p>
        <p> <strong>Venue:</strong> ${process.env.EVENT_VENUE}</p>
      </div>

      <p>Stay connected and follow us on social media for updates:</p>
      <div class="social">
        <a href="${process.env.SOCIAL_TWITTER}" target="_blank">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/x.svg" alt="X (Twitter)" width="20" height="20" />
        </a>
        <a href="${process.env.SOCIAL_FACEBOOK}" target="_blank">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg" alt="Facebook" width="20" height="20" />
        </a>
        <a href="${process.env.SOCIAL_YOUTUBE}" target="_blank">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg" alt="YouTube" width="20" height="20" />
        </a>
      </div>

      <div style="margin-top: 24px; padding: 16px; background: #e8f5e9; border-left: 4px solid #25d366; border-radius: 4px;">
        <p style="margin: 0; font-size: 15px; color: #1a1a2e;">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg" alt="WhatsApp" width="20" height="20" style="vertical-align: middle; margin-right: 8px;" />
          <strong style="vertical-align: middle;">Join our WhatsApp Community for more updates and information:</strong>
        </p>
        <p style="margin: 8px 0 0 0; font-size: 14px; padding-left: 28px;">
          <a href="https://chat.whatsapp.com/K0RNdkd6FPJEAEKaHTHUQ7" target="_blank" style="color: #25d366; text-decoration: none; font-weight: bold;">Click here to join the group &rarr;</a>
        </p>
      </div>

      <p style="margin-top: 30px; font-weight: bold;">We look forward to seeing you there! 🚀</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Benue BlockchainAI Fest. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

  try {
    await sendResendEmail({ to: user.corporateEmail, subject, html, text });


    console.log(`[Mailer] Confirmation email sent to ${user.corporateEmail} (attempt ${attempt})`);
  } catch (error) {
    console.error(
      `[Mailer] Failed to send email to ${user.corporateEmail} (attempt ${attempt}):`,
      error.message
    );
    if (attempt < maxAttempts) {
      console.log(`[Mailer] Retrying in ${retryDelayMs / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, retryDelayMs));
      return sendConfirmationEmail(user, attempt + 1);
    } else {
      console.error(`[Mailer] All ${maxAttempts} attempts failed for ${user.corporateEmail}.`);
    }
  }
}

/**
 * @param {Object} registration
 */
async function sendHackathonConfirmationEmail(registration, attempt = 1) {
  const maxAttempts = 3;
  const retryDelayMs = 2000;

  const subject = 'Dare to Build: Hackathon Registration Confirmed – Benue Fest';
  const text = `Hello ${registration.firstName},

Your hackathon registration has been received! We're thrilled to have you join our flagship 'Dare to Build' 72-Hour non-stop innovation hackathon.

Prepare to tackle real-world challenges in DeFi, ReFi, DePINs, RWA tokenisation, NFTs, DAOs, and decentralised AI alongside 700+ developers. 

With live mentorship, robust support, and massive prize pools, this is your chance to build the future of Web3 and AI.

Event Details:

Date: ${process.env.EVENT_DATE}
Venue: ${process.env.EVENT_VENUE}

Follow us for hackathon updates:

Twitter: ${process.env.SOCIAL_TWITTER}
Facebook: ${process.env.SOCIAL_FACEBOOK}
YouTube: ${process.env.SOCIAL_YOUTUBE}

Join our WhatsApp Community for more updates and information:
https://chat.whatsapp.com/K0RNdkd6FPJEAEKaHTHUQ7

Get ready to build, innovate, and win!

Warm regards,
The Benue BlockchainAI Fest Team`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 40px 30px; text-align: center; }
    .header img { max-width: 200px; margin-bottom: 20px; }
    .header h1 { color: #00d4ff; margin: 0; font-size: 24px; }
    .header p { color: #aad4f5; margin: 8px 0 0; font-size: 14px; }
    .body { padding: 30px; color: #333333; }
    .body h2 { color: #1a1a2e; }
    .highlight-text { font-size: 16px; line-height: 1.6; color: #444; }
    .event-box { background: #f0f8ff; border-left: 4px solid #00d4ff; padding: 16px 20px; border-radius: 4px; margin: 20px 0; }
    .event-box p { margin: 6px 0; font-size: 15px; }
    .social { margin-top: 24px; }
    .social a { display: inline-block; margin-right: 12px; color: #00d4ff; text-decoration: none; font-weight: bold; }
    .footer { background: #1a1a2e; color: #aaa; text-align: center; padding: 24px; font-size: 12px; }
    .footer img { max-width: 150px; margin-top: 10px; opacity: 0.8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${logoHtml}
      <h1 style="margin-top: 30px;">🚀 Dare to Build: Hackathon Confirmed!</h1>
    </div>

    <div class="body">
      <h2>Hello ${registration.firstName},</h2>
      <p class="highlight-text">Your hackathon registration has been received! We're thrilled to have you join our flagship <strong>'Dare to Build' 72-Hour Hackathon</strong>.</p>

      <p class="highlight-text">Prepare to tackle real-world challenges in DeFi, ReFi, DePINs, RWA tokenisation, NFTs, DAOs, and decentralised AI alongside 700+ developers. With live mentorship and massive prize pools, this is your chance to shine!</p>

      <div class="event-box">
        <p> <strong>Date:</strong> ${process.env.EVENT_DATE}</p>
        <p> <strong>Venue:</strong> ${process.env.EVENT_VENUE}</p>
      </div>

      <p>Stay connected and follow us on social media for updates:</p>
      <div class="social">
        <a href="${process.env.SOCIAL_TWITTER}" target="_blank">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/x.svg" alt="X (Twitter)" width="20" height="20" />
        </a>
        <a href="${process.env.SOCIAL_FACEBOOK}" target="_blank">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg" alt="Facebook" width="20" height="20" />
        </a>
        <a href="${process.env.SOCIAL_YOUTUBE}" target="_blank">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg" alt="YouTube" width="20" height="20" />
        </a>
      </div>

      <div style="margin-top: 24px; padding: 16px; background: #e8f5e9; border-left: 4px solid #25d366; border-radius: 4px;">
        <p style="margin: 0; font-size: 15px; color: #1a1a2e;">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg" alt="WhatsApp" width="20" height="20" style="vertical-align: middle; margin-right: 8px;" />
          <strong style="vertical-align: middle;">Join our WhatsApp Community for more updates and information:</strong>
        </p>
        <p style="margin: 8px 0 0 0; font-size: 14px; padding-left: 28px;">
          <a href="https://chat.whatsapp.com/K0RNdkd6FPJEAEKaHTHUQ7" target="_blank" style="color: #25d366; text-decoration: none; font-weight: bold;">Click here to join the group &rarr;</a>
        </p>
      </div>

      <p style="margin-top: 30px; font-weight: bold;">Get ready to build, innovate, and win! 🏆</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Benue BlockchainAI Fest. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

  try {
    await sendResendEmail({ to: registration.email, subject, html, text });

    console.log(`[Mailer] Hackathon confirmation email sent to ${registration.email} (attempt ${attempt})`);
  } catch (error) {
    console.error(
      `[Mailer] Failed to send hackathon email to ${registration.email} (attempt ${attempt}):`,
      error.message
    );
    if (attempt < maxAttempts) {
      console.log(`[Mailer] Retrying in ${retryDelayMs / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, retryDelayMs));
      return sendHackathonConfirmationEmail(registration, attempt + 1);
    } else {
      console.error(`[Mailer] All ${maxAttempts} attempts failed for ${registration.email}.`);
    }
  }
}

/**
 * @param {Object} registration
 */
async function sendProductShowcaseConfirmationEmail(registration, attempt = 1) {
  const maxAttempts = 3;
  const retryDelayMs = 2000;

  const subject = 'Showcase Your Innovation – Benue BlockchainAI Fest';
  const text = `Hello ${registration.firstName},

Spotlighting innovation to onboard the next billion! Your product showcase registration has been received. 

We're excited to have you present your product at the Benue BlockchainAI Fest. Prepare to discover cutting-edge partnerships, connect with 20+ leading Web3 companies, and explore Africa's most innovative ecosystem with 700+ attendees.

Event Details:

Date: ${process.env.EVENT_DATE}
Venue: ${process.env.EVENT_VENUE}

Follow us for ecosystem updates:

Twitter: ${process.env.SOCIAL_TWITTER}
Facebook: ${process.env.SOCIAL_FACEBOOK}
YouTube: ${process.env.SOCIAL_YOUTUBE}

Join our WhatsApp Community for more updates and information:
https://chat.whatsapp.com/K0RNdkd6FPJEAEKaHTHUQ7

Get ready to showcase your innovation to the world!

Warm regards,
The Benue BlockchainAI Fest Team`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 40px 30px; text-align: center; }
    .header img { max-width: 200px; margin-bottom: 20px; }
    .header h1 { color: #00d4ff; margin: 0; font-size: 24px; }
    .header p { color: #aad4f5; margin: 8px 0 0; font-size: 14px; }
    .body { padding: 30px; color: #333333; }
    .body h2 { color: #1a1a2e; }
    .highlight-text { font-size: 16px; line-height: 1.6; color: #444; }
    .event-box { background: #f0f8ff; border-left: 4px solid #00d4ff; padding: 16px 20px; border-radius: 4px; margin: 20px 0; }
    .event-box p { margin: 6px 0; font-size: 15px; }
    .social { margin-top: 24px; }
    .social a { display: inline-block; margin-right: 12px; color: #00d4ff; text-decoration: none; font-weight: bold; }
    .footer { background: #1a1a2e; color: #aaa; text-align: center; padding: 24px; font-size: 12px; }
    .footer img { max-width: 150px; margin-top: 10px; opacity: 0.8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${logoHtml}
      <h1 style="margin-top: 30px;">🚀 Product Showcase Confirmed!</h1>
    </div>

    <div class="body">
      <h2>Hello ${registration.firstName},</h2>
      <p class="highlight-text"><strong>Spotlighting innovation to onboard the next billion!</strong> Your product showcase registration has been received.</p>

      <p class="highlight-text">We're excited to have you present your product at the <strong>Benue BlockchainAI Fest</strong>. Connect with 20+ leading Web3 companies, investors, and explore Africa's most innovative ecosystem with 700+ attendees.</p>

      <div class="event-box">
        <p> <strong>Date:</strong> ${process.env.EVENT_DATE}</p>
        <p> <strong>Venue:</strong> ${process.env.EVENT_VENUE}</p>
      </div>

      <p>Stay connected and follow us on social media for updates:</p>
      <div class="social">
        <a href="${process.env.SOCIAL_TWITTER}" target="_blank">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/x.svg" alt="X (Twitter)" width="20" height="20" />
        </a>
        <a href="${process.env.SOCIAL_FACEBOOK}" target="_blank">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg" alt="Facebook" width="20" height="20" />
        </a>
        <a href="${process.env.SOCIAL_YOUTUBE}" target="_blank">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg" alt="YouTube" width="20" height="20" />
        </a>
      </div>

      <div style="margin-top: 24px; padding: 16px; background: #e8f5e9; border-left: 4px solid #25d366; border-radius: 4px;">
        <p style="margin: 0; font-size: 15px; color: #1a1a2e;">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg" alt="WhatsApp" width="20" height="20" style="vertical-align: middle; margin-right: 8px;" />
          <strong style="vertical-align: middle;">Join our WhatsApp Community for more updates and information:</strong>
        </p>
        <p style="margin: 8px 0 0 0; font-size: 14px; padding-left: 28px;">
          <a href="https://chat.whatsapp.com/K0RNdkd6FPJEAEKaHTHUQ7" target="_blank" style="color: #25d366; text-decoration: none; font-weight: bold;">Click here to join the group &rarr;</a>
        </p>
      </div>

      <p style="margin-top: 30px; font-weight: bold;">Get ready to showcase your innovation to the world! 🌍</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Benue BlockchainAI Fest. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

  try {
    await sendResendEmail({ to: registration.email, subject, html, text });

    console.log(`[Mailer] Product showcase confirmation email sent to ${registration.email} (attempt ${attempt})`);
  } catch (error) {
    console.error(
      `[Mailer] Failed to send product showcase email to ${registration.email} (attempt ${attempt}):`,
      error.message
    );
    if (attempt < maxAttempts) {
      console.log(`[Mailer] Retrying in ${retryDelayMs / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, retryDelayMs));
      return sendProductShowcaseConfirmationEmail(registration, attempt + 1);
    } else {
      console.error(`[Mailer] All ${maxAttempts} attempts failed for ${registration.email}.`);
    }
  }
}

/**
 * @param {Object} application
 */
async function sendSpeakerApplicationConfirmationEmail(application, attempt = 1) {
  const maxAttempts = 3;
  const retryDelayMs = 2000;

  const subject = 'Lead the Conversation: Speaker Application Received – Benue Fest';
  const text = `Hello ${application.firstName},

Thank you for your interest in speaking at the Benue BlockchainAI Fest! We have received your application and our team will be reviewing it shortly.

As a speaker, you will have the unique platform to share your insights with 700+ developers, tech enthusiasts, and 20+ leading Web3 companies at our world-class 2-day summit.

Event Details:

Date: ${process.env.EVENT_DATE}
Venue: ${process.env.EVENT_VENUE}

Follow us for the latest announcements:

Twitter: ${process.env.SOCIAL_TWITTER}
Facebook: ${process.env.SOCIAL_FACEBOOK}
YouTube: ${process.env.SOCIAL_YOUTUBE}

Join our WhatsApp Community for more updates and information:
https://chat.whatsapp.com/K0RNdkd6FPJEAEKaHTHUQ7

We appreciate your willingness to share your expertise with our community.

Warm regards,
The Benue BlockchainAI Fest Team`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 40px 30px; text-align: center; }
    .header img { max-width: 200px; margin-bottom: 20px; }
    .header h1 { color: #00d4ff; margin: 0; font-size: 24px; }
    .header p { color: #aad4f5; margin: 8px 0 0; font-size: 14px; }
    .body { padding: 30px; color: #333333; }
    .body h2 { color: #1a1a2e; }
    .highlight-text { font-size: 16px; line-height: 1.6; color: #444; }
    .event-box { background: #f0f8ff; border-left: 4px solid #00d4ff; padding: 16px 20px; border-radius: 4px; margin: 20px 0; }
    .event-box p { margin: 6px 0; font-size: 15px; }
    .social { margin-top: 24px; }
    .social a { display: inline-block; margin-right: 12px; color: #00d4ff; text-decoration: none; font-weight: bold; }
    .footer { background: #1a1a2e; color: #aaa; text-align: center; padding: 24px; font-size: 12px; }
    .footer img { max-width: 150px; margin-top: 10px; opacity: 0.8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${logoHtml}
      <h1 style="margin-top: 30px;">🎙️ Speaker Application Received!</h1>
    </div>

    <div class="body">
      <h2>Hello ${application.firstName},</h2>
      <p class="highlight-text">Thank you for expressing interest in speaking at the <strong>Benue BlockchainAI Fest</strong>! Our team has received your application and will review it soon.</p>

      <p class="highlight-text">As a speaker, you will have the unique platform to share your insights with <strong>700+ developers</strong>, tech enthusiasts, and <strong>20+ leading Web3 companies</strong> at our world-class 2-day summit.</p>

      <div class="event-box">
        <p> <strong>Date:</strong> ${process.env.EVENT_DATE}</p>
        <p> <strong>Venue:</strong> ${process.env.EVENT_VENUE}</p>
      </div>

      <p>Stay connected and follow us on social media for updates:</p>
      <div class="social">
        <a href="${process.env.SOCIAL_TWITTER}" target="_blank">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/x.svg" alt="X (Twitter)" width="20" height="20" />
        </a>
        <a href="${process.env.SOCIAL_FACEBOOK}" target="_blank">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg" alt="Facebook" width="20" height="20" />
        </a>
        <a href="${process.env.SOCIAL_YOUTUBE}" target="_blank">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg" alt="YouTube" width="20" height="20" />
        </a>
      </div>

      <div style="margin-top: 24px; padding: 16px; background: #e8f5e9; border-left: 4px solid #25d366; border-radius: 4px;">
        <p style="margin: 0; font-size: 15px; color: #1a1a2e;">
          <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg" alt="WhatsApp" width="20" height="20" style="vertical-align: middle; margin-right: 8px;" />
          <strong style="vertical-align: middle;">Join our WhatsApp Community for more update information:</strong>
        </p>
        <p style="margin: 8px 0 0 0; font-size: 14px; padding-left: 28px;">
          <a href="https://chat.whatsapp.com/K0RNdkd6FPJEAEKaHTHUQ7" target="_blank" style="color: #25d366; text-decoration: none; font-weight: bold;">Click here to join the group &rarr;</a>
        </p>
      </div>

      <p style="margin-top: 30px; font-weight: bold;">We appreciate your willingness to share your knowledge with our community! ✨</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Benue BlockchainAI Fest. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

  try {
    await sendResendEmail({ to: application.email, subject, html, text });

    console.log(`[Mailer] Speaker application confirmation email sent to ${application.email} (attempt ${attempt})`);
  } catch (error) {
    console.error(
      `[Mailer] Failed to send speaker application email to ${application.email} (attempt ${attempt}):`,
      error.message
    );
    if (attempt < maxAttempts) {
      console.log(`[Mailer] Retrying in ${retryDelayMs / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, retryDelayMs));
      return sendSpeakerApplicationConfirmationEmail(application, attempt + 1);
    } else {
      console.error(`[Mailer] All ${maxAttempts} attempts failed for ${application.email}.`);
    }
  }
}

module.exports = {
  sendConfirmationEmail,
  sendHackathonConfirmationEmail,
  sendProductShowcaseConfirmationEmail,
  sendSpeakerApplicationConfirmationEmail
};
