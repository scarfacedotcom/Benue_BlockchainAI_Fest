const { ProductShowcase } = require('../models');
const { productShowcaseSchema } = require('../utils/validate');
const { sendProductShowcaseConfirmationEmail } = require('../utils/mailer');


async function productShowcaseRegister(req, res) {

  const { error, value } = productShowcaseSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.map(d => d.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: details,
    });
  }

  const { firstName, lastName, email, productLink, projectDescription } = value;

  try {

    const existing = await ProductShowcase.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered for the product showcase.',
      });
    }


    const registration = await ProductShowcase.create({
      firstName,
      lastName,
      email,
      productLink: productLink || null,
      projectDescription,
    });


    sendProductShowcaseConfirmationEmail(registration).catch(err =>
      console.error('[ProductShowcase] Email send error:', err.message)
    );


    return res.status(201).json({
      success: true,
      message: 'Product showcase registration successful. Event details have been sent to your email.',
    });
  } catch (err) {
    console.error('[ProductShowcase] Error:', err);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred. Please try again.',
    });
  }
}

module.exports = { productShowcaseRegister };
