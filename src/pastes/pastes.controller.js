const pastes = require("../data/pastes-data");

function list(req, res) {
  res.json({ data: pastes });
}

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

// New middleware function to validate the request body
function bodyHasTextProperty(req, res, next) {
  const { data: { text } = {} } = req.body;
  if (text) {
    return next(); // Call `next()` without an error message if the result exists
  }
  next({
    status: 400,
    message: "A 'text' property is required.",
  });
}
let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

function create(req, res) {
  const { data: { name, syntax, exposure, expiration, text, user_id } = {} } =
    req.body;
  const newPaste = {
    id: ++lastPasteId, // Increment last id then assign as the current ID
    name,
    syntax,
    exposure,
    expiration,
    text,
    user_id,
  };
  pastes.push(newPaste);
  res.status(201).json({ data: newPaste });
}

module.exports = {
  create: [bodyHasTextProperty, create],
  list,
};
