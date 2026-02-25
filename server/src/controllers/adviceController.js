const adviceService = require("../services/adviceService");

const createAdvice = async (req, res, next) => {
  try {
    const {
      prompt,
      user_id,
      title = "Untitled",
      provider = "openai",
    } = req.body;
    const result = await adviceService.generateAdvice(
      prompt,
      user_id,
      title,
      provider
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getAdviceHistory = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const history = await adviceService.getUserAdviceHistory(user_id);
    res.json(history);
  } catch (err) {
    next(err);
  }
};

const removeAdvice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    const result = await adviceService.deleteAdvice(id, user_id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const updateAdvice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id, title } = req.body;
    const result = await adviceService.updateAdviceTitle(id, user_id, title);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAdvice,
  getAdviceHistory,
  removeAdvice,
  updateAdvice,
};
