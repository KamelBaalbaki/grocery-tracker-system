const redis = require('../config/redis');

const publishItemCreated = async ({ userId, item }) => {
    await redis.xAdd("notifications.events", "*", {
        type: "item.created",
        userId: userId.toString(),
        itemId: item._id.toString(),
        itemName: item.name,
    });
};

const publishItemExpired = async ({ userId, item }) => {
    await redis.xAdd("notifications.events", "*", {
        type: "item.expired",
        userId: userId.toString(),
        itemId: item._id.toString(),
        itemName: item.name,
    });
};

module.exports = {
    publishItemCreated,
    publishItemExpired
}