const baseTemplate = require("./baseTemplate");

const itemExpiredEmail = ({ itemName }) => {
  const content = `
    <p style="color:#4b5563;font-size:15px;">
      One of your tracked items has expired.
    </p>

    <div style=" background:#f8faf5;border-radius:12px;padding:20px;margin-top:20px;">
      <p style="margin:0;color:#4b5563;font-weight:600;font-size:14px;">Expired Item: <span style="font-weight:400">${itemName}</span></p>
    </div>
  `;

  return baseTemplate({
    title: "Item Expired",
    content,
  });
};

module.exports = itemExpiredEmail;