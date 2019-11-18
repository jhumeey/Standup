const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;
const app = express();
const home = require("./routes/home");
const users = require("./routes/users");
const admin = require("./routes/admin");
const activity = require("./routes/activities");
const events = require("./routes/events");
const checkins = require("./routes/checkin");
const userscores = require("./routes/userscores");
const questions = require("./routes/questions");
const userresponses = require("./routes/userresponses");

require('dotenv').config();


const uri = "mongodb+srv://yakubuYAks12@me@standup-fr1bf.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
});

// mongoose.connect("mongodb + srv://yakubu:YAks12@me@standup-fr1bf.mongodb.net/test?retryWrites=true&w=majority")
// 		.then(() => console.log('connected to mongoDB'))
// 		.catch(err => console.log(err.message))
app.set('etag', false)
app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST");
	res.setHeader("Access-Control-Allow-Headers", "x-auth-token");
	next();
});
app.use((req, res, next) => {
	res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
	next()
})
app.use(express["static"](path.join(__dirname, "/public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
var sess = {
	name: "aminat",
	secret: process.env.SECRET,
	resave: false,
	secure: false,
	saveUninitialized: true,
	expires: new Date(Date.now(+ 30 * 86400 * 1000)),
		cookie: {
		expires: 86400000
	}
};
app.use(session(sess));
app.use(flash());
app.use(function (req, res, next) {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error'); 
	next();
});
app.use(express.json());
app.use("/", home);
app.use("/users", users);
app.use("/", events);
app.use("/", checkins);
app.use("/", userscores);
app.use("/admin", admin);
app.use("/activity", activity);
app.use("/userresponses", userresponses);
app.use(function (err, res) {
	res.status(422).send({
		error: err.message
	});
});
var port = process.env.PORT || 4000;
app.listen(port, () => {
	return console.log("Listening on port ".concat(port, "..."));
});