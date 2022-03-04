import React, { useEffect, useState, Link } from "react";
import { useParams } from "react-router-dom";
import {
  API_URL,
  API_KEY,
} from "../../Config";
import "./SearchPage.css"

function SearchPage() {
  const queryParams = new URLSearchParams(window.location.search);
  const query = queryParams.get('q');
  const endpoint = `${API_URL}search/movie?api_key=${API_KEY}&query=${query}&page=1`;
  const [results, setResults] = useState(
    {
      results: [],
    }
  );

  useEffect(async () => {
    const search_results = await fetch(endpoint)
      .then(response => response.json())
      .then(response => response);
    console.log(search_results);
    setResults(search_results);
  }, []);

  return (
    <div style={{ width: "100%", margin: "0" }}>
      {
        results.results.map(result => (
          <div className="search_container">
              <a href={"movie/" + result.id}>
                {result.original_title}
              </a>
          </div>

        ))
      }
    </div>
  );
}

export default SearchPage;
