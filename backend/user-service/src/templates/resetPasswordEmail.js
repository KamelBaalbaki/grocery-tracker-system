const baseTemplate = require("./baseTemplate");

const resetPasswordEmail = ({ resetURL }) => {
  const content = `
    <p style="color:#4b5563;font-size:15px;">
      Click the link below to reset your password:
    </p>

    <div style="background:#f8faf5;border-radius:12px;padding:20px;margin-top:20px;">
      <p style="margin:0;color:#4b5563;font-weight:600;font-size:14px;">
        <a href="${resetURL}">${resetURL}</a>
      </p>
    </div>
  `;

  return baseTemplate({
    title: "Reset Password",
    content,
  });
};

module.exports = resetPasswordEmail;