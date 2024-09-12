import React from "react";
import VideoComponent from "../../Components/Videos/Videos";
import ArticlesData from "../../Components/Articles/ArticleData";
import "./Blogs.css";

const Blogs: React.FC = () => {
  return (
    <div className="blog-page">
      <div className="articles-section">
        <h2>Articles</h2>
        <ArticlesData />
      </div>

      <div className="videos-section">
        <h2>Videos</h2>
        <VideoComponent />
      </div>
    </div>
  );
};

export default Blogs;
