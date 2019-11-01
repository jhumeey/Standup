const { body, validationResult } = require('express-validator')
const activityValidationRules = () => {
    return [
        body('name').isLength({ min: 4 }).withMessage("Name must be a minimum of 4 characters "),
        body('description').isLength({ min: 4 }).withMessage("Description must be a  minimum of 4 characters"),
        body('activityType').isLength({ min: 3 }).withMessage("ActivityType  must be a  minimum of 3 characters"),
    ]

}

const validateActivity = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push(err.msg))
    console.log(extractedErrors);
    req.flash("error", { message: extractedErrors });
    res.redirect("/events/create");
    // return res.status(422).json({
    //     errors: extractedErrors,
    // })
}

module.exports = {
    activityValidationRules,
    validateActivity,
}