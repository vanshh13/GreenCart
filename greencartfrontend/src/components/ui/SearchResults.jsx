import React from "react";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const query = new URLSearchParams(useLocation().search).get("query");

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Search Results for "{query}"</h1>
      {/* Fetch and display results based on query */}
    </div>
  );
};

export default SearchResults;
