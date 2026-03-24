const baseTemplate = require("./baseTemplate");

const itemExpiredEmail = ({ itemName }) => {
  const content = `
    <p style="color:#4b5563;font-size:15px;">
      One of your tracked items has expired.
    </p>

    <div style=" background:#f8faf5;border-radius:12px;padding:20px;margin-top:20px;">
      <p style="margin:0;color:#4b5563;font-weight:600;font-size:14px;">Expired Item: <span style="font-weight:400">${itemName}</span></p>
    </div>

    <div style="margin-top:30px;text-align:center;">
      <a href="http://localhost:5173/grocery-list"
          style="background:#16a34a;color:white;text-decoration:none;padding:12px 22px;border-radius:12px;font-weight:600;display:inline-block;">
          Open Smart Grocery Tracker App
      </a>
    </div>
  `;

  return baseTemplate({
    title: "Item Expired",
    content,
  });
};

module.exports = itemExpiredEmail;
