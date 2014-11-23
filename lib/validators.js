module.exports = {

  regexMatch: function(arg, regex) {
    return arg.match(regex);
  },

  signupValidation: function(req) {
    req.assert('username', 'Only letters and numbers are allow in username.').regexMatch(/^[A-Za-z0-9]*$/);
    req.assert('username', 'Username cannot be more than 30 characters.').len(1, 30);
    req.assert('email', 'Email is not valid.').isEmail();
    req.assert('password', 'Password must be between 4 to 300 characters long.').len(4, 300);
    req.assert('confirmPassword', 'Passwords do not match.').equals(req.body.password);

    return req.validationErrors();
  },

  loginValidation: function(req) {
    req.assert('username', 'Only letters and numbers are allow in username.').regexMatch(/^[A-Za-z0-9]*$/);
    req.assert('username', 'Username cannot be more than 30 characters.').len(1, 30);
    req.assert('password', 'Password cannot be blank').notEmpty();

    return req.validationErrors();
  },

  passwordValidation: function(req) {
    req.assert('email', 'Please enter a valid email address.').isEmail();
    
    return req.validationErrors();
  },

  resetPasswordValidation: function(req) {
    req.assert('password', 'Password must be at least 4 characters long.').len(4);
    req.assert('confirmPassword', 'Passwords must match.').equals(req.body.password);
    
    return req.validationErrors();
  },

  accountSettingsValidation: function(req) {
    var VALID_IMG_REGEX = /(https?:\/\/.*\.(?:png|jpg|gif))/i;

    if (req.body.avatar) req.assert('avatar', 'Must be .png, .jpg, or .gif').regexMatch(VALID_IMG_REGEX);
    if (req.body.website) req.assert('website', 'Invalid website url.').regexMatch(/https?:\/\/.{1,}\..{1,}/);
    req.assert('username', 'Only letters and numbers are allow in username.').regexMatch(/^[A-Za-z0-9]*$/);
    req.assert('username', 'Username cannot be more than 30 characters.').len(1, 30);
    req.assert('email', 'Email is not valid.').isEmail();
    req.assert('bio', 'Bio must be less than or equal to 160 characters.').len(0, 160);
    
    return req.validationErrors();
  }

};
