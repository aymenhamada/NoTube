const Validator = require("validator")
const isEmpty = require("is-empty");

exports.catchErrors = (fn) => {
    return function(req, res, next){
        return fn(req, res, next).catch(next);
    }
}


exports.validateRegisterInput = (data) => {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.emailConfirmation = !isEmpty(data.emailConfirmation) ? data.emailConfirmation : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.confirmationPassword = !isEmpty(data.confirmationPassword) ? data.confirmationPassword : "";


    if (Validator.isEmpty(data.email)){
        errors.email = "Un email est requis";
    } else if (!Validator.isEmail(data.email)){
        errors.email = "L'email est invalide";
    }

    if(!Validator.equals(data.email, data.emailConfirmation)){
        errors.emailConfirmation = "L'email de confirmation n'est pas identique a l'email";
    }

    if (Validator.isEmpty(data.password)){
        errors.password = "Un mot de passe est requis";
    }

    if (Validator.isEmpty(data.confirmationPassword)){
        errors.confirmationPassword = "Confirmation de mot de passe est requis";
    }

    if (!Validator.isLength(data.password, {min: 6, max: 30})){
        errors.password = "Le mot de passe doit faire au moins 6 caractéres";
    }

    if(!Validator.equals(data.password, data.confirmationPassword)){
        errors.confirmationPassword = "Les mot de passe doit etre identique";
    }

    return{
        errors,
        isValid: isEmpty(errors)
    }
}


exports.validateLoginInput = (data) => {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if (Validator.isEmpty(data.email)){
        errors.email = "L'email est requis";
    } else if (!Validator.isEmail(data.email)){
        errors.email = "L'email est invalide";
    }


    if (Validator.isEmpty(data.password)){
        errors.password = "Le mot de passe est requis";
    }

    return{
        errors,
        isValid: isEmpty(errors)
    }
}
