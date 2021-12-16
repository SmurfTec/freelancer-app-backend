const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports = catchAsync(async (req, res, next) => {
  if (!req.user.isVerified)
    return next(
      new AppError(`Your profile must be verified to perform this action`, 401)
    );
  next();
});
