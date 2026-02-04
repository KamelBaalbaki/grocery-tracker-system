const { model } = require('mongoose');
const Item = require('../models/item.model');

const createItem = async (userId, data) => {
    return await Item.create({ ...data, userId });
}

const getUserItems = async (userId) => {
    return await Item.find({ userId }).sort({ createdAt: -1 });
}

const updateItem = async (itemId, userId, data) => {
    return await Item.findOneAndUpdate(
        { _id: itemId, userId },
        { $set: data },
        { new: true }
    );
}

const deleteItem = async (itemId, userId) => {
    return await Item.findOneAndDelete({ _id: itemId, userId });
}

const markItemAsExpired = async (itemId, userId, data) => {
    return await Item.findOneAndUpdate(
    { _id: itemId, userId },
    {
        $set: {
            ...data,
            status: "Expired"
        }
    },
    { new: true }
    );
}

const markItemAsActive = async (itemId, userId) => {
    return await Item.findOneAndUpdate(
        { _id: itemId, userId },
        { $set: { status: "Active" } },
        { new: true }
    );
};


module.exports = {
    createItem,
    getUserItems,
    updateItem,
    deleteItem,
    markItemAsExpired,
    markItemAsActive
};