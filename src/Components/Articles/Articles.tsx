import React from "react";

// Define the type for article props
type Article = {
  id: number;
  title: string;
  summary: string;
  link: string;
};

type ArticleComponentProps = {
  articles: Article[];
};

const ArticleComponent: React.FC<ArticleComponentProps> = ({ articles }) => {
  return (
    <div className="articles-container">
      <h2>Latest Articles</h2>
      {articles.length > 0 ? (
        <ul>
          {articles.map((article) => (
            <li key={article.id} className="article-item">
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
