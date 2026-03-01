import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    // 1. Get Bot
    const { data: bot, error: botError } = await supabase
      .from('Profiles') // Double check if this should be 'profiles'
      .select('id, username')
      .eq('is_bot', true)
      .limit(1)
      .maybeSingle()

    if (botError || !bot) {
      return new Response(JSON.stringify({ error: "No bot users found." }), { status: 404 });
    }

    // 1b. Fetch the titles of the last 10 quotes FROM BOT USERS ONLY
    const { data: recentQuotes, error: fetchError } = await supabase
      .from('Quotes')
      .select(`
        quote,
        Profiles!inner(id, is_bot),
        Books(title)
      `)
      .eq('Profiles.is_bot', true) // Filter at the profile level
      .order('created_at', { ascending: false })
      .limit(10);

    if (fetchError) {
      console.error("Error fetching bot memory:", fetchError.message);
    }

    // Map the titles into a string Gemini can understand
    const blacklist = recentQuotes
      ?.map(q => `"${q.Books?.title || 'Unknown'}"`)
      .filter((title, index, self) => self.indexOf(title) === index) // Unique titles only
      .join(', ') || "None yet";

    // 2. AI Generation
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const MODEL_NAME = 'gemini-2.5-flash';

    const prompt = `
      You are an expert literary bot. Your task is to provide a real quote from a book by a black author.

      CONTEXT (Do not repeat these recently posted books):
      ${blacklist}

      INSTRUCTIONS:
      1. Pick a book NOT in the list above.
      2. Provide the quote and a brief note of insight.
      3. Return ONLY valid JSON: {"title": "...", "author": "...", "quote": "...", "note": "..."}
    `;

    // const prompt = `Share a real and random quote from a book. Provide a small note on its meaning. Be as random as possible. Return ONLY JSON: {"title": "...", "author": "...", "quote": "...", "note": "..."}`;

    const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    const aiData = await aiRes.json();
    if (aiData.error) throw new Error(`Gemini Error: ${aiData.error.message}`);

    const aiContent = JSON.parse(aiData.candidates[0].content.parts[0].text);

    // 3. Google Books Verification
    const BOOKS_API_KEY = Deno.env.get('BOOKS_API_KEY');
    const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(aiContent.title)}+inauthor:${encodeURIComponent(aiContent.author)}&key=${BOOKS_API_KEY}`;

    const bookRes = await fetch(searchUrl);
    const bookData = await bookRes.json();

    // Extract ID safely
    const googleBookId = bookData.items?.[0]?.id;

    if (!googleBookId) {
      // Logic: If Google Books fails, we don't want to crash. We fallback to a custom identifier.
      console.warn(`Could not verify ${aiContent.title} on Google Books.`);
      throw new Error(`Verification failed for: ${aiContent.title}. Data: ${JSON.stringify(bookData)}`);
    }

    // 4. Find or Create Book
    let bookDbId;
    const { data: existingBook } = await supabase
      .from('Books')
      .select('id')
      .eq('identifier', googleBookId)
      .maybeSingle();

    if (!existingBook) {
      const { data: newBook, error: createError } = await supabase
        .from('Books')
        .insert({
          title: aiContent.title,
          identifier: googleBookId,
          authors: [aiContent.author] // Ensure your DB column is type text[]
        })
        .select('id')
        .single();

      if (createError) throw createError;
      bookDbId = newBook.id;
    } else {
      bookDbId = existingBook.id;
    }

    // 5. Insert Quote
    const { error: quoteError } = await supabase.from('Quotes').insert({
      user_id: bot.id,
      book_id: bookDbId,
      quote: aiContent.quote,
      note: aiContent.note,
      likes: [],
      requotes: []
    });

    if (quoteError) throw quoteError;

    return new Response(JSON.stringify({ success: true, book: aiContent.title }), { status: 200 });

  } catch (err) {
    console.error("Function Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
})
