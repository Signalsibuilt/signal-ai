export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/google/flan-t5-large",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `Create a short, exciting promotion: ${prompt}`,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (Array.isArray(data) && data[0]?.generated_text) {
          return Response.json({ result: data[0].generated_text });
        }
      }
    } catch {}

    // 🔥 FALLBACK (always works)
    const fallback = `🔥 Don’t miss out! ${prompt.toUpperCase()} — Limited time offer! Visit us today and experience something amazing!`;

    return Response.json({ result: fallback });

  } catch (error: any) {
    return Response.json({
      result: "Something went wrong, try again",
    });
  }
}
