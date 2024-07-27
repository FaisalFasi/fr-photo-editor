"use server";

import { redirect } from "next/navigation";
import { connectToDatabase } from "../database/mongoose";
import { revalidatePath } from "next/cache";
import { handleError } from "../utils";
import User from "../models/user.model";
import Image from "../models/image.model";
import { v2 as cloudinary } from "cloudinary";

const populateUser = (query: any) => {
  return query.populate({
    path: "author",
    model: User,
    select: "_id firstName lastName",
  });
};

// ADD IMAGE
export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    await connectToDatabase();

    const author = await User.findById(userId);
    if (!author) {
      throw new Error("User not found");
    }
    const newImage = await Image.create({
      ...image,
      author: author._id,
    });

    revalidatePath(path);

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

    const image = await populateUser(Image.findById(imageId));
    if (!image) {
      throw new Error("Image not found");
    }

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    console.error("error in image actions occured", error);
    handleError(error);
  }
}
// GET IMAGES
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

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    let expression = "folder=photoEditor";

    if (searchQuery) {
      expression += ` AND ${searchQuery}`;
    }

    const { resources } = await cloudinary.search
      .expression(expression)
      .execute();

    const resouceIds = resources.map((resource: any) => resource.public_id);

    let query = {};
    if (searchQuery) {
      query = {
        publicId: { $in: resouceIds },
      };
    }

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find(query))
      .sort({
        createdAt: -1,
      })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find(query).countDocuments();

    const savedImages = await Image.find(query).countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPage: Math.ceil(totalImages / limit),
      savedImages,
    };
  } catch (error) {
    console.error("error in image actions occured", error);
    handleError(error);
  }
}
