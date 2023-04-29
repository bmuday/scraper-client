import programs from "../../../data/programs.json";

export default function handler(req, res) {
  try {
    const { id } = req.query;

    if (req.method != "GET") {
      res.status(405).json({ error: "Method not Allowed" });
      return;
    }

    if (!id || !programs || programs.length == 0) {
      res.status(404).json({ error: "No programs found" });
      return;
    }

    programs.map((program) => {
      console.log("program", Object.keys(program)[0], id);
    });

    // const programsByChannel = programs.filter(
    //   (program) => Object.keys(program)[0] === id
    // )[0][id];
    const programsByChannel = [];

    res.status(200).json({ programs: programsByChannel });
  } catch (error) {
    res.status(405).json({ error });
  }
}
