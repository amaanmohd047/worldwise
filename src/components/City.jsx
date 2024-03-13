import styles from "./City.module.css";
import Button from "./Button";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "./Spinner";
import { useCities } from "../hooks/useCities";
import { useEffect } from "react";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  // TEMP DATA

  const { id } = useParams();
  const { getCurrentCity, currentCity, isLoading, error } = useCities();

  useEffect(
    function () {
      getCurrentCity(id);
    },
    [id, getCurrentCity]
  );

  const { cityName, emoji, date, notes } = currentCity;

  const navigate = useNavigate();

  return (
    <>
      {error && console.log(error)}
      {isLoading ? (
        <Spinner />
      ) : (
        <div className={styles.city}>
          <div className={styles.row}>
            <h6>City name</h6>
            <h3>
              <span>{emoji}</span> {cityName}
            </h3>
          </div>

          <div className={styles.row}>
            <h6>You went to {cityName} on</h6>
            <p>{formatDate(date || null)}</p>
          </div>

          {notes && (
            <div className={styles.row}>
              <h6>Your notes</h6>
              <p>{notes}</p>
            </div>
          )}

          <div className={styles.row}>
            <h6>Learn more</h6>
            <a
              href={`https://en.wikipedia.org/wiki/${cityName}`}
              target="_blank"
              rel="noreferrer"
            >
              Check out {cityName} on Wikipedia &rarr;
            </a>
          </div>

          <div>
            <Button type="back" onHandleClick={() => navigate(-1)}>
              ← Back
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default City;
