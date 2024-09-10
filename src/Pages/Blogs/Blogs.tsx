import React from "react";
import VideoComponent from "../../Components/Videos/Videos";
import "./Blogs.css";

const Blogs: React.FC = () => {
  return (
    <div className="blog-page">
      <div className="articles-section">
        <h2>Articles</h2>
        <div className="grid-container">
          <div className="grid-item">Article 1</div>
          <div className="grid-item">Article 2</div>
          <div className="grid-item">Article 3</div>
          {/* More articles */}
        </div>
      </div>

      <div className="videos-section">
        <h2>Videos</h2>
        <VideoComponent />
      </div>
    </div>
  );
};

export default Blogs;
