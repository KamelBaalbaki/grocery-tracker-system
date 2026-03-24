const baseTemplate = require("./baseTemplate");

const reminderSetEmail = ({ itemName, reminderDate }) => {
  const content = `
    <p style="color:#4b5563;font-size:15px;">
      Your reminder has been successfully scheduled.
    </p>

    <div style=" background:#f8faf5;border-radius:12px;padding:20px;margin-top:20px;">
      <p style="margin:0;color:#4b5563;font-weight:600;font-size:14px;">Item: <span style="font-weight:400">${itemName}</span></p>

      <p style="margin:0;color:#4b5563;font-weight:600;font-size:14px;">Reminder Date: <span style="font-weight:400">${reminderDate}</span></p>
    </div>

    <div style="margin-top:30px;text-align:center;">
      <a href="http://localhost:5173/reminders"
          style="background:#16a34a;color:white;text-decoration:none;padding:12px 22px;border-radius:12px;font-weight:600;display:inline-block;">
          Open Smart Grocery Tracker App
      </a>
    </div>
  `;

  return baseTemplate({
    title: "Reminder Scheduled",
    content,
  });
};

module.exports = reminderSetEmail;
