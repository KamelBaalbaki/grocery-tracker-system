const baseTemplate = require("./baseTemplate");

const reminderDueEmail = ({ itemName }) => {
  const content = `
    <p style="color:#4b5563;font-size:15px;">
      It's time to check your reminder.
    </p>

    <div style=" background:#f8faf5;border-radius:12px;padding:20px;margin-top:20px;">
      <p style="margin:0;color:#4b5563;font-weight:600;font-size:14px;">Item: <span style="font-weight:400">${itemName}</span></p>
    </div>
  `;

  return baseTemplate({
    title: "Reminder Due",
    content,
  });
};

module.exports = reminderDueEmail;