import express from "express";
const routes = express.Router();

//Register and Login Routes with POST
routes.post("/register", (req, res) => {
    res.send("Register User");
});
routes.post("/login", (req, res) => {
    res.send("Login User");
});

export default routes;
