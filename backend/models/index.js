import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true, // Project title must be unique
    },
    description: String,
    task: [
      {
        id: Number,
        title: String,
        description: String,
        priority: {
          type: String,
          enum: ["Low", "Medium", "High"], // Allowed priority values
          required: true,
        },
        order: Number,
        stage: String,
        index: Number,
        attachment: [{ type: String, url: String }],
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
