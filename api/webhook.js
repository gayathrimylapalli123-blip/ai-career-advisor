export default async function handler(req, res) {
  try {
    const response = await fetch("https://gayathri-mylapalli00.app.n8n.cloud/webhook/0b1bc108-5556-4188-bcae-6d7cd78be793", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "Proxy error" });
  }
}