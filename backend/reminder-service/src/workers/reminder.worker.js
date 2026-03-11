const redis = require("../config/redis");
const Reminder = require("../models/reminder.model");

const STREAM = "notifications.events";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startReminderWorker = async () => {
  console.log("⏰ Reminder worker started");

  while (true) {
    try {
      const next = await redis.zRangeWithScores("reminder:due", 0, 0);

      if (!next.length) {
        await sleep(30000);
        continue;
      }

      const { value, score } = next[0];
      const data = JSON.parse(value);

      const reminderId = data.reminderId;
      const email = data.email;
      const userId = data.userId;

      const now = Date.now();

      if (score > now) {
        const waitTime = Math.min(score - now, 60000);
        await sleep(waitTime);
        continue;
      }

      const reminder = await Reminder.findOneAndUpdate(
        { _id: reminderId, status: "pending" },
        { status: "sent" },
        { new: true }
      );

      if (!reminder) {
        await redis.zRem("reminder:due", value); 
        continue;
      }

      await redis.zRem("reminder:due", value);

      await redis.xAdd(STREAM, "*", {
        type: "reminder.due",
        userId: userId,
        email: email,
        reminderId: reminder._id.toString(),
        itemName: reminder.itemName,
      });

      console.log(`📨 Reminder event published for ${reminder.itemName}`);
    } catch (err) {
      console.error("Reminder worker error:", err);
      await sleep(5000);
    }
  }
};

module.exports = startReminderWorker;