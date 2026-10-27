import { useMemo, useState } from 'react';

export function usePagination(items = [], { pageSize = 10, searchKeys = [] } = {}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim() || searchKeys.length === 0) return items;
    const q = search.toLowerCase();
    return items.filter((item) =>
      searchKeys.some((key) => {
        const val = key.split('.').reduce((obj, k) => obj?.[k], item);
        return String(val ?? '').toLowerCase().includes(q);
      }),
    );
  }, [items, search, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const paginated = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize, totalPages]);

  const goToPage = (p) => setPage(Math.max(1, Math.min(p, totalPages)));

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return {
    page,
    setPage: goToPage,
    search,
    setSearch: handleSearch,
    paginated,
    filtered,
    totalPages,
    totalItems: filtered.length,
  };
}
