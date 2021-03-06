const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/check-auth");
const UserController = require("../controllers/user");

router.post("/signup", UserController.signUp);
router.post("/login", UserController.login);
router.delete("/:userId", checkAuth, UserController.delete);

module.exports = router;
