const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema(
    {
        name : {type : String, required : true, trim : true},
        email : {type : String, required : true, unique : true, trim : true},
        password : {type : String, required : true}
    },
    {
        timestamps : true
    }
)

// Checking password
userSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.pre('save', async function(next) {
    if(!this.isModified) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model("User", userSchema);

module.exports = User;