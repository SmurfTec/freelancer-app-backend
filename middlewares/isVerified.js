const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports = catchAsync(async (req, res, next) => {
  if (req.user.status !== 'approved')
    return next(
      new AppError(
        `Your profile must be Approved to perform this action`,
        401
      )
    );
  next();
});
