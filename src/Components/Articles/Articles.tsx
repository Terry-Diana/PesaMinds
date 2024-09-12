import React from "react";
import { Article } from "../../Types/types";

type ArticleComponentProps = {
  articles: Article[];
};

const ArticleComponent: React.FC<ArticleComponentProps> = ({ articles }) => {
  return (
    <div className="articles-container">
      {articles.length > 0 ? (
        <ul className="articles-grid">
          {articles.map((article) => (
            <li key={article.id} className="article-item">
              <img
                src={article.image}
                alt={article.title}
                className="article-image"
              />
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No articles available at the moment.</p>
      )}
    </div>
  );
};

export default ArticleComponent;
