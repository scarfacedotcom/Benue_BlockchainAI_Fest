const { HackathonRegistration } = require('../models');
const { hackathonRegisterSchema } = require('../utils/validate');
const { sendHackathonConfirmationEmail } = require('../utils/mailer');


async function hackathonRegister(req, res) {

  const { error, value } = hackathonRegisterSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.map(d => d.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: details,
    });
  }

  const { firstName, lastName, email, githubPortfolio, projectDescription } = value;

  try {

    const existing = await HackathonRegistration.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered for the hackathon.',
      });
    }


    const registration = await HackathonRegistration.create({
      firstName,
      lastName,
      email,
      githubPortfolio: githubPortfolio || null,
      projectDescription,
    });


    sendHackathonConfirmationEmail(registration).catch(err =>
      console.error('[HackathonRegister] Email send error:', err.message)
    );


    return res.status(201).json({
      success: true,
      message: 'Hackathon registration successful. Event details have been sent to your email.',
    });
  } catch (err) {
    console.error('[HackathonRegister] Error:', err);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred. Please try again.',
    });
  }
}

module.exports = { 
  hackathonRegister

};
