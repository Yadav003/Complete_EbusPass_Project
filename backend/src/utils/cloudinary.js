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

    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error("Cloudinary credentials are missing");
    }

    const response = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });
    console.log("File Uploaded on Cloudinary : ", response.url);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    return response;
  } catch (error) {
    if (filepath && fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    console.error("Cloudinary upload failed:", error.message || error);
    throw error;
  }
};

export {uploadOnCloudinary};
