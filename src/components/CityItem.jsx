import styles from "./CityItem.module.css";
import { months } from "../utils/constants";
import { Link } from "react-router-dom";
import { useCities } from "../hooks/useCities";

function formatDate(d) {
  return `(${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()} )`;
}

export default function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();

  const {
    id,
    emoji,
    cityName,
    date: d,
    position: { lat, lng },
  } = city.city;

  const date = formatDate(new Date(d));

  function handleClick(e) {
    e.preventDefault();
    deleteCity(id);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          currentCity.id === id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${lat}&lng=${lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{date}</time>
        <button className={styles.deleteBtn} onClick={handleClick}>
          ╳
        </button>
      </Link>
    </li>
  );
}
