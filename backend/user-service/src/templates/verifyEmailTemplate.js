const baseTemplate = require("./baseTemplate");

const verifyEmailTemplate = ({ verifyURL }) => {
  const content = `
    <p style="color:#4b5563;font-size:15px;">
      Please verify your email by clicking the link below:
    </p>

    <div style="background:#f8faf5;border-radius:12px;padding:20px;margin-top:20px;">
     <p style="text-align:center;margin:0;color:#4b5563;font-weight:600;font-size:16px;">
        <a href="${verifyURL}" style="color:#16a34a;font-weight:bold;text-decoration:none;">
          Verify Email
        </a>
      </p>
    </div>
  `;

  return baseTemplate({
    title: "Verify Your Email",
    content,
  });
};

module.exports = verifyEmailTemplate;