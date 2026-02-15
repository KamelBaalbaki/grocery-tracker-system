const redis = require("../config/redis");
const Notification = require("../models/notification.model");

const STREAM = "notifications.events";
const GROUP = "notification-service";
const CONSUMER = "notification-workers-1";

const startConsumer = async () => {
  try {
    await redis.xGroupCreate(STREAM, GROUP, "0", {
      MKSTREAM: true,
    });
  } catch (err) {
    if (!err.message.includes("BUSYGROUP")) {
      throw err;
    }
  }

  console.log("👂 Notification consumer started");

  while (true) {
    const response = await redis.xReadGroup(
      GROUP,
      CONSUMER,
      [{ key: STREAM, id: ">" }],
      { COUNT: 10, BLOCK: 5000 },
    );

    if (!response) continue;

    for (const stream of response) {
      for (const message of stream.messages) {
        const data = message.message;

        if (data.type === "item.created") {
          await Notification.create({
            userId: data.userId,
            title: "New Item Added",
            message: `${data.itemName} was added to your grocery list`,
            itemId: data.itemId,
          });
        }

        if (data.type === "reminder.set") {
          await Notification.create({
            userId: data.userId,
            title: "Reminder Set",
            message: `Reminder set for ${data.itemName} on `,
            reminderDate: data.reminderDate,
            reminderId: data.reminderId,
          });
        }

        if (data.type === "reminder.due") {
          await Notification.create({
            userId: data.userId,
            title: "Reminder Due",
            message: `Reminder is due for ${data.itemName} now`,
            reminderId: data.reminderId,
          });
        }

        if (data.type === "item.expired") {
          await Notification.create({
            userId: data.userId,
            title: "Item Expired",
            message: `${data.itemName} has expired`,
            itemId: data.itemId,
          });
        }

        await redis.xAck(STREAM, GROUP, message.id);
      }
    }
  }
};

module.exports = startConsumer;
