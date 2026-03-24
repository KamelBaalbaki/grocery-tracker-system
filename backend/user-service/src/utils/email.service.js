const transporter = require("../config/mailer");
const path = require("path");

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Grocery Tracker System" <${process.env.GMAIL_EMAIL}>`,
    to,
    subject,
    html,
    attachments: [
      {
        filename: "leaf.png",
        path: path.join(__dirname, "../templates/assets/leaf.png"),
        cid: "logo",
      },
    ],
  });
};

module.exports = sendEmail;