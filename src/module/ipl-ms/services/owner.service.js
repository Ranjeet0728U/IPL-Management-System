import bcrypt from 'bcrypt'

import ApiError from "../../../common/utils/apiError.js"
import Owner from "../model/owner.model.js"
import {
    generateAccessToken, 
    generateRefreshToken
} from '../../../common/utils/jwt.token.js  '

const createOwner = async({name, email, company, password}) => {
    
    if(!name || !email || !company || ! password){
        throw ApiError.unprocessableEntity("Please send full data");
    }
    const user = await Owner.findOne({email : email});

    if(user) {
        throw ApiError.conflict(
            'user already exists'
        )
    }
    const hashedPassword = await bcrypt.hash(password, 12) 

    const newOwner = await Owner.create({
        name, 
        email, 
        company,
        password : hashedPassword
    })

    if(!newOwner) throw ApiError.noUser(
        'Unable to create'
    )

    return newOwner
}

const login = async ({email, password}) => {
    
    if(!email || !password){
        throw ApiError.unprocessableEntity("Please send email and password");
    }

    const user = await Owner.findOne({email : email}).select('+password', 'emailVerified', 'refreshToken');

    if(!user){
        throw ApiError.notFound("Please send valid email  and password");
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw ApiError.notFound("Please send valid email  and password");
    }

    if(!user.emailVerified){
        throw ApiError.badRequest("Please verify the email before login")
    }
    const accessToken = generateAccessToken({
        id : user._id,
        email : user.email
    })
    const refreshToken = generateRefreshToken({
        id : user._id
    })
    
    user.refreshToken = await bcrypt.hash(refreshToken, 12);
    const userObject = user.toObject();
    delete userObject.password
    delete userObject.refreshToken
    delete userObject.emailVerified

    return {
        accessToken,
        refreshToken,
        userObject
    }
}


const getAllOwner = async() => {
    const owners = await Owner.find();
    if(!owners) throw ApiError.noUser('No user exists')

    return owners
}

const getById = async( id ) => {
    const owner = await Owner.findById(id);
    if(!owner) throw ApiError.noUser('No user found')

    return owner;
}

const updateOwner = async (id, {name, company}) => {
    if(!id) throw ApiError.badRequest("No id found")
    
    const owner = await Owner.findByIdAndUpdate(
        id, 
        {name, company},
        {new : true, runValidators : true}
    )

    if(!owner) throw ApiError.noUser("No user with such request found")
    return owner
}

const deleteOwner = async( id ) => {
    const owner = await Owner.findOneAndDelete(id)

    if(!owner) throw ApiError.noUser("No user with this id exists")
    return Owner
}

export {
    createOwner,
    login,
    getAllOwner,
    getById,
    updateOwner,
    deleteOwner
}