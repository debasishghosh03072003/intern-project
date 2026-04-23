import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type TaskStatus = "pending" | "in-progress" | "completed";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema<ITask> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title must be at most 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description must be at most 500 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "in-progress", "completed"],
        message: "Status must be pending, in-progress, or completed",
      },
      default: "pending",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying by user + status
TaskSchema.index({ userId: 1, status: 1 });

const Task: Model<ITask> =
  (mongoose.models.Task as Model<ITask>) || mongoose.model<ITask>("Task", TaskSchema);

export default Task;
