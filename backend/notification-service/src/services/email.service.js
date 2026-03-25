const transporter = require("../config/mailer");
const path = require("path");

const sendEmail = async (to, subject, html) => {
  try{ 
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

    return {success:true}

  } catch (error) {
      console.log("Failed to send email.", error)
      return {success:false, erorr: error.message}; //even if unsuccessful, returns safely to prevent service from crashing
  }
};

module.exports = sendEmail;