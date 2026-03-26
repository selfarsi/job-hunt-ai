import { NextRequest, NextResponse } from "next/server";

const RAPIDAPI_KEY = "40cce788ebmsh19ee0197d083132p1ab2f6jsne4e46b60f175";
const RAPIDAPI_HOST = "jsearch.p.rapidapi.com";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const page = searchParams.get("page") || "1";
  const numPages = searchParams.get("numPages") || "10";

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const url = `https://${RAPIDAPI_HOST}/search?query=${encodeURIComponent(query)}&page=${page}&num_pages=${numPages}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("JSearch API error:", response.status, errorText);
      return NextResponse.json(
        { error: "API request failed", status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("JSearch fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from JSearch API" },
      { status: 500 }
    );
  }
}
