const { body, validationResult } = require('express-validator')
const eventValidationRules = () => {
    return [ 
        body('name').isLength({ min: 4 }).withMessage("Name must be a minimum of 4 characters "),
        body('description').isLength({ min: 4 }).withMessage("Description must be a  minimum of 4 characters"),
        body('status').isLength({ min: 4 }).withMessage("Status must be a  minimum of 4 characters"),
        body('activity').isLength({ min: 4 }).withMessage("Activity must be a  minimum of 4 characters"),
        body('eventDate').isLength({ min: 4 }).withMessage("Event Date must be a  minimum of 4 characters"),
    ]

}

const validate = (req, res, next) => {
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
    eventValidationRules,
    validate,
}