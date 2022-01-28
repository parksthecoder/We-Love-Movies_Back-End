const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

function update(updatedReview, review_id) {
  return knex("reviews")
    .select("*")
    .where({ review_id })
    .update(updatedReview)
    .then((updatedRecords) => updatedRecords[0]);
}

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

const addCritic = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

function readUpdateWithCritic(review_id) {
  return knex("reviews as r")
    .join("critics as c")
    .select("*")
    .where({ review_id })
    .first()
    .then(addCritic);
}

function listReviewsForMovie(movie_id) {
  return knex("reviews")
    .select("*")
    .where({ movie_id })
}

function readCritic(criticId) {
	return knex("critics")
		.select("*")
		.where({ critic_id: criticId })
		.first();
}

module.exports = {
  read,
  update,
  delete: destroy,
  readUpdateWithCritic,
  listReviewsForMovie,
  readCritic
};
