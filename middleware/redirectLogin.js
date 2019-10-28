// CHECK IF USER EXISTS AUTHENTICATION MIDDLEWARE------ALL ROUTES
module.exports = (req, res, next) => {
    if (!req.session.user) {
        res.redirect("/users/login");
    } else {
        next();
    }
};