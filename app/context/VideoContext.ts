import { createContext } from "react";

export type VideoContextProperties = {
  videoIndex: number;
  setVideoIndex: React.Dispatch<React.SetStateAction<number>>;
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
};

export const VideoContext = createContext<VideoContextProperties>({
  videoIndex: 0,
  setVideoIndex: () => {},
  pageIndex: 1,
  setPageIndex: () => {},
});
