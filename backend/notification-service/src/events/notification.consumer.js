const redis = require("../config/redis");
const sendEmail = require("../services/email.service");
const Notification = require("../models/notification.model");
const reminderSetEmail = require("../templates/reminderSetEmail");
const reminderDueEmail = require("../templates/reminderDueEmail");
const itemExpiredEmail = require("../templates/itemExpiredEmail");
const { getIO } = require("../config/socket");

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

  const io = getIO();

  while (true) {
    try {
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

          try {
            let notification;
            let emailHtml = "";
            let emailSubject = "";

            switch (data.type) {
              case "item.created":
                notification = await Notification.create({
                  userId: data.userId,
                  title: "New Item Added",
                  message: `${data.itemName} was added to your grocery list`,
                  itemId: data.itemId,
                });
                break;

              case "reminder.set":
                notification = await Notification.create({
                  userId: data.userId,
                  title: "Reminder Set",
                  message: `Reminder set for ${data.itemName}`,
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
                notification = await Notification.create({
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
                notification = await Notification.create({
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
                console.warn("⚠️ Unknown notification type:", data.type);
            }

            if (notification) {
              io.to(data.userId).emit("notification:new", {
                id: notification._id,
                title: notification.title,
                message: notification.message,
                createdAt: notification.createdAt,
              });

              console.log("📡 Notification sent to user:", data.userId);
            }
            await redis.xAck(STREAM, GROUP, message.id);
          } catch (err) {
            console.error("❌ Error processing message:", err);
          }
        }
      }
    } catch (err) {
      console.error("❌ Redis read error:", err);
    }
  }
};

module.exports = startConsumer;
