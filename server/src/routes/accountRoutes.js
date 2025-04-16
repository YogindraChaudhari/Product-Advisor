const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const {
  validateDeleteAccountRequest,
} = require("../middleware/requestValidator");

router.post(
  "/delete-account",
  validateDeleteAccountRequest,
  accountController.deleteUserAccount
);

module.exports = router;
