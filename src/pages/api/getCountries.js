import countries from "../../data/countries.json";

export default async function handler(req, res) {
  try {
    if (req.method != "GET") {
      res.status(405).json({ error: "Method not Allowed" });
      return;
    }

    res.status(200).json({ countries });
  } catch (error) {
    res.status(405).json({ error });
  }
}
