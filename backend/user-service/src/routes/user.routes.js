const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

router.use(auth);

router.get("/me", userController.getMe);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post("/logout", userController.logout);

module.exports = router;
