const config = require("config");
const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const mongoose = require("mongoose");

const app = express();
const home = require("./routes/home");
const users = require("./routes/users");
const admin = require("./routes/admin");
const activity = require("./routes/activity");
const checkin = require("./routes/checkin");
const events = require("./routes/event");
const userscores = require("./routes/userscores");
const quiz = require("./routes/quiz");
const userresponses = require("./routes/userresponses");

if (!config.get("jwtPrivateKey")) {
	console.error("FATAL ERROR: jwtPrivateKey is not defined.");
	process.exit(1);
}

mongoose
	.connect("mongodb://localhost/standup", {
		useCreateIndex: true,
		useNewUrlParser: true
	})
	.then(() => console.log("connected to mongoDB"))
	.catch(err => console.log("could not connect to mongoDB..."));

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST");
	res.setHeader("Access-Control-Allow-Headers", "x-auth-token");
	next();
});

app.use(express.static(path.join(__dirname, "/public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
let sess = {
	name: "aminat",
	secret: "Aminat project",

	resave: false,
	secure: false,
	saveUninitialized: true,
	expires: new Date(Date.now() + (30 * 86400 * 1000)),
	cookie: {
		expires: 86400000
	}
};
app.use(session(sess));



app.use(flash());
app.use(function(req, res, next) {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	// console.log(res.locals.error);
	// console.log(res.locals.success);
	next();
})

app.use(express.json());

app.use("/", home);
app.use("/users", users);
app.use("/", events);
app.use("/", userscores);
app.use("/admin", admin);
app.use("/activity", activity);
app.use("/checkin", checkin);
app.use("/quiz", quiz);
app.use("/userresponses", userresponses);
app.use(function (err, res) {
	res.status(422).send({ error: err.message });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
