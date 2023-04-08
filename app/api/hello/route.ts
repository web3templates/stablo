import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const json = {
    message: "Hello World"
  };

  return NextResponse.json(json);
}
