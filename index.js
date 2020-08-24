const express = require("express");
const Datastore = require("nedb");
const nunjucks = require("nunjucks");
const jsonschema = require("jsonschema");

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const db = new Datastore({ filename: "key_log.db" });
db.loadDatabase((err) => {
  if (err !== null) {
    console.error("Problem on DB load: ");
    console.error(err);
  }
});

db.insert({ label: "12345", available: true });
db.insert({ label: "67890", available: false });
db.insert({ label: "abcd edfg", available: true });

const schema = {
  type: "object",
  properties: {
    label: {
      type: "string",
      minLength: 3,
      maxLength: 30,
    },
    available: {
      type: "boolean",
    },
  },
  required: ["label", "available"],
};

/**
 *
 * Page Routes
 *
 */
app.get("/", (req, res) => {
  res.render("index.njk");
});

app.get("/about/", (req, res) => {
  res.render("about.njk");
});

app.get("/manage/", (req, res) => {
  res.render("manage.njk");
});

/**
 *
 * API Routes
 *
 */

// Gets all keys in the DB
app.get("/keys", (request, response) => {
  db.find({}, (err, keys) => {
    if (err) {
      console.error("Sending failure to client...");
      response.json({
        error: {
          code: 500,
          message: "Failed to retrieve keys.",
        },
      });
      response.end();
    } else {
      console.log("Sending success to client...");
      response.json({
        data: keys,
      });
      response.end();
    }
  });
});

// Gets a specific key by _id
app.get("/keys/:id", (request, response) => {
  const keyID = request.params.id;
  db.find({_id: keyID}, (err, key) => {
    if (err) {
      console.error("Sending failure to client...");
      response.json({
        error: {
          code: 500,
          message: `Failed to retrieve key ${keyID}.`,
        },
      });
      response.end();
    } else {
      console.log("Sending success to client...");
      response.json({
        data: key,
      });
      response.end();
    }
  });
});

// Creates a new key
app.post("/keys", (request, response) => {
  let valid = jsonschema.validate(request.body, schema);

  if (!valid) {
    console.error("Sending failure to client...");
    response.json({
      error: {
        code: 400,
        message: "JSON failed validation. Only `label` and `available` allowed.",
      },
    });
    response.end();
  }

  db.insert(request.body, (err, newDoc) => {
    if (err) {
      console.error("Sending failure to client...");
      response.json({
        error: {
          code: 500,
          message: "Failed to create key.",
        },
      });
      response.end();
    } else {
      console.log("Sending success to client...");
      response.json({
        data: newDoc,
      });
      response.end();
    }
  });
});

// Modifies a key
app.put("/keys/:id", (request, response) => {
  let valid = jsonschema.validate(request.body, schema);

  if (!valid) {
    console.error("Sending failure to client...");
    response.json({
      error: {
        code: 400,
        message: "JSON failed validation. Only `label` and `available` allowed.",
      },
    });
    response.end();
  }

  db.update({ _id: request.params.id }, { $set: request.body }, {}, (err, numReplaced, upsert) => {
    if (err) {
      console.error("Sending failure to client...");
      response.json({
        error: {
          code: 500,
          message: "Failed to update key.",
        },
      });
      response.end();
    } else {
      console.log("Sending success to client...");
      response.json({
        data: `Updated ${numReplaced} key.`,
      });
      response.end();
    }
  });
});

// Removes a single key from the DB
app.delete("/keys/:id", (request, response) => {
  // TODO
});

// Removes all keys in the supplied JSON
app.delete("/keys", (request, response) => {
  // TODO
});
