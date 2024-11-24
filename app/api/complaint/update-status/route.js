import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Complaint from "@/app/models/complaint";// Assuming you have a Complaint model

// Connect to the database
dbConnect();

export async function POST(request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { message: "Invalid request. Missing required fields." },
        { status: 400 }
      );
    }

    // Find and update the complaint by ID
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedComplaint) {
      return NextResponse.json(
        { message: "Complaint not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedComplaint, { status: 200 });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
