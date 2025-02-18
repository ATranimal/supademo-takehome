import { useContext, useMemo, useState } from "react";
import { VideoContext } from "../context/VideoContext";
import { data } from "../util/data";

export default function Sidebar() {
  const { pageIndex, setPageIndex } = useContext(VideoContext);
  const [searchInput, setSearchInput] = useState("");

  const paginatedData = useMemo(() => {
    if (searchInput !== "") {
      return data
        .filter(
          (item) =>
            item.snippet.title
              .toLowerCase()
              .includes(searchInput.toLowerCase()) ||
            item.snippet.description
              .toLowerCase()
              .includes(searchInput.toLowerCase())
        )
        .slice(0, 10);
    } else {
    }
    const startIndex = (pageIndex - 1) * 10;
    const endIndex = Math.min(data.length, startIndex + 10);

    return data.slice(startIndex, endIndex);
  }, [pageIndex, searchInput]);

  return (
    <div className="w-full md:w-1/3 border-2 h-full p-8 overflow-x-scroll">
      <div className="center flex flex-col gap-2 items-center border-2">
        <input
          className="border-2 p-2 w-full"
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search..."
        ></input>
        <div className="flex gap-2 items-center">
          <button
            className="border-2 p-2"
            onClick={() => {
              setPageIndex(pageIndex - 1);
            }}
            disabled={pageIndex === 1}
          >
            last page
          </button>
          <p>{`${pageIndex} / ${data.length / 10}`}</p>
          <button
            className="border-2 p-2"
            onClick={() => {
              setPageIndex(pageIndex + 1);
            }}
            disabled={pageIndex === Math.floor(data.length / 10)}
          >
            next page
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {paginatedData.map((item) => (
            <SidebarItem key={item.id.videoId} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ item }) {
  const { videoIndex, setVideoIndex } = useContext(VideoContext);

  const isSelected = useMemo(() => {
    return item.id.videoId === data[videoIndex].id.videoId;
  }, [videoIndex]);

  return (
    <button
      className={`border-2 p-2 ${isSelected ? "bg-gray-200" : ""}`}
      onClick={() => {
        setVideoIndex(
          data.findIndex((video) => video.id.videoId === item.id.videoId)
        );
      }}
    >
      <h3 className="font-bold text-lg">{item.snippet.title}</h3>
      <p>{item.snippet.description}</p>
    </button>
  );
}
