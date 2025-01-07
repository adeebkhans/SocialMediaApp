import express from "express";

const PORT = 3000;
const Hostname = "localhost";

const app = express();

app.listen(PORT, Hostname, () => {
    console.log(`Listening at http://${Hostname}:${PORT}`);
});
