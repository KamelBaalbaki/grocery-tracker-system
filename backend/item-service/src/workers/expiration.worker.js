const redis = require("../config/redis");
const Item = require("../models/item.model");

const STREAM = "notifications.events";
const CHECK_INTERVAL = 5000;

const startExpirationWorker = async () => {
    console.log("⏰ Expiration worker started");

    while (true) {
        try {
            const now = Date.now();

            const expiredItemIds = await redis.zRangeByScore(
                "item:expirations",
                0,
                now
            );

            for (const itemId of expiredItemIds) {

                // 1️⃣ Update DB first (idempotent)
                const item = await Item.findOneAndUpdate(
                    { _id: itemId, status: "Active" },
                    { status: "Expired" },
                    { new: true }
                );

                if (!item) {
                    // already expired or deleted → clean Redis anyway
                    await redis.zRem("item:expirations", itemId);
                    continue;
                }

                // 2️⃣ Remove from Redis
                await redis.zRem("item:expirations", itemId);

                // 3️⃣ Emit event
                await redis.xAdd(STREAM, "*", {
                    type: "item.expired",
                    userId: item.userId.toString(),
                    itemId: item._id.toString(),
                    itemName: item.name,
                    expiredAt: new Date().toISOString()
                });
            }
        } catch (err) {
            console.error("Expiration worker error:", err);
        }

        await new Promise(r => setTimeout(r, CHECK_INTERVAL));
    }
};

module.exports = startExpirationWorker;
