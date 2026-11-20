import { Link } from "react-router";

export default function HomePage() {
  return (
    <main>
      <h1>Добре дошли в BEL Prep!</h1>
      <p>Платформа за подготовка за ДЗИ по български език и литература.</p>

      <Link to="/login">Вход</Link>
    </main>
  );
}
  