export interface Amenity {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AmenityFilters {
  search?: string;
  activeOnly?: boolean;
}

export interface AmenityPaginationParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: AmenityFilters;
}

export interface AmenityListResponse {
  content: Amenity[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface CreateAmenityRequest {
  name: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}

export interface UpdateAmenityRequest {
  name?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}