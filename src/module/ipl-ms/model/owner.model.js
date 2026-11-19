import { boolean } from "joi";
import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        required : [true, "Owner name is required"],
        minlength : 2,
        maxlength : 255
    },

    email : {
        type : String,
        lowercase : true,
        required : [true, 'email is required'],
        unique : true,
        minlength : 10,
        maxlength : 254
    },

    emailVerified : {
        type : boolean,
        default : false,
        select : false
    },

    company : {
        type : String,
        trim : true,
        required : [true, "company name is required"],
        minlength : 2,
        maxlength : 255
    },

    role : {
        type : String,
        enum : ['Owner', 'Admin'],
        default : 'Owner'
    },

    password : {
        type: String,
        trim : true,
        required : true,
        minlength : 6,
        maxlength : 252,
        select : false
    },
    refreshToken : {
        type : String,
        trim : true,
        select : false,
        default : false
    },
    emailVerificationToken : {
        type : string,
        trim : true,
        select : false,
        default : false
    }

}, {timestamps : true} )

export default mongoose.model('Owner', ownerSchema)