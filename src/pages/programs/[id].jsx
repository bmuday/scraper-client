"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Program from "../components/Program";
import Loading from "../components/Loading";
import fetcher from "../../utils/fetcher";

export default function programsByChannel() {
  const router = useRouter();
  const { id } = router.query;
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProgramsByChannel = async () => {
      const { programs, error } = await fetcher(
        // `/api/getProgramsByChannel/${id}`
        "/api/scrapePrograms"
      );

      if (programs) setPrograms(programs);
      if (error) setError(error);
    };

    if (id) getProgramsByChannel();
  }, [id]);

  return (
    <div>
      {programs.length == 0 && <Loading />}
      {programs?.map((program, index) => (
        <Program key={index} program={program} />
      ))}
    </div>
  );
}
