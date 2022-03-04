const pastes = require("../data/pastes-data");

function list(req, res) {
  res.json({ data: pastes });
}

// New middleware function to validate the request body - old validation
// function bodyHasTextProperty(req, res, next) {
//   const { data: { text } = {} } = req.body;
//   if (text) {
//     return next(); // Call `next()` without an error message if the result exists
//   }
//   next({
//     status: 400,
//     message: "A 'text' property is required.",
//   });
// }

//special notes: even if it goes through each error handler, once it is fulfilled, it will stop checking each route

//this function checks if the paste exist by id
function pasteExists(req, res, next) {
  const { pasteId } = req.params; //accessing query parameters from the url, and object that will be stored in key value pairs.  It is part of the URL address after "?key:value"
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
  if (foundPaste) {
    res.locals.paste = foundPaste;
    return next();
  }
  next({
    status: 404,
    message: `Paste id not found: ${pasteId}`,
  });
}

function update(req, res) {
  const paste = res.locals.paste;
  const { data: { name, syntax, expiration, exposure, text } = {} } = req.body;
  // Update the paste
  paste.name = name;
  paste.syntax = syntax;
  paste.expiration = expiration;
  paste.exposure = exposure;
  paste.text = text;
  res.json({ data: paste });
}

function read(req, res, next) {
  res.json({ data: res.locals.paste });
}

//this function validates any property (key-value pair) that the developer wants but then exports towards the end of the file.
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}

function exposurePropertyIsValid(req, res, next) {
  const { data: { exposure } = {} } = req.body;
  const validExposure = ["private", "public"];
  if (validExposure.includes(exposure)) {
    return next();
  }
  next({
    status: 400,
    message: `Value of the 'exposure' property must be one of ${validExposure}. Received: ${exposure}`,
  });
}

function syntaxPropertyIsValid(req, res, next) {
  const { data: { syntax } = {} } = req.body;
  const validSyntax = [
    "None",
    "Javascript",
    "Python",
    "Ruby",
    "Perl",
    "C",
    "Scheme",
  ];
  if (validSyntax.includes(syntax)) {
    return next();
  }
  next({
    status: 400,
    message: `Value of the 'syntax' property must be one of ${validSyntax}. Received: ${syntax}`,
  });
}

function expirationIsValidNumber(req, res, next) {
  const { data: { expiration } = {} } = req.body;
  if (expiration <= 0 || !Number.isInteger(expiration)) {
    return next({
      status: 400,
      message: `Expiration requires a valid number`,
    });
  }
  next();
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
  console.log(newPaste);
  res.status(201).json({ data: newPaste });
}

function destroy(req, res) {
  const { pasteId } = req.params;
  const index = pastes.findIndex((paste) => paste.id === Number(pasteId));
  // `splice()` returns an array of the deleted elements, even if it is one element
  const message = `This has been deleted: ${index}`;
  const deletedPastes = pastes.splice(index, 1);
  res.json({ data: message });
}

//create: this puts the middle ware and the route handler together in an array.
module.exports = {
  create: [
    bodyDataHas("name"),
    bodyDataHas("syntax"),
    bodyDataHas("exposure"),
    bodyDataHas("expiration"),
    bodyDataHas("text"),
    bodyDataHas("user_id"),
    exposurePropertyIsValid,
    syntaxPropertyIsValid,
    expirationIsValidNumber,
    create,
  ],
  list,
  read: [pasteExists, read],
  update: [
    pasteExists,
    bodyDataHas("name"),
    bodyDataHas("syntax"),
    bodyDataHas("exposure"),
    bodyDataHas("expiration"),
    bodyDataHas("text"),
    exposurePropertyIsValid,
    syntaxPropertyIsValid,
    expirationIsValidNumber,
    update,
  ],
  delete: [pasteExists, destroy],
};
