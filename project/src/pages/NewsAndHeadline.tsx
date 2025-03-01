import { useEffect, useState } from "react";
import axios from "axios";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
}

const TranslateText = async (text: string, lang: string) => {
  try {
    const response = await axios.post("https://libretranslate.com/translate", {
      q: text,
      source: "en",
      target: lang,
      format: "text",
    });
    return response.data.translatedText;
  } catch (error) {
    console.error("Translation failed", error);
    return text;
  }
};

const NewsAndHeadline = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [language, setLanguage] = useState<string>("en");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://api.mediastack.com/v1/news?access_key=11cc967e56eae480aa5bf0392a869a0a&countries=in&categories=general&keywords=legal,law,court`
        );

        const data = await response.json();
        setNews(data.data);
      } catch (error) {
        console.error("Failed to fetch news", error);
      }
    };

    fetchNews();
  }, []);

  const translateArticles = async (lang: string) => {
    const translatedNews = await Promise.all(
      news.map(async (article) => {
        const translatedTitle = await TranslateText(article.title, lang);
        const translatedDescription = await TranslateText(
          article.description,
          lang
        );
        return {
          ...article,
          title: translatedTitle,
          description: translatedDescription,
        };
      })
    );
    setNews(translatedNews);
  };

  useEffect(() => {
    if (language !== "en") {
      translateArticles(language);
    }
  }, [language]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Indian Legal News</h1>
      <select
        onChange={(e) => setLanguage(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
      </select>
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
