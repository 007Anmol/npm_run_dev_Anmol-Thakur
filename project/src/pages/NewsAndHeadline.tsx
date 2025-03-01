import { useEffect, useState } from "react";
import axios from "axios";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
}

const NewsAndHeadline = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `http://api.mediastack.com/v1/news?access_key=2b670055b44186635df7b924d5dfc094&countries=in&categories=general&keywords=legal,law,court`
        );
        const data = await response.json();
        setNews(data.data);
      } catch (error) {
        console.error("Failed to fetch news", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Indian Legal News</h1>
      {news.map((article, index) => (
        <div key={index} className="border-b mb-4 pb-4">
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-60 object-cover mb-2"
            />
          )}
          <h2 className="text-lg font-semibold">{article.title}</h2>
          <p>{article.description}</p>
          <a href={article.url} target="_blank" className="text-blue-500">
            Read More
          </a>
        </div>
      ))}
    </div>
  );
};

export default NewsAndHeadline;
