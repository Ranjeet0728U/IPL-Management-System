import * as ownerService from "../services/owner.service.js"
import ApiResponse from "../../../common/utils/api-respons.js"

const createOwner = async(req, res) => {
    try{
        const owner = await ownerService.createOwner(req.body)

        return ApiResponse.created(
            res,
            "owner is created successfully",
            owner
        )
    }
    catch(err){
        return res.status(err.statusCode).json({
            success : false,
            message : err.message
        })
    }
}

const login = async (req, res) => {
    try{
        const {accessToken, refreshToken, user} = await ownerService.login(req.body)
        console.log('accessToken: -', accessToken)

        res.cookies('accessToken', accessToken, {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'PRODUCTION',
            sameSite : 'lax',
            maxAge : 15 * 60 * 1000
        })

        res.cookies('refreshToken', refreshToken, {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'PRODUCTION',
            sameSite : 'lax',
            maxAge : 7 * 24 * 60 * 60 * 1000
        })
        return ApiResponse.ok(res, 'Login SuccessFul', {user});
    }catch(err) {
        return res.status(err.statusCode || 500).json({
            success : false,
            message : err.message
        })
    }


}

const getAllOwner = async( req, res) => {
    try{
        const owners = await ownerService.getAllOwner()
        return ApiResponse.ok(res, "Success", owners)
    }catch(err){
        return res.status(err.statusCode).json({
            success : false,
            message : err.message
        })
    }
}

const getbyId = async (req, res) => {
    try{
        const  id  = req.params.id;
        const owner = await ownerService.getById(id)
        return ApiResponse.ok(res, "Success", owner)
    }
    catch(err){
        return res.status(err.statusCode).json({
            success : false,
            message : err.message
        })
    }
}

const updateOwner = async (req, res) => {
    try{
        const owner = ownerService.updateOwner(req.params.id, req.body)
        return ApiResponse.ok(res, "success" , owner)
    }
    catch(err){
        return res.status(err.statusCode).json({
            success : false,
            message : err.message
        })
    }
}


const deleteOwner = async (req, res) => {
    try{
        const id = req.params.id

        const owner = await ownerService.deleteOwner( id )
        return ApiResponse.ok(res, "Success", owner)
    }catch(err) {
        return res.status(err.statusCode).json({
            success : false,
            message : err.message
        })
    }
    
}


export {
    createOwner,
    login,
    getAllOwner,
    getbyId,
    updateOwner,
    deleteOwner
}