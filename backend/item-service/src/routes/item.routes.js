const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const itemController = require('../controllers/item.controller');

router.use(protect);

router.post('/', itemController.createItem);
router.get('/', itemController.getUserItems);
router.put('/:itemId', itemController.updateItem);
router.delete('/:itemId', itemController.deleteItem);

module.exports = router;