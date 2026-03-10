const { SpeakerApplication } = require('../models');
const { speakerApplicationSchema } = require('../utils/validate');
const { sendSpeakerApplicationConfirmationEmail } = require('../utils/mailer');


async function speakerApplicationRegister(req, res) {

  const { error, value } = speakerApplicationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.map(d => d.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: details,
    });
  }

  const { firstName, lastName, email, linkedinLink, expertiseDescription } = value;

  try {

    const existing = await SpeakerApplication.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered for speaker application.',
      });
    }


    const application = await SpeakerApplication.create({
      firstName,
      lastName,
      email,
      linkedinLink: linkedinLink || null,
      expertiseDescription,
    });


    sendSpeakerApplicationConfirmationEmail(application).catch(err =>
      console.error('[SpeakerApplication] Email send error:', err.message)
    );


    return res.status(201).json({
      success: true,
      message: 'Speaker application successful. Details have been sent to your email.',
    });
  } catch (err) {
    console.error('[SpeakerApplication] Error:', err);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred. Please try again.',
    });
  }
}

module.exports = { speakerApplicationRegister };
