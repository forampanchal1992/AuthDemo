const mongoose = require('mongoose');
const bcrypt= require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true,'Username can not be blank']
    },
    password: {
        type: String,
        require: [true,'Password can not be blank']
    }
});

userSchema.statics.findAndValidate = async function(username,passowrd){
    const findUser = await this.findOne({username});
    const isValid = await bcrypt.compare(passowrd, findUser.passowrd);
    return isValid? findUser: false;
}

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    //this.password = 'Not Real Password';
    //hash version password
    this.password =await bcrypt.hash(this.password,12);
    next();
})


module.exports = mongoose.model('User', userSchema);