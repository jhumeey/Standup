const { body, validationResult } = require('express-validator')
exports.createUserValidationRules = () => {
    return [
        body('firstname').isLength({ min: 5 }).withMessage('Firstname must not be less than 4 characters'),
        body('lastname').isLength({ min: 5 }).withMessage('Lastname must not be less than 4 characters'),
        body('email').isEmail().withMessage("Email must be valid"),
        body('gender').isLength({ min: 4 }).withMessage("A Gender Must be choosen"),
        body('department').isLength({ min: 5 }).withMessage("A Department must be choosen"),
        body('role').isLength({ min: 4 }).withMessage("An Option must be selected"),
        body('password').isLength({ min: 5 }).withMessage("Password must not be less than 5 characters"),
    ]
   
}

exports.createValidate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push( err.msg ))
    console.log(extractedErrors);
    req.flash("error", {message: extractedErrors });
    res.redirect("/users/create");
}

exports.editUserValidationRules = () => {
    return [
        body('firstname').isLength({ min: 5 }).withMessage('Firstname must not be less than 4 characters'),
        body('lastname').isLength({ min: 5 }).withMessage('Lastname must not be less than 4 characters'),
        body('email').isEmail().withMessage("Email must be valid"),
        body('gender').isLength({ min: 4 }).withMessage("A Gender Must be choosen"),
        body('department').isLength({ min: 5 }).withMessage("A Department must be choosen"),
        body('role').isLength({ min: 4 }).withMessage("An Option must be selected"),
    ]

}
exports.editValidate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push(err.msg))
    console.log(extractedErrors);
    req.flash("error", { message: extractedErrors });
    res.redirect("/users/edit/" + req.params.id);
}
exports.UserProfileValidationRules = () => {
    return [
        body('firstname').isLength({ min: 5 }).withMessage('Firstname must not be less than 4 characters'),
        body('lastname').isLength({ min: 5 }).withMessage('Lastname must not be less than 4 characters'),
        body('email').isEmail().withMessage("Email must be valid"),
        body('department').isLength({ min: 5 }).withMessage("A Department must be choosen"),
    ]

}
exports.userProfileValidate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push(err.msg))
    console.log(extractedErrors);
    req.flash("error", { message: extractedErrors });
    res.redirect("/users/profile");
}

exports.questionValidationRules = () => {
    return [
        body('answers').isLength({ min: 1 }).withMessage("Name must be a minimum of 4 characters "),
        body('question').isLength({ min: 4 }).withMessage("Description must be a  minimum of 4 characters"),
        body('correctAnswer').isLength({ min: 1 }).withMessage("Status must be a  minimum of 4 characters")
    ]

}

exports.validateQuestion = (req, res, next) => {
    try{
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }
        const extractedErrors = []
        errors.array().map(err => extractedErrors.push(err.msg))
        req.flash("error", { message: extractedErrors });
        res.redirect("/activity/createquestion/" + req.params.id);
    }catch(error){
        console.log(error.message)
    }
   
}
exports.editValidateQuestion = (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }
        const extractedErrors = []
        errors.array().map(err => extractedErrors.push(err.msg))
        req.flash("error", { message: extractedErrors });
        res.redirect("/activity/createquestion/" + req.params.id);
    } catch (error) {
        console.log(error.message)
    }

}
exports.activityValidationRules = () => {
    return [
        body('name').isLength({ min: 4 }).withMessage("Name must be a minimum of 4 characters "),
        body('description').isLength({ min: 4 }).withMessage("Description must be a  minimum of 4 characters"),
        body('activityType').isLength({ min: 3 }).withMessage("ActivityType  must be a  minimum of 3 characters"),
    ]

}

exports.validateActivity = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push(err.msg))
    console.log(extractedErrors);
    req.flash("error", { message: extractedErrors });
    res.redirect("/events/all");
}
exports.editValidateActivity = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push(err.msg))
    console.log(extractedErrors);
    req.flash("error", { message: extractedErrors });
    res.redirect("/activity/all");
}
exports.eventValidationRules = () => {
    return [
        body('name').isLength({ min: 4 }).withMessage("Name must be a minimum of 4 characters "),
        body('description').isLength({ min: 4 }).withMessage("Description must be a  minimum of 4 characters"),
        body('status').isLength({ min: 4 }).withMessage("Status must be a  minimum of 4 characters"),
        body('eventDate').isLength({ min: 4 }).withMessage("Event Date must be a  minimum of 4 characters"),
    ]

}

exports.validateEvent = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push(err.msg))
    console.log(extractedErrors);
    req.flash("error", { message: extractedErrors });
    res.redirect("/events/create");
}


exports.editValidateEvent = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push(err.msg))
    console.log(extractedErrors);
    req.flash("error", { message: extractedErrors });
    res.redirect("/events/all");
}