const Agenda = require("agenda");
const defineReminderJob = require("../jobs/reminder.job");

const agenda = new Agenda({
  db: {
    address: process.env.MONGO_URI,
    collection: "agendaJobs",
  },
});

const initAgenda = async () => {

  defineReminderJob(agenda);

   agenda.on("error", (err) => {
    console.error("Agenda error:", err);
  });

  await agenda.start();

  console.log("Agenda started and ready to process jobs");
};

module.exports = {
  agenda,
  initAgenda,
};
