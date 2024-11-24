import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
  issueType: {
    type: String,
    required: true,
    enum: ["pothole", "waste management", "streetlight issue", "water supply", "other"],
  },
  description: {
    type: String,
    required: true,
  },
  reportedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending",
  },
});

export default mongoose.models.Complaint || mongoose.model("Complaint", ComplaintSchema);
