const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose");
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
var expiryDate = new Date(Date.now() + 60 * 60 * 1000)

require('dotenv').config();

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.Promise = global.Promise
mongoose.connect("mongodb+srv://yakubu:YAks12@me@standup-fr1bf.mongodb.net/standup?retryWrites=true&w=majority", {useCreateIndex:  true})
.then(() => console.log('connected to mongoDB'))
.catch(err => console.log('could not connect to mongoDB...', err))

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

app.set('trust proxy', 1)
app.use(cookieSession({
	name: "standup",
	secret: process.env.SECRET,
	httpOnly: true,
	maxAge: expiryDate
}));

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