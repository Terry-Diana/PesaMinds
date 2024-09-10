const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.handler = async function(event, context) {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;  // Replace with actual channel ID
  const apiKey = process.env.YOUTUBE_API_KEY;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=3`
    );
    const videos = response.data.items.map(video => ({
      title: video.snippet.title,
      videoId: video.id.videoId,
      thumbnail: video.snippet.thumbnails.medium.url
    }));

    // Save fetched videos to Supabase
    const { data, error } = await supabase
      .from('videos')
      .insert(videos);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Videos fetched and saved successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
