"use client";

import { useState } from "react";
import { VideoContext } from "./context/VideoContext";
import VideoPlayer from "./components/VideoPlayer";
import Sidebar from "./components/Sidebar";

export default function Home() {
  const [videoIndex, setVideoIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);

  return (
    <main className="flex flex-col-reverse md:flex-row flex w-full h-full">
      <VideoContext.Provider
        value={{ videoIndex, setVideoIndex, pageIndex, setPageIndex }}
      >
        <Sidebar />
        <VideoPlayer />
      </VideoContext.Provider>
    </main>
  );
}
