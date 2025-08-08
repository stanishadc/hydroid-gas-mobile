import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../Common/Configurations/APIConfig";

const NewsMarquee = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const GetNews = () => {
      const headerconfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };

      axios
        .get(
          `${config.APIACTIVATEURL}${config.GETNEWS}`,
          headerconfig
        )
        .then((response) => {
          if (response.data.statusCode === 200) {
            setNews(response.data.data.data);
          } else {
            setNews([]); // Set empty array if no data
          }
        })
        .catch((err) => {
          setError(err.message);
        });
    };

    GetNews();
  }, []);

  // Don't render anything if there's no news or an error
  if (error || news.length === 0) {
    return null;
  }

  return (
    <div className="alert mb-0 bg-danger text-white border-0">
      <marquee>
        <span className="fs-6 fw-medium">
          {news.map((item, index) => (
            <span key={item.newsId || index}>
              {item.message || "News item"}
              {index < news.length - 1 ? (
                <span className="text-warning"> • </span>
              ) : (
                ""
              )}
            </span>
          ))}
        </span>
      </marquee>
    </div>
  );
};

export default NewsMarquee;
