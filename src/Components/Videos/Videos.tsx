import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { fetchYouTubeVideos } from "../../Services/youtubeService";
import { Video } from "../../Types/types";

const VideoComponent: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVideos = async () => {
      const channelId = process.env.REACT_APP_YOUTUBE_CHANNEL_ID || "";
      const latestVideos = await fetchYouTubeVideos(channelId);
      setVideos(latestVideos);
      setLoading(false);
    };

    loadVideos();

    if (videoRef.current) {
      const animation = gsap.fromTo(
        videoRef.current,
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0, duration: 1, stagger: 0.2 }
      );
      console.log(animation);
    }
  }, []);

  return (
    <div ref={videoRef} className="videos-container">
      {loading ? (
        <p>Loading videos...</p>
      ) : videos.length === 0 ? (
        <p>No videos available.</p>
      ) : (
        <ul className="videos-grid">
          {videos.map((video) => (
            <li key={video.videoId} className="video-item">
              <a
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={video.thumbnail} alt={video.title} />
                <h3>{video.title}</h3>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VideoComponent;
