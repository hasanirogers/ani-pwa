import type { APIRoute } from "astro";
import 'dotenv/config'

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const identifier = url.searchParams.get('identifier');
    const bookDetails = await fetch(`https://www.googleapis.com/books/v1/volumes/${identifier}?key=${process.env.BOOKS_API_KEY}`).then(response => response.json());

    if (!bookDetails) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to get book details" }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify(bookDetails),
      { status: 200 }
    );
  } catch(error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
