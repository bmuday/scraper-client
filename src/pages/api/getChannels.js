import channels from "../../data/channels.json";

export default async function handler(req, res) {
  try {
    if (req.method != "GET") {
      res.status(405).json({ error: "Method not Allowed" });
      return;
    }

    res.status(200).json(channels);
  } catch (error) {
    console.log(error);
  }
}
