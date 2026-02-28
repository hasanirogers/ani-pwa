import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  // Initialize Supabase Admin Client
  const supabase = createClient(
    `https://${Deno.env.get('SUPABASE_PROJECT_ID')!}.supabase.co`!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Randomly select a profile marked as 'is_bot'
  const { data: bot } = await supabase
    .from('Profiles')
    .select('id, username')
    .eq('is_bot', true)
    .limit(1)
    .single()

  if (!bot) return new Response("No bot users found", { status: 404 });

  // Get a quote via GEMINI API
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
  const prompt = `Share a real quote from a book with a black author with a small note on what the quote means. Return JSON: {"title": "...", "author": "...", "quote": "...", "note": "...", "google_book_id": "..."}`

  const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: "application/json" }
    })
  });

  const { candidates } = await aiResponse.json();
  const aiContent = JSON.parse(candidates[0].content.parts[0].text);

  // Start constructing the quote to insert
  const newQuote = {
    user_id: bot.id,
    quote: aiContent.quote,
    note: aiContent.note,
  };

  const bookCheckResponse = await fetch(`/api/books/${aiContent.google_book_id}`);

  if (bookCheckResponse.status === 202) {
    // create it
    const createBookResponse = await fetch(`/api/books/create`, {
      method: 'POST',
      body: JSON.stringify({
        title: aiContent.title,
        identifier: aiContent.google_book_id,
        authors: [...aiContent.author]
      })
    });
    const createBookData = await createBookResponse.json();
    // construct data based on newly inserted book
    newQuote = { ...newQuote, book_id: createBookData.identifier };
  } else {
    const { book_id } = await bookCheckResponse.json();
    newQuote = { ...newQuote, book_id };
  }

  // Insert the quote
  const { error } = await supabase.from('Quotes').insert(newQuote);

  return new Response(error ? "Error" : "Success", { status: error ? 500 : 200 });
})
