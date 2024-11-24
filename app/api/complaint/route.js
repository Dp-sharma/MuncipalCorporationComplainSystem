import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Complaint from "@/app/models/complaint";

// Get all complaints
export async function GET() {
  try {
    await dbConnect();
    const complaints = await Complaint.find();
    return NextResponse.json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return NextResponse.json({ error: "Failed to fetch complaints." }, { status: 500 });
  }
}

// Add a new complaint
export async function POST(request) {
  try {
    const { issueType, description, status } = await request.json();

    if (!issueType || !description) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    await dbConnect();

    const newComplaint = await Complaint.create({
      issueType,
      description,
      status,
    });

    return NextResponse.json(newComplaint, { status: 201 });
  } catch (error) {
    console.error("Error adding complaint:", error);
    return NextResponse.json({ error: "Failed to add complaint." }, { status: 500 });
  }
}
