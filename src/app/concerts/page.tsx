"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

interface Concert {
  _id: string;
  artist: {
    artist_id: string;
    artist_name: string;
    artist_instagram: string;
    artist_youtube: string;
    artist_facebook: string;
    artist_twitter: string;
    artist_spotify: string;
  },
  concert_date: string;
  concert_description: string;
  concert_image: string;
  concert_name: string;
  concert_start: string;
  genre: {
    genre_id: string;
    genre_name: string;
  };
  venue: {
    venue_id: string;
    venue_name: string;
    venue_address: string;
    venue_location: string;
  };
  concert_doors: string;
}



const ConcertList: React.FC = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/data/concertData");
        setConcerts(response.data.data);
      } catch (error) {
        console.error("Error fetching concerts:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h1 className="font-bold text-4xl pb-4">All concerts</h1>
      <div className="grid xs:grid-cols1 sm:grid-cols-3 md:grid-cols-4 gap-8 mt-8">
        {concerts.map((concert) => (
          <article className="w-auto" key={concert._id}>
            <Link href={"/concerts/" + concert._id} key={concert._id}>
              <Image
                src={"/concert_images/" + concert.concert_image}
                width={200}
                height={200}
                alt="concert"
                className="rounded-lg w-[300px] h-[200px] object-cover"
              />
            </Link>

            <h4 className="text-black text-xl font-bold dark:text-white">
                {/* ------- Why does this NOT work???? */}
                {/* {concert.concert_name} */}
                {/* But this does? Why? */}
                {/* {concert?.concert_name} */}
                {concert.artist ? concert.artist.artist_name : "Unknown Artist"} - {concert.concert_name ? concert.concert_name : "Unknown concert_name"}
            </h4>
            <div className="flex flex-col gap-2">
                <p className="text-gray-600 text-sm dark:text-gray-400">
                    {/* ------- Whu does this NOT work???? */}
                    {/* {concert.artist.artist_name} */}

                    {/* ------- Why does this work???? */}
                    {/* {concert.artist?.artist_name} */}
                    {/* {concert.artist ? concert.artist.artist_name : "Unknown Artist"} */}
                </p>

                {/* <p className="text-gray-600 text-sm dark:text-gray-400">
                    {concert?.concert_date}
                </p> */}

                <p className="text-gray-600 text-sm dark:text-gray-400">
                    <span className="font-bold">{concert.venue?.venue_name}, </span>{concert.venue?.venue_location}
                </p>
            </div>

          </article>
        ))}
      </div>
    </>
  );
};

export default ConcertList;
