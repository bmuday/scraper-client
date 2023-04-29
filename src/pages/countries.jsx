"use client";
import { useState, useEffect } from "react";
import fetcher from "@/utils/fetcher";
import Image from "next/image";
import scrapedCountries from "../data/countries.json";
import Loading from "./components/Loading";

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const size = 64; // flag image size

  useEffect(() => {
    const getCountries = async () => {
      const { countries, error } = await fetcher("/api/getCountries");

      if (countries) setCountries(countries);
      if (error) setError(error);
    };

    if (!scrapedCountries) getCountries();
  }, []);

  return (
    <div>
      <h1>Countries</h1>
      <ul>
        {!scrapedCountries && countries.length == 0 && <Loading />}
        {(scrapedCountries || countries)?.map((country, index) => {
          const { name, flag_link } = country;
          return (
            <li key={index}>
              <Image
                src={`${flag_link}/${size}.png`}
                alt={`${name} flag`}
                width={size}
                height={size}
              />
              {name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
