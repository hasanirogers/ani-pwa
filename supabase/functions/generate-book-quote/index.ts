import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  // 1. Initialize Supabase with Service Role to bypass RLS
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    // 2. Randomly select a profile marked as 'is_bot'
    const { data: bot, error: botError } = await supabase
      .from('Profiles')
      .select('id, username')
      .eq('is_bot', true)
      .limit(1)
      .maybeSingle()

    if (botError || !bot) {
      return new Response(JSON.stringify({ error: "No bot users found in 'Profiles' table." }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. Get a quote via GEMINI API (JSON Mode)
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const MODEL_NAME = 'gemini-2.5-flash'; // Or 'gemini-flash-latest'
    const prompt = `Share a real and random quote from a random book, with a black author, with a small note on what the quote means. Only share quotes from books with a google book id that is valid. Randomize as much as possible. Return ONLY a JSON object with this exact structure: {"title": "...", "author": "...", "quote": "...", "note": "...", "google_book_id": "..."}`

    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json"
        }
      })
    });

    const aiData = await aiRes.json();

    // Check for the 404 or other API errors
    if (aiData.error) {
      throw new Error(`Gemini API Error (${aiData.error.code}): ${aiData.error.message}`);
    }

    // DEBUG: This will show up in your Supabase Logs
    console.log("Full AI Response:", JSON.stringify(aiData));

    // Check if candidates exists before accessing [0]
    if (!aiData.candidates || aiData.candidates.length === 0) {
      // Check if it was blocked by safety
      const reason = aiData.promptFeedback?.blockReason || "Unknown Refusal";
      return new Response(JSON.stringify({ error: `AI Refusal: ${reason}`, raw: aiData }), { status: 500 });
    }

    // Access safely now
    const aiContent = JSON.parse(aiData.candidates[0].content.parts[0].text);

    // 4. Book Logic: Check if book exists, if not create it
    let bookId;
    const { data: existingBook } = await supabase
      .from('Books')
      .select('id')
      .eq('identifier', aiContent.google_book_id)
      .maybeSingle();

    if (!existingBook) {
      const { data: newBook, error: createError } = await supabase
        .from('Books')
        .insert({
          title: aiContent.title,
          identifier: aiContent.google_book_id,
          authors: [aiContent.author]
        })
        .select('id')
        .single();

      if (createError) throw createError;
      bookId = newBook.id;
    } else {
      bookId = existingBook.id;
    }

    // 5. Final Step: Insert the Quote
    const { error: quoteError } = await supabase.from('Quotes').insert({
      user_id: bot.id,
      book_id: bookId,
      quote: aiContent.quote,
      note: aiContent.note,
      likes: [],
      requotes: []
    });

    if (quoteError) throw quoteError;

    return new Response(JSON.stringify({ message: "Success", book: aiContent.title }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Function Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
})
