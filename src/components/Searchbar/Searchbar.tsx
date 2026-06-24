import { useState, useEffect, useRef } from "react";
import styles from "./SearchBar.module.scss";

export const SearchBar = ({ onSearch, resultCount }: { onSearch: (query: string) => void, resultCount: number }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const isFirstRender = useRef(true);

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
      <div className={styles.inputContainer} style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search for a smartphone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Buscar"
        />
        {searchTerm && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => setSearchTerm("")}
            aria-label="Clear search" 
          >
            &times;
          </button>
        )}
      </div>
      <span className={styles.searchDivider}></span>
      <p className={styles.results}>{resultCount} RESULTS</p>
    </div>
  );
};