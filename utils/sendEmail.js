// sendEmail.js
const axios = require("axios");

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: process.env.SENDER_EMAIL },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent, 
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY, // Use your Brevo API key
        },
      }
    );

    console.log("✅ Email sent successfully via Brevo API:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending email via Brevo API:", error.response?.data || error.message);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;