"use server";

import { redirect } from "next/navigation";
import { connectToDatabase } from "../database/mongoose";
import { revalidatePath } from "next/cache";
import { handleError } from "../utils";
import User from "../models/user.model";
import Image from "../models/image.model";
import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary config once at module level (runs only once)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const populateUser = (query: any) => {
  return query.populate({
    path: "author",
    model: User,
    select: "_id firstName lastName clerkId",
  });
};

// ADD IMAGE
export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    await connectToDatabase();

    // Check if user exists (don't use lean() here as we need to verify the document)
    const author = await User.findById(userId);
    if (!author) {
      throw new Error("User not found");
    }
    
    const newImage = await Image.create({
      ...image,
      author: userId,
    });

    revalidatePath(path);

    // Convert Mongoose document to plain object
    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    console.error("error in image actions occured", error);
    handleError(error);
  }
}
// UPDATE IMAGE
export async function updateImage({ image, userId, path }: UpdateImageParams) {
  try {
    await connectToDatabase();

    const imageToUpdate = await Image.findById(image._id);
    if (!imageToUpdate || imageToUpdate.author.toHexString() !== userId) {
      throw new Error("Image not found or user not authorized");
    }
    const updatedImage = await Image.findByIdAndUpdate(
      imageToUpdate._id,
      image,
      {
        new: true,
      }
    );
    if (!updatedImage) {
      throw new Error("Image not found");
    }

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedImage));
  } catch (error) {
    console.error("error in image actions occured", error);
    handleError(error);
  }
}
// DELETE IMAGE
export async function deleteImage(imageId: string) {
  try {
    await connectToDatabase();
    await Image.findByIdAndDelete(imageId);
  } catch (error) {
    console.error("error in image actions occured", error);
    handleError(error);
  } finally {
    redirect("/");
  }
}
// GET IMAGE BY ID
export async function getImageById(imageId: string) {
  try {
    await connectToDatabase();

    const image = await populateUser(Image.findById(imageId)).lean();
    if (!image) {
      throw new Error("Image not found");
    }

    return image;
  } catch (error) {
    console.error("error in image actions occured", error);
    handleError(error);
  }
}
// GET ALL IMAGES
export async function getAllImages({
  limit = 9,
  page = 1,
  searchQuery = "",
}: {
  limit?: number;
  page: number;
  searchQuery?: string;
}) {
  try {
    await connectToDatabase();

    let query = {};

    // Search in MongoDB using regex for flexible matching (no index required)
    if (searchQuery && searchQuery.trim()) {
      // Use regex to search across multiple fields
      // Case-insensitive search on title, prompt, and transformationType
      query = {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } }, // Case-insensitive title search
          { prompt: { $regex: searchQuery, $options: "i" } }, // Case-insensitive prompt search
          { transformationType: { $regex: searchQuery, $options: "i" } }, // Case-insensitive type search
        ],
      };
    }

    const skipAmount = (Number(page) - 1) * limit;

    // Use lean() for better performance - returns plain JavaScript objects
    const images = await populateUser(Image.find(query))
      .sort({
        createdAt: -1,
      })
      .skip(skipAmount)
      .limit(limit)
      .lean();

    // Execute countDocuments only once (was duplicated before)
    const totalImages = await Image.countDocuments(query);

    return {
      data: images || [],
      totalPage: Math.ceil(totalImages / limit),
      savedImages: totalImages,
    };
  } catch (error) {
    console.error("error in image actions occured", error);
    handleError(error);
  }
}

// GET IMAGES BY USER
export async function getUserImages({
  limit = 9,
  page = 1,
  userId,
}: {
  limit?: number;
  page: number;
  userId: string;
}) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;

    // Use lean() for better performance
    const images = await populateUser(Image.find({ author: userId }))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit)
      .lean();

    const totalImages = await Image.countDocuments({ author: userId });

    return {
      data: images || [],
      totalPages: Math.ceil(totalImages / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
