const Sib = require("sib-api-v3-sdk");
require("dotenv").config();

exports.forgotPassword = async (req, res, next) => {
  const client = Sib.ApiClient.instance;

  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const tranEmailApi = new Sib.TransactionalEmailsApi();

  const sender = {
    email: "sabareesanrajkumar05@gmail.com",
  };

  const receivers = [
    {
      email: req.body.email,
    },
  ];

  try {
    const response = await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Reset your password",
      textContent: `
        This email will guide you to reset your password.
        `,
    });

    console.log("Email sent successfully:", response);
    res
      .status(200)
      .json({ message: "Password reset email sent successfully!" });
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.text || error.message
    );
    res.status(500).json({ error: "Failed to send password reset email." });
  }
};
