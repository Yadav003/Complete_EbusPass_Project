import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CLOUDINARY_CLOUD_NAME } from "../constant.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filepath) => {
  try {
    if (!filepath) {
      return null;
    }
    //upload file
    const response = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });
    console.log("File Uploaded on Cloudinary : ", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(filepath); //remove the locally saved temporary file as upload is failed
    return null;
  }
};

export {uploadOnCloudinary};
