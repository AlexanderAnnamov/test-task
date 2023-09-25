interface IUserItem {
    name: string;
    age: number;
  }
  
  const UserItem: React.FC<IUserItem> = ({ name, age }) => {
    return (
      <p>
        {name}, {age}
      </p>
    );
  };
  
  export default UserItem;
  