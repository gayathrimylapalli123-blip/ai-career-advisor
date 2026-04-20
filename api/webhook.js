export default async function handler(req, res) {
  try {
   const response = await fetch(
  "https://pension-wildly-catsup.ngrok-free.dev/webhook/career-advisor",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body)
      }
    );

    const text = await response.text();

    // 👇 TRY to parse JSON safely
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("NOT JSON RESPONSE:", text);
      return res.status(500).json({
        error: "Invalid JSON from n8n",
        raw: text
      });
    }

    res.status(200).json(data);

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: "Server failed" });
  }
}