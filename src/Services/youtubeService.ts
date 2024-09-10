import axios from "axios";

export const fetchYouTubeVideos = async (channelId: string) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.REACT_APP_YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet&order=date&maxResults=3`
    );

    return response.data.items.map((video: any) => ({
      title: video.snippet.title,
      videoId: video.id.videoId,
      thumbnail: video.snippet.thumbnails.medium.url,
    }));
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
};
