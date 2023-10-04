import React, { useState } from "react";
import { requestUsers } from "./api";
import { useDebounce } from "./lib/useDebounce";
import type {User, Query, PaginationData, FilterData} from "./types";
import Pagination from "./Pagination";

const initialFilterValues: FilterData = {
    name: "",
    age: ""
}

const initialPaginationValues: PaginationData = {
    offset: 0,
    limit: 0
}

const App = () => {
    const [users, setUsers] = React.useState<User[]>([]);
    const [error, setError] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [filters, setFilters] = React.useState(initialFilterValues);
    const [pagination, setPagination] = React.useState(initialPaginationValues);
    const debouncedFilters = useDebounce(filters);
    const prevQueryRef = React.useRef<Query | null>(null);
    console.log(pagination)

    const patchFormFromInput = React.useCallback(
        ({ target }: React.ChangeEvent<HTMLInputElement>) => {
          setFilters((prev) => ({
            ...prev,
            [target.name]: target.value,
          }));
          setPagination(initialPaginationValues);
        },
        []
      );

      const getUsers = (): React.ReactNode => {
        if (isLoading || error) return;
        if (users.length === 0)
          return <div style={{ marginTop: "16px" }}>Users not found</div>;
        return users.map((user, index) => (
          <div key={user.id} style={{ marginTop: index === 0 ? "16px" : "4px" }}>
            {user.name}, {user.age}
          </div>
        ));
      };

      React.useEffect(() => {
        const request = async () => {
          setIsLoading(true);
          const query = { ...pagination, ...debouncedFilters };
          // to cancel prev request changes if new was called
          prevQueryRef.current = query;
      
          try {
            const fetchedUsers = await requestUsers(query);
            if (prevQueryRef.current !== query) return;
      
            setUsers(fetchedUsers);
          } catch (e) {
            if (prevQueryRef.current !== query) return;
            if (e) setError(((e as Record<string, string>) || {}).message);
          } finally {
            if (prevQueryRef.current !== query) return;
            setIsLoading(false);
          }
        };
      
        request();
      }, [pagination, debouncedFilters]);

      return (
        <div>
          <input
            value={filters.name}
            placeholder="Name"
            name="name"
            onChange={patchFormFromInput}
          />
          <input
            value={filters.age}
            style={{ marginLeft: "8px" }}
            placeholder="Age"
            type="number"
            name="age"
            onChange={patchFormFromInput}
          />
      
          <Pagination value={pagination} setValue={setPagination} />
      
          {isLoading && <div style={{ marginTop: "16px" }}>Loading...</div>}
          {!isLoading && error && <div style={{ marginTop: "16px" }}>{error}</div>}
          {getUsers()}
      
        </div>
      )

}

export default App;
