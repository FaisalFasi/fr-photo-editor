import { Document, Schema, model, models } from "mongoose";

export interface IImage extends Document {
  title: string;
  transformationType: string;
  publicId: string;
  secureURL: string;
  width?: number;
  height?: number;
  config?: object;
  transformationUrl?: string;
  aspectRatio?: string;
  color?: string;
  prompt?: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const ImageSchema = new Schema({
  title: { type: String, required: true },
  transformationType: { type: String, required: true },
  publicId: { type: String, required: true },
  secureURL: { type: String, required: true },
  width: { type: Number },
  height: { type: Number },
  config: { type: Object },
  transformationUrl: { type: String },
  aspectRatio: { type: String },
  color: { type: String },
  prompt: { type: String },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Add indexes for improved query performance
ImageSchema.index({ createdAt: -1 }); // For sorting by creation date
ImageSchema.index({ author: 1 }); // For filtering by author
ImageSchema.index({ publicId: 1 }); // For searching by publicId
ImageSchema.index({ publicId: 1, author: 1 }); // Compound index for common query patterns
// Note: Search uses regex (no index required) - searches title, prompt, and transformationType
// Text index can be added later if needed for better search performance on large datasets

const Image = models?.Image || model("Image", ImageSchema);

export default Image;
