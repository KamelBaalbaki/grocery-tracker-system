const itemService = require("../services/item.service");
const mongoose = require("mongoose");
const { publishItemCreated, publishItemExpired } = require("../events/publishNotificationEvent");
const redis = require("../config/redis");

const createItem = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const item = await itemService.createItem(req.user.id, req.body);

    if (item.expiryDate) {
      const expiryTime = new Date(item.expiryDate).getTime();

      if (expiryTime <= Date.now()) {
        const expiredItem = await itemService.markItemAsExpired(
            item._id,
            req.user.id
        );

        await publishItemExpired({
          userId: req.user.id,
          item: expiredItem
        });

        return res.status(201).json(expiredItem);
      }

      await redis.zAdd("item:expirations", [{
        score: expiryTime,
        value: item._id.toString()
      }]);

      console.log("ZADD executed for item:", item._id.toString());
    }

    await publishItemCreated({
      userId: req.user.id,
      item
    });

    res.status(201).json(item);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserItems = async (req, res) => {
  try {
    const items = await itemService.getUserItems(req.user.id);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const item = await itemService.updateItem(
        req.params.itemId,
        req.user.id,
        req.body
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    try {
      if (item.expiryDate) {
        const expiryTime = new Date(item.expiryDate).getTime();

        if (expiryTime <= Date.now()) {

          if (item.status !== "Expired") {
            const expiredItem = await itemService.markItemAsExpired(
                item._id,
                req.user.id
            );

            await publishItemExpired({
              userId: expiredItem.userId,
              item: expiredItem
            });

            await redis.zRem("item:expirations", item._id.toString());

            return res.status(200).json(expiredItem);
          }
          return res.status(200).json(item);
        }

        let updatedItem = item;

        if (item.status === "Expired") {
          updatedItem = await itemService.markItemAsActive(
              item._id,
              req.user.id
          );
        }
        await redis.zAdd("item:expirations", [{
          score: expiryTime,
          value: item._id.toString()
        }]);

        return res.status(200).json(updatedItem);

      } else {
        await redis.zRem("item:expirations", item._id.toString());
      }
    } catch (err) {
      console.error("Redis expiration update failed", err);
    }

    res.status(200).json(item);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
      return res.status(404).json({ message: "Item not found" });
    }
    const item = await itemService.deleteItem(req.params.itemId, req.user.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    await redis.zRem("item:expirations", req.params.itemId.toString());
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createItem,
  getUserItems,
  updateItem,
  deleteItem,
};
