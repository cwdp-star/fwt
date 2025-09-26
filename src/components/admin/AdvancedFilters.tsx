import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  Calendar, 
  SortAsc, 
  SortDesc,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdvancedFiltersProps {
  filters: {
    query: string;
    category: string;
    dateFrom: Date | null;
    dateTo: Date | null;
    sortBy: 'name' | 'date' | 'size' | 'relevance';
    sortOrder: 'asc' | 'desc';
  };
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
  categories: Array<{ value: string; label: string }>;
  stats: {
    totalItems: number;
    filteredItems: number;
    hasActiveFilters: boolean;
  };
}

const AdvancedFilters = ({ 
  filters, 
  onFiltersChange, 
  onReset,
  categories,
  stats
}: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleQueryChange = (query: string) => {
    onFiltersChange({ query });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ category });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ sortBy });
  };

  const handleSortOrderToggle = () => {
    onFiltersChange({ 
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
    });
  };

  const handleDateFromChange = (dateFrom: Date | undefined) => {
    onFiltersChange({ dateFrom: dateFrom || null });
  };

  const handleDateToChange = (dateTo: Date | undefined) => {
    onFiltersChange({ dateTo: dateTo || null });
  };

  const activeFiltersCount = [
    filters.query,
    filters.category !== 'all' ? filters.category : null,
    filters.dateFrom,
    filters.dateTo
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Input
            placeholder="Buscar arquivos..."
            value={filters.query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="pr-10"
          />
          {filters.query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQueryChange('')}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {stats.hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onReset}
            className="text-muted-foreground"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Mostrando {stats.filteredItems} de {stats.totalItems} arquivos
        </span>
        
        <div className="flex items-center gap-2">
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Data</SelectItem>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="size">Tamanho</SelectItem>
              <SelectItem value="relevance">Relevância</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSortOrderToggle}
            className="h-8 w-8 p-0"
          >
            {filters.sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtros Avançados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select value={filters.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date From */}
                  <div className="space-y-2">
                    <Label>Data Inicial</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {filters.dateFrom ? (
                            format(filters.dateFrom, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            "Selecionar data"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={filters.dateFrom || undefined}
                          onSelect={handleDateFromChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Date To */}
                  <div className="space-y-2">
                    <Label>Data Final</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {filters.dateTo ? (
                            format(filters.dateTo, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            "Selecionar data"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={filters.dateTo || undefined}
                          onSelect={handleDateToChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Active Filters */}
                {stats.hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <span className="text-sm text-muted-foreground">Filtros ativos:</span>
                    
                    {filters.query && (
                      <Badge variant="secondary" className="gap-1">
                        Busca: {filters.query}
                        <button
                          onClick={() => handleQueryChange('')}
                          className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    
                    {filters.category !== 'all' && (
                      <Badge variant="secondary" className="gap-1">
                        Categoria: {categories.find(c => c.value === filters.category)?.label}
                        <button
                          onClick={() => handleCategoryChange('all')}
                          className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    
                    {filters.dateFrom && (
                      <Badge variant="secondary" className="gap-1">
                        De: {format(filters.dateFrom, "dd/MM/yyyy", { locale: ptBR })}
                        <button
                          onClick={() => handleDateFromChange(undefined)}
                          className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    
                    {filters.dateTo && (
                      <Badge variant="secondary" className="gap-1">
                        Até: {format(filters.dateTo, "dd/MM/yyyy", { locale: ptBR })}
                        <button
                          onClick={() => handleDateToChange(undefined)}
                          className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedFilters;