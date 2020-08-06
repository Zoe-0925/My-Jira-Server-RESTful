const path = require("path");
const fs = require("fs");
const http = require('http');
const https = require('https');
const passport = require("passport");
const GithubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../AUthenticationConfig");
const chalk = require("chalk");

module.exports = app => {
    let user = {};

    passport.serializeUser((user, cb) => {
        cb(null, user);
    });

    passport.deserializeUser((user, cb) => {
        cb(null, user);
    });

    // Amazon Strategy
    passport.use(new AmazonStrategy({
        clientID: keys.AMAZON.clientID,
        clientSecret: keys.AMAZON.clientSecret,
        callbackURL: "/auth/amazon/callback"
    },
        (accessToken, refreshToken, profile, cb) => {
            console.log(chalk.blue(JSON.stringify(profile)));
            user = { ...profile };
            return cb(null, profile);
        }));

    // Github Strategy
    passport.use(new GithubStrategy({
        clientID: keys.GITHUB.clientID,
        clientSecret: keys.GITHUB.clientSecret,
        callbackURL: "/auth/github/callback"
    },
        (accessToken, refreshToken, profile, cb) => {
            console.log(chalk.blue(JSON.stringify(profile)));
            user = { ...profile };
            return cb(null, profile);
        }));

    // Google Strategy
    passport.use(new GoogleStrategy({
        clientID: keys.GOOGLE.clientID,
        clientSecret: keys.GOOGLE.clientSecret,
        callbackURL: "/auth/google/callback"
    },
        (accessToken, refreshToken, profile, cb) => {
            console.log(chalk.blue(JSON.stringify(profile)));
            user = { ...profile };
            return cb(null, profile);
        }));

    app.use(passport.initialize());

    app.get("/auth/amazon", passport.authenticate("amazon", {
        scope: ["profile"]
    }));
    app.get("/auth/amazon/callback",
        passport.authenticate("amazon"),
        (req, res) => {
            res.redirect("/profile");
        });

    app.get("/auth/github", passport.authenticate("github"));
    app.get("/auth/github/callback",
        passport.authenticate("github"),
        (req, res) => {
            res.redirect("/profile");
        });

    app.get("/auth/google", passport.authenticate("google", {
        scope: ["profile", "email"]
    }));
    app.get("/auth/google/callback",
        passport.authenticate("google"),
        (req, res) => {
            res.redirect("/profile");
        });

    app.get("/user", (req, res) => {
        console.log("getting user data!");
        res.send(user);
    });

    app.get("/auth/logout", (req, res) => {
        console.log("logging out!");
        user = {};
        res.redirect("/");
    });
}