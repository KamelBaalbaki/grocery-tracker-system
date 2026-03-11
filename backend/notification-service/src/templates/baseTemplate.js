const baseTemplate = ({ title, content }) => {
  return `
  <div style="background:#f8faf5;padding:40px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
    
    <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.08);">
      
      <!-- HEADER -->
      <tr>
        <td style="background:linear-gradient(135deg,#16a34a 0%,#22c55e 100%);padding:28px;text-align:center;color:white;">
          
          <div style="display:flex;align-items:center;justify-content:center;gap:10px;">
          
            <img src="cid:logo" width="32" height="32" style="margin-right:10px;"/>

            <span style="font-size:20px;font-weight:600;">
               Smart Grocery Tracker
            </span>

          </div>

        </td>
      </tr>

      <!-- CONTENT -->
      <tr>
        <td style="padding:40px;">
          <h2 style="margin-top:0;color:#1f2937;font-size:20px;">${title}</h2>

          ${content}

          <div style="margin-top:30px;text-align:center;">
            <a href="http://localhost:5173"
               style="background:#16a34a;color:white;text-decoration:none;padding:12px 22px;border-radius:12px;font-weight:600;display:inline-block;">
               Open Smart Grocery Tracker App
            </a>
          </div>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:linear-gradient(135deg,#16a34a 0%,#22c55e 100%);padding:20px;text-align:center;font-size:12px;color:white;">
          Stay fresh and organized • Smart Grocery Tracker • ${new Date().getFullYear()}
        </td>
      </tr>

    </table>

  </div>
  `;
};

module.exports = baseTemplate;