const express = require("express");
const router = express.Router();
const adviceController = require("../controllers/adviceController");
const {
  validateAdviceRequest,
  validateHistoryRequest,
  validateAdviceActionRequest,
  validateTitleUpdateRequest,
} = require("../middleware/requestValidator");

router.post("/", validateAdviceRequest, adviceController.createAdvice);
router.get(
  "/:user_id",
  validateHistoryRequest,
  adviceController.getAdviceHistory
);
router.delete(
  "/:id",
  validateAdviceActionRequest,
  adviceController.removeAdvice
);
router.patch("/:id", validateTitleUpdateRequest, adviceController.updateAdvice);

module.exports = router;
