"use server";

import { redirect } from "next/navigation";
import { connectToDatabase } from "../database/mongoose";
import { revalidatePath } from "next/cache";
import { handleError } from "../utils";
import User from "../models/user.model";
import Image from "../models/image.model";

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
