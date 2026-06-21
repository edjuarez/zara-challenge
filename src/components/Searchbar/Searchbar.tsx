import { useState, useEffect, useRef } from "react";
import styles from "./SearchBar.module.scss";

export const SearchBar = ({ onSearch, resultCount }: { onSearch: (query: string) => void, resultCount: number }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const isFirstRender = useRef(true); //avoid initial search on first render

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search for a smartphone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <span className={styles.searchDivider}></span>
      <p className={styles.results}>{resultCount} RESULTS</p>
    </div>
  );
};