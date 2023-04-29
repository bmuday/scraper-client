"use client";

import { useState, useEffect } from "react";
import fetcher from "../utils/fetcher";
import Loading from "./components/Loading";
import Channel from "./components/Channel";
import scrapedChannels from "../data/channels.json";

export default function Channels() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const getChannels = async () => {
      const data = await fetcher("/api/getChannels");
      setChannels(data);
    };

    if (!scrapedChannels) getChannels();
  }, []);

  return (
    <div className="p-10">
      {!scrapedChannels && channels.length == 0 && <Loading />}
      {(scrapedChannels || channels)?.map((channel, index) => (
        <Channel key={index} channel={channel} />
      ))}
    </div>
  );
}
