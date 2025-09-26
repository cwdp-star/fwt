import { useState, useMemo } from 'react';

interface SearchFilters {
  query: string;
  category: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  sortBy: 'name' | 'date' | 'size' | 'relevance';
  sortOrder: 'asc' | 'desc';
}

interface SearchableItem {
  id: string;
  title?: string;
  original_name?: string;
  description?: string;
  category?: string;
  created_at: string;
  file_size?: number;
  tags?: string[];
  [key: string]: any;
}

export const useAdvancedSearch = <T extends SearchableItem>(items: T[]) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    dateFrom: null,
    dateTo: null,
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(item => {
        const searchableFields = [
          item.title,
          item.original_name,
          item.description,
          ...(item.tags || [])
        ].filter(Boolean);

        return searchableFields.some(field => 
          field?.toLowerCase().includes(query)
        );
      });
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(item => 
        item.category === filters.category
      );
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(item => 
        new Date(item.created_at) >= filters.dateFrom!
      );
    }

    if (filters.dateTo) {
      const endDate = new Date(filters.dateTo);
      endDate.setHours(23, 59, 59, 999); // Include the entire day
      filtered = filtered.filter(item => 
        new Date(item.created_at) <= endDate
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'name':
          const nameA = (a.title || a.original_name || '').toLowerCase();
          const nameB = (b.title || b.original_name || '').toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        
        case 'size':
          if (a.file_size && b.file_size) {
            comparison = a.file_size - b.file_size;
          }
          break;
        
        case 'relevance':
          // Basic relevance scoring based on query match
          if (filters.query) {
            const query = filters.query.toLowerCase();
            const scoreA = getRelevanceScore(a, query);
            const scoreB = getRelevanceScore(b, query);
            comparison = scoreB - scoreA; // Higher score first
          } else {
            // Fallback to date if no query
            comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [items, filters]);

  const getRelevanceScore = (item: SearchableItem, query: string): number => {
    let score = 0;
    
    // Title match gets highest score
    if (item.title?.toLowerCase().includes(query)) {
      score += 10;
      if (item.title.toLowerCase().startsWith(query)) {
        score += 5; // Bonus for starting with query
      }
    }
    
    // Original name match
    if (item.original_name?.toLowerCase().includes(query)) {
      score += 8;
      if (item.original_name.toLowerCase().startsWith(query)) {
        score += 3;
      }
    }
    
    // Description match
    if (item.description?.toLowerCase().includes(query)) {
      score += 5;
    }
    
    // Tags match
    if (item.tags) {
      const matchingTags = item.tags.filter(tag => 
        tag.toLowerCase().includes(query)
      );
      score += matchingTags.length * 3;
    }
    
    return score;
  };

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      dateFrom: null,
      dateTo: null,
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  const getSearchStats = () => {
    return {
      totalItems: items.length,
      filteredItems: filteredAndSortedItems.length,
      hasActiveFilters: !!(
        filters.query || 
        filters.category !== 'all' || 
        filters.dateFrom || 
        filters.dateTo
      )
    };
  };

  const getAvailableCategories = () => {
    const categories = Array.from(new Set(
      items.map(item => item.category).filter(Boolean)
    ));
    return [
      { value: 'all', label: 'Todas as Categorias' },
      ...categories.map(cat => ({ value: cat, label: cat }))
    ];
  };

  return {
    filters,
    filteredAndSortedItems,
    updateFilters,
    resetFilters,
    getSearchStats,
    getAvailableCategories
  };
};