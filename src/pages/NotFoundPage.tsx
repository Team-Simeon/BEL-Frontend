import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <main>
      <h1>404 — Страницата не е намерена</h1>
      <Link to="/">Обратно към началото</Link>
    </main>
  );
}
