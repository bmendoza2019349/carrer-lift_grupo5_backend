import mongoose, {Schema} from "mongoose";

const roles = ['teacher', 'student', 'superAdmin'];

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    roleUser: {
        type: String,
        enum: roles,
        require: true,
    },
    stateUser: {
        type: Boolean,
        require: true 
    },
})

UserSchema.methods.toJSON = function(){
    const { __v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}

export default mongoose.model('User', UserSchema)