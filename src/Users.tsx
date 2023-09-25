import React from "react";
import { requestUsers, Query, User } from "./api";
import UserItem from "./UserItem";

const Users: React.FC = () => {
  const [filterUsersByName, setFilterUsersByName] = React.useState("");
  const [filterUsersByAge, setFilterUsersByAge] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [users, setUsers] = React.useState<User[]>([]);
  const [offset, setOffset] = React.useState(0);
  const [page, setPage] = React.useState(1);

  const params: Query = {
    name: filterUsersByName,
    age: filterUsersByAge,
    limit: 4,
    offset: offset
  };

  React.useEffect(() => {
    setIsLoading(true);
    requestUsers(params).then((data) => {
      setUsers(data);
      setIsLoading(false);
    });
  }, [filterUsersByName, filterUsersByAge, offset]);

  const handlePrevPageClick = () => {
    if (page !== 1) {
      setPage(page - 1);
      setOffset(offset - 4);
    }
  };

  const handleNextPageClick = () => {
    if (page !== 3) {
      setPage(page + 1);
      setOffset(offset + 4);
    }
  };

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let page = parseInt(event.target.value);
    setPage(page);
    if (page === 1) {
      setOffset(0);
    } else if (page === 2) {
      setOffset(4);
    } else {
      setOffset(8);
    }
  };

  return (
    <div className="user">
      <div className="inputs">
        <input
          placeholder="Name"
          type="text"
          value={filterUsersByName}
          onChange={(e) => setFilterUsersByName(e.target.value)}
        />
        <input
          placeholder="Age"
          type="number"
          value={filterUsersByAge}
          onChange={(e) => setFilterUsersByAge(e.target.value)}
        />
      </div>

      {users.length !== 0 ? (
        isLoading ? (
          <p className="main">Loading....</p>
        ) : (
          <ul className="main">
            {users.map((user) => (
              <UserItem key={user?.id} name={user?.name} age={user?.age} />
            ))}
          </ul>
        )
      ) : (
        <p className="main">Users not found</p>
      )}
      <div className="pagination">
        By page:{" "}
        <select value={page} onChange={(e) => handleChangeSelect(e)}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
        <button onClick={handlePrevPageClick}>prev</button>
        <p>{page}</p>
        <button onClick={handleNextPageClick}>next</button>
      </div>
    </div>
  );
};

export default Users;
