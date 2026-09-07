import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body || {};

    // Validate required fields
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Full Name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { success: false, message: "Email Address is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string" || !subject.trim()) {
      return NextResponse.json(
        { success: false, message: "Subject / Category is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, message: "Message / Details cannot be empty." },
        { status: 400 }
      );
    }

    // Backend transmission logic placeholder (e.g. email provider, DB, webhook)
    console.log("Contact Inquiry Received:", {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been transmitted successfully. We will get back to you shortly.",
      data: {
        submittedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("API /api/contact Error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
