import { FC } from "react";
import { BookInformation } from "./lib/types";

interface ICard {
  book: BookInformation,
}

const Card: FC<ICard> = ({ book }) => {
  return (
    <div>
      <h3>{book.name}</h3>
      <p>
        <b>Автор</b>: {book.author.name}
      </p>
      <p>
        <b>Описание</b>: {book.description}
      </p>
      <p>
        <b>Отзыв: </b>
        {book.reviews.map((r) => `${r.text} (${r.user.name})`).join(", ") ||
          "-"}
      </p>
    </div>
  );
};

export default Card;
