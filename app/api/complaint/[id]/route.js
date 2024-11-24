import { NextResponse } from "next/server";

import dbConnect from "@/app/lib/mongodb";

import Complaint from "@/app/models/complaint";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();

    if (!["Pending", "In Progress", "Resolved"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    await dbConnect();

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedComplaint) {
      return NextResponse.json({ error: "Complaint not found." }, { status: 404 });
    }

    return NextResponse.json(updatedComplaint);
  } catch (error) {
    console.error("Error updating complaint status:", error);
    return NextResponse.json({ error: "Failed to update complaint." }, { status: 500 });
  }
}
