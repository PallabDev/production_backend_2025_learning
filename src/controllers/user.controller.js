import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
const registerUser=asyncHandler(async(req,res)=>{
    //taking all input form the fronted
    const {fullName,username,email,password}=req.body;


    //validating all text filed
    if([fullName,username,email,password].some(item => {return (item===undefined || item===null || item?.trim()==="")})){
        throw new ApiError(401,"All fields are required");
    }


    //validating images
    const avatarLocalPath = req.files['avatar'][0].path;
    if(!avatarLocalPath){
        throw new ApiError(401,"Avatar is required");
    }
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files['coverImage']) && req.files['coverImage'].length>0 ){
        coverImageLocalPath = req.files.coverImage[0].path; //only setting the coverimagepath if and only if user send the cover image as this is not the required field
    }
    console.log("avatar local url",avatarLocalPath)
    console.log("coverimage local url",coverImageLocalPath)
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    console.log(avatar)
    if(!avatar){
        throw new ApiError(500,"Avatar upload failed");
    }
    

    const userResponse = await User.create({
        fullName,
        username,
        email,
        password,
        avatar:avatar.secure_url,
        coverImage:coverImage.secure_url
    })
    const userCreated = await User.findById(userResponse._id).select("-password -refreshToken");
    if(!userCreated){
        throw new ApiError(501,"User registration failed due to server error!")
    }
    res.status(200).json(
        new ApiResponse(201,userCreated,"User registered successfully!")
    );
})
export {registerUser}