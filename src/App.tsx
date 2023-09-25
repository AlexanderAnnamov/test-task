import "./styles.css";
import { Book, BookInformation, User, Review } from "./lib/types";
import { getBooks, getUsers, getReviews } from "./lib/api";
import { useEffect, useState, FC } from "react";
import Card from "./Card";

// Техническое задание:
// Доработать приложение App, чтобы в отрисованном списке
// были реальные отзывы, автор книги и автор отзыва.
// Данные об отзывах и пользователях можно получить при помощи асинхронных
// функций getUsers, getReviews

// функция getBooks возвращает Promise<Book[]>
// функция getUsers возвращает Promise<User[]>
// функция getReviews возвращает Promise<Review[]>

// В объектах реализующих интерфейс Book указаны только uuid
// пользователей и обзоров

// // В объектах реализующих интерфейс BookInformation, ReviewInformation
// указана полная информация об пользователе и обзоре.

type Reviews = {
  id: string;
  text: string;
  user: { id: string; name: string };
};

const App: FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBooksCard = async () => {
      setIsLoading(true);
      const fetchedBooks = await getBooks();
      const fetchedUsers = await getUsers();
      const fetchedReviews = await getReviews();
      setUsers(fetchedUsers);
      setBooks(fetchedBooks);
      setReviews(fetchedReviews);
      setIsLoading(false);
    };

    fetchBooksCard();
  }, []);

  const findParameterBook = <T extends { id: string }>(
    array: T[],
    id: string
  ): T => {
    return array.find((e: T) => {
      if (e !== undefined) {
        return e.id === id;
      }
      return false;
    }) as T;
  };

  const addReviewsInUsers = (book: Book) => {
    const userReviews: Reviews[] = book.reviewIds.map((reviewId) => {
      const reviewBook = findParameterBook<Review>(reviews, reviewId);
      const reviewUser = findParameterBook<User>(users, reviewBook.userId);

      if (reviewId === reviewBook.id) {
        return {
          id: reviewId,
          text: reviewBook.text,
          user: { id: reviewUser.id, name: reviewUser.name }
        };
      }
      return false;
    }) as Reviews[];
    return userReviews;
  };

  const toBookInformation = (book: Book, users: User[]): BookInformation => {
    const userAuthor = findParameterBook<User>(users, book.authorId);
    const userReviews = addReviewsInUsers(book);

    return {
      id: book.id,
      name: book.name || "Книга без названия",
      author: { name: userAuthor?.name, id: userAuthor?.id },
      reviews: userReviews,
      description: book.description
    };
  };

  return (
    <div>
      <h1>Мои книги:</h1>
      {isLoading && <div>Загрузка...</div>}
      {!isLoading &&
        books.map((b) => (
          <Card key={b.id} book={toBookInformation(b, users)} />
        ))}
    </div>
  );
};

export default App;
