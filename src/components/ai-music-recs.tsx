"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AIMusicRecsProps, Artist } from "@/types"
import { useCompletion } from "ai/react"
import { motion } from "framer-motion"

import gear from "@/lib/images/gear.svg"
import { extractBandsFromResponse } from "@/lib/util/util"

export default function AIMusicRecs({ user }: AIMusicRecsProps) {
  // combine the top artists arrays from different time ranges into a single array
  const allTopArtists = [
    ...user.topArtists.long,
    ...user.topArtists.medium,
    ...user.topArtists.short,
  ]

  const [recs, setRecs] = useState<string[]>([])

  // create a set to store unique artist names
  const uniqueTopArtists = new Set(
    allTopArtists.map((artist: Artist) => artist.name)
  )

  // convert the set of unique artists into a comma-separated string
  const topArtistsString = Array.from(uniqueTopArtists).join(", ")

  const { completion, complete, isLoading } = useCompletion({
    api: "/api/music-recs",
    onFinish: (_prompt, completion) => {
      setRecs(extractBandsFromResponse(completion))
    },
  })

  useEffect(() => {
    const fetchRecommendations = async () => {
      complete(topArtistsString)
    }

    fetchRecommendations()
  }, [])

  useEffect(() => {
    console.log(recs)
  }, [recs])

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col w-full justify-center items-center">
          <motion.div
            animate={{
              x: [-100, -50, 0, 50, 100],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          >
            <Image src={gear} alt="loading" />
          </motion.div>
          <p className="text-center">Generating recommendations...</p>
        </div>
      ) : (
        <p>{completion}</p>
      )}
    </>
  )
}