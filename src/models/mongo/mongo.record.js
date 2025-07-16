import mongoose, { Schema } from "mongoose";

const blobSchema = new mongoose.Schema(
  {
    payload: { type: Schema.Types.Mixed, require: true },
    userId: { type: String, required: true },
  },
  {
    collaction: "blobs",
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const BlobSchema = mongoose.model("BlobSchema", blobSchema);

export default BlobSchema;
