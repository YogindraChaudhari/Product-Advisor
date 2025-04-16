class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

const validateAdviceRequest = (req, res, next) => {
  const { prompt, user_id } = req.body;

  if (!prompt || !user_id) {
    return next(new ValidationError("Missing prompt or user ID"));
  }

  next();
};

const validateHistoryRequest = (req, res, next) => {
  const { user_id } = req.params;

  if (!user_id) {
    return next(new ValidationError("Missing user ID"));
  }

  next();
};

const validateAdviceActionRequest = (req, res, next) => {
  const { id } = req.params;
  const { user_id } = req.body;

  if (!id || !user_id) {
    return next(new ValidationError("Missing advice ID or user ID"));
  }

  next();
};

const validateTitleUpdateRequest = (req, res, next) => {
  const { id } = req.params;
  const { user_id, title } = req.body;

  if (!id || !user_id || !title) {
    return next(new ValidationError("Missing required fields"));
  }

  next();
};

const validateDeleteAccountRequest = (req, res, next) => {
  const { user_id } = req.body;

  if (!user_id) {
    return next(new ValidationError("Missing user ID"));
  }

  next();
};

module.exports = {
  ValidationError,
  validateAdviceRequest,
  validateHistoryRequest,
  validateAdviceActionRequest,
  validateTitleUpdateRequest,
  validateDeleteAccountRequest,
};
