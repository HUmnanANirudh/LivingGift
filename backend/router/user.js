const express = require('express');
const router = express.Router();
const Eusers = require('../Models/User');
router.post('/signup', async (req, res) => {
    try {
        const { email, Username, password } = req.body;
        const existinguser = await Eusers.findOne({ Username: Username });
        if (existinguser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const newUser = new Eusers({
            email: email,
            Username: Username,
            password: passwords
        });

        await newUser.save();

        res.status(201).json({
            msg: "User created successfully"
        });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({
            msg: "Error creating user",
            error: err.message
        });
    }
});
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existinguser = await Eusers.findOne({ email: email, password: password });
        if (!existinguser) {
            return res.status(400).json({ msg: "No user exists with this combination" });
        }
        res.status(200).json({
            msg: "User signed in successfully"
        });
    } catch (err) {
        console.error("Error signing in user:", err);
        res.status(500).json({
            msg: "Error signing in user",
            error: err.message
        });
    }
});

module.exports = router;