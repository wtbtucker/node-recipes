const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    SALT_WORK_FACTOR = 10,
    bcrypt = require('bcrypt');

const UserSchema = new Schema({
    username: {
        type: String, 
        lowercase: [true, 'lowercase only'], 
        required: [true, "can't be blank"], 
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
        index: {unique: true}
    },
    email: {
        type: String, 
        lowercase: [true, 'lowercase only'], 
        required: [true, "can't be blank"], 
        match: [/\S+@\S+\.\S+/, 'is invalid'], 
        index: {unique: true}
    },
    bio: String,
    password: {
        type: String, 
        required: true
    }
}, { timestamps: true });


UserSchema.pre('save', function(next) {
    let user = this;

    // only hash password if it has been modified or is new
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // replace cleartext password with hash
            user.password = hash;
            next();
        });
    });
});


UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model('User', UserSchema);
module.exports = User;