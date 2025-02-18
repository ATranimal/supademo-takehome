import { useContext, useEffect, useState } from "react";
import { VideoContext } from "../context/VideoContext";
import { data } from "../util/data";

export default function VideoPlayer() {
  const { videoIndex } = useContext(VideoContext);
  const [player, setPlayer] = useState(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(100);
  const [dragging, setDragging] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [apiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    if (!apiLoaded) {
      // Load the YouTube IFrame Player API script
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // Create a player instance when the API is ready
      window.onYouTubeIframeAPIReady = () => {
        if (!apiLoaded) {
          setApiLoaded(true);
        }
        handleNewPlayer();
      };
    } else {
      if (player) {
        player.destroy();
      }

      handleNewPlayer();
    }
  }, [videoIndex]);

  const handleNewPlayer = () => {
    const savedStart = localStorage.getItem(`${videoIndex} start`)
      ? parseInt(localStorage.getItem(`${videoIndex} start`))
      : 0;
    const savedEnd = localStorage.getItem(`${videoIndex} end`)
      ? parseInt(localStorage.getItem(`${videoIndex} end`))
      : 100;

    setStart(savedStart);
    setEnd(savedEnd);

    const newPlayer = new YT.Player("ytplayer", {
      height: "540",
      width: "960",
      videoId: data[videoIndex].id.videoId,
      events: {
        onReady: (event) => {
          setVideoDuration(event.target.getDuration());
          event.target.cueVideoById({
            videoId: data[videoIndex].id.videoId,
            startSeconds: event.target.getDuration() * (savedStart / 100),
            endSeconds: event.target.getDuration() * (savedEnd / 100),
          });
        },
      },
    });
    setPlayer(newPlayer);
  };

  const handlePlay = () => {
    if (player) {
      player.playVideo();
    }
  };

  const handlePause = () => {
    if (player) {
      player.pauseVideo();
    }
  };

  const handleDragStart = (type) => {
    setDragging(type);
  };

  const handleDrag = (event) => {
    if (dragging) {
      const div = event.currentTarget;
      const dragX = event.clientX - div.getBoundingClientRect().left;
      const width = div.offsetWidth;
      const dragPercent = (dragX / width) * 100;

      if (dragging === "start") {
        setStart(dragPercent);
        localStorage.setItem(`${videoIndex} start`, dragPercent.toString());
      } else if (dragging === "end") {
        setEnd(dragPercent);
        localStorage.setItem(`${videoIndex} end`, dragPercent.toString());
      }
    }
  };

  const handleDragEnd = () => {
    setDragging(null);

    if (player) {
      player.cueVideoById({
        videoId: data[videoIndex].id.videoId,
        startSeconds: videoDuration * (start / 100),
        endSeconds: videoDuration * (end / 100),
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
      <div className="aspect-video w-full p-2 md:p-16">
        <div className="w-full h-full" id="ytplayer"></div>
      </div>
      <div className="flex gap-2 ">
        <button className="border-2 p-1" onClick={handlePlay}>
          Play
        </button>
        <button className="border-2 p-1" onClick={handlePause}>
          Pause
        </button>{" "}
        <div
          className="w-64 bg-gray-200 relative"
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
        >
          <div
            className="absolute bg-blue-500 h-full w-3 cursor-ew-resize"
            style={{ left: `${start}%` }}
            onMouseDown={() => handleDragStart("start")}
          ></div>
          <div
            className="absolute bg-red-500 h-full w-3 cursor-ew-resize"
            style={{ left: `${end}%` }}
            onMouseDown={() => handleDragStart("end")}
          ></div>
        </div>
      </div>
    </div>
  );
}
