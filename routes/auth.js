import express, { Router } from "express";
import { checkPassword } from "../controllers/hashController.js";
import User from "../models/User.js";

const auth = new Router();
auth.use(express.static("static"));

auth.get("/login", async (req, res) => {
    console.log(req.logout);
    res.render("login");
});

auth.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username == undefined || password == undefined)
        return res.status(422).send({ message: "Invalid fields" });

    const user =
        (await User.findOne({ where: { email: username } })) ||
        (await User.findOne({ where: { username: username } }));
    if (user == null)
        return res.status(404).send({ message: "User not found" });
    const test = await checkPassword(password, user.password);
    if (!test) return res.status(403).send({ message: "Invalid password" });
    // set session data and redirect to dashboard
    req.session.uuid = user.uuid;
    console.log(`${user.email} logged in`);
    res.status(200).send({message: "logged in", loggedin: true})
});

auth.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        req.logout = true;
        res.redirect('/auth/login');
    })
})

async function authenticate(user, pass) {}

export default auth;
