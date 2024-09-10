import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { fetchYouTubeVideos } from "../../Services/youtubeService";

// Define the Video type
type Video = {
  thumbnail: string;
  title: string;
  videoUrl: string; // any other fields you need
};

const VideoComponent: React.FC = () => {
  const [videos, setVideos] = React.useState<Video[]>([]); // Use Video type for state
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVideos = async () => {
      const latestVideos = await fetchYouTubeVideos("process.env.YOUTUBE_CHANNEL_ID"); // Add correct channel ID
      setVideos(latestVideos);
    };

    loadVideos();

    // GSAP animation
    gsap.from(videoRef.current, { opacity: 0, x: 100, duration: 1, stagger: 0.2 });
  }, []);

  return (
    <div ref={videoRef} className="video-component">
      {videos.map((video, index) => (
        <div key={index} className="video-item">
          <img src={video.thumbnail} alt={video.title} />
          <h3>{video.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default VideoComponent;
