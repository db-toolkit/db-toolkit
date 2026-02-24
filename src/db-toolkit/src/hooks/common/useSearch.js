import { useState, useMemo } from 'react';
import { useDebounce } from '../../utils/debounce';

export function useSearch(items, searchFields, debounceMs = 300) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, debounceMs);

  const filteredItems = useMemo(() => {
    if (!debouncedSearch.trim()) return items;
    
    const query = debouncedSearch.toLowerCase();
    
    return items.filter(item => {
      return searchFields.some(field => {
        const value = typeof field === 'function' ? field(item) : item[field];
        return value?.toString().toLowerCase().includes(query);
      });
    });
  }, [items, debouncedSearch, searchFields]);

  const clearSearch = () => setSearchQuery('');

  return {
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    filteredItems,
    clearSearch,
    hasResults: filteredItems.length > 0,
    isSearching: debouncedSearch.trim().length > 0,
  };
}
