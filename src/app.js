const express = require("express");
const app = express();
app.use(express.json());
const pastes = require("./data/pastes-data");
const pastesRouter = require("./pastes/pastes.router"); //because the controller and route files for the /paste route was created.

// TODO: Follow instructions in the checkpoint to implement ths API.
//special notes: even if it goes through each error handler, once it is fulfilled, it will stop checking each route

app.use("/pastes/:pasteId", (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId)); //The Number method converts/returns a number (ie.from an arguemnt)

  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    next({ status: 404, message: `Paste id not found: ${pasteId}` });
  }
});

// app.get("/pastes", (req, res) => {
//   res.json({ data: pastes });
// replace with what is below});
app.use("/pastes", pastesRouter); // this is the new way of writing the router for pastes

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler general
app.use((error, req, res, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  res.status(status).json({ error: message });
});

module.exports = app;
