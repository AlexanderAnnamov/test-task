export interface User {
    name: string;
    id: number;
    age: number;
  }

export interface Query {
    name: string;
    age: string;
    limit: number;
    offset: number;
  }

export interface PaginationData {
    offset: number;
    limit: number;
}

export interface FilterData {
    name: string;
    age: string;
}
