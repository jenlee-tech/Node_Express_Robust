const pastes = require("../data/pastes-data");

function list(req, res) {
  res.json({ data: pastes });
}

module.exports = {
  list,
};
