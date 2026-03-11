const redis = require("../config/redis");
const sendEmail = require("../services/email.service");
const Notification = require("../models/notification.model");
const reminderSetEmail = require("../templates/reminderSetEmail");
const reminderDueEmail = require("../templates/reminderDueEmail");
const itemExpiredEmail = require("../templates/itemExpiredEmail");

const STREAM = "notifications.events";
const GROUP = "notification-service";
const CONSUMER = "notification-workers-1";

const startConsumer = async () => {
  try {
    await redis.xGroupCreate(STREAM, GROUP, "0", { MKSTREAM: true });
  } catch (err) {
    if (!err.message.includes("BUSYGROUP")) throw err;
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

        // Create notification in DB
        let emailHtml = "";
        let emailSubject = "";

        switch (data.type) {
          case "item.created":
            await Notification.create({
              userId: data.userId,
              title: "New Item Added",
              message: `${data.itemName} was added to your grocery list`,
              itemId: data.itemId,
            });
            break;

          case "reminder.set":
            await Notification.create({
              userId: data.userId,
              title: "Reminder Set",
              message: `Reminder set for ${data.itemName} on `,
              reminderDate: data.reminderDate,
              reminderId: data.reminderId,
            });

            emailSubject = "Reminder Set";
            emailHtml = reminderSetEmail({
              itemName: data.itemName,
              reminderDate: new Date(data.reminderDate).toLocaleDateString(
                undefined,
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              ),
            });
            await sendEmail(data.email, emailSubject, emailHtml);
            break;

          case "reminder.due":
            await Notification.create({
              userId: data.userId,
              title: "Reminder Due",
              message: `Reminder is due for ${data.itemName} now`,
              reminderId: data.reminderId,
            });

            emailSubject = "Reminder Due";
            emailHtml = reminderDueEmail({
              itemName: data.itemName,
              reminderDate: data.reminderDate,
            });
            await sendEmail(data.email, emailSubject, emailHtml);
            break;

          case "item.expired":
            await Notification.create({
              userId: data.userId,
              title: "Item Expired",
              message: `${data.itemName} has expired`,
              itemId: data.itemId,
            });

            emailSubject = "Item Expired";
            emailHtml = itemExpiredEmail({
              itemName: data.itemName,
              expiredAt: data.expiredAt,
            });
            await sendEmail(data.email, emailSubject, emailHtml);
            break;

          default:
            console.warn("Unknown notification type:", data.type);
        }

        // Acknowledge message
        await redis.xAck(STREAM, GROUP, message.id);
      }
    }
  }
};

module.exports = startConsumer;
