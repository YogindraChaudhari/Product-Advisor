const accountService = require("../services/accountService");

const deleteUserAccount = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    const result = await accountService.deleteAccount(user_id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  deleteUserAccount,
};
