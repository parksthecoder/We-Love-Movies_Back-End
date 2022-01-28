const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
// const { times } = require("lodash");

async function validateReviewId(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(Number(reviewId));

  if (review) {
    res.locals.review = review;
    return next();
  }

  next({
    status: 404,
    message: "Review cannot be found.",
  });
}

async function destroy(req, res) {
  await service.delete(Number(res.locals.review.review_id));
  res.sendStatus(204);
}

async function update(req, res) {
  const time = new Date().toISOString();

  await service.update(req.body.data, res.locals.review.review_id);

  const dataWithoutTimes = await service.readUpdateWithCritic(
    res.locals.review.review_id
  );

  const dataWithTimes = {
    ...dataWithoutTimes,
    created_at: time,
    updated_at: time,
  };
  res.json({ data: dataWithTimes });
}

async function listReviewsForMovie(req, res) {
  const reviewsForMovie = await service.listReviewsForMovie(
    res.locals.movie.movie_id
  );

  for(let review of reviewsForMovie) {
    const critic = await service.readCritic(review.critic_id)

    review["critic"] = critic;
  }
  res.json({ data: reviewsForMovie})
}

module.exports = {
  update: [validateReviewId, asyncErrorBoundary(update)],
  delete: [validateReviewId, asyncErrorBoundary(destroy)],
  listReviewsForMovie
};
