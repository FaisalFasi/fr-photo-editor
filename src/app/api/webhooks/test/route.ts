import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "The POST route is working" });

  //   return Response.json({ message: "The route is working" });
}
export async function GET() {
  return NextResponse.json({ message: "The GET route is working" });

  //   return Response.json({ message: "The route is working" });
}
