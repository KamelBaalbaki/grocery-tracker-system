const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const itemController = require('../controllers/item.controller');

router.use(auth);

router.post('/', itemController.createItem);
router.get('/', itemController.getUserItems);
router.put('/:itemId', itemController.updateItem);
router.delete('/:itemId', itemController.deleteItem);

module.exports = router;