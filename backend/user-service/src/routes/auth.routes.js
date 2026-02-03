const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { registerValidationRules, validate } = require("../middleware/userValidators");


router.post("/register", registerValidationRules, validate, authController.register);
router.post("/login", authController.login);

module.exports = router;
