const express = require("express");
const Datastore = require("nedb");

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const db = new Datastore({ filename: "key_log.db" });
db.loadDatabase(err => {
    if (err !== null) {
        console.error("Problem on DB load: ");
        console.error(err);
    }
});

app.get("/api/v1/key", (request, response) => {
    console.log("All keys requested.");
    db.find({}, (err, keys) => {
        response.json(keys);
    });
});


app.get("/api/v1/key/exists/:id", (request, response) => {
    console.log("Adding new key to db...");
    console.log(`Checking for ${request.params.id}...`);
    db.find({ key_id: request.params.id }, (err, result) => {
        if (err) {
            data = {};
        } else {
            if (result === undefined || result.length == 0) {
                response.send({keyExists: false});
                response.end();
            } else {
                response.send({keyExists: true});
                response.end();
            }
        }
    });
});


app.post("/api/v1/key/add", (request, response) => {
    console.log("Adding new key to db...");
    db.insert({ 
        key_id: parseInt(request.body.id),
        key_desc: request.body.desc,
        key_avail: true,
        time_removed: null,
        created_ms: Date.now()
    }, (err, newDoc) => {
        if (err) {
            console.error("Sending failure to client...");
            const data = {
                status: "FAIL"
            };
            response.json(data);
            response.end();
        } else {
            console.log("Sending success to client...");
            const data = {
                status: "SUCCESS",
                newKey: newDoc
            };
            response.json(data);
            response.end();
        }
    });
});


app.post("/api/v1/key/edit", (request, response) => {
    response.json({
        status: "SUCCESS"
    });
    response.end();
});


app.post("/api/v1/key/delete", (request, response) => {
    response.json({
        status: "SUCCESS"
    });
    response.end();
});