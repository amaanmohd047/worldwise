import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { useCities } from "../hooks/useCities";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { convertToEmoji } from "../utils/convertToEmoji";

import styles from "./Form.module.css";
import Button from "./Button";
import Spinner from "./Spinner";
import Message from "./Message";

const GEOCODE_API_URL =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";

const initialState = {
  cityName: "",
  country: "",
  date: new Date(),
  notes: "",
  isLoadingGeocoding: false,
  emoji: "",
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "geocoding/loading":
      return { ...state, isLoadingGeocoding: true, error: "" };

    case "geocoding/loaded":
      return { ...state, isLoadingGeocoding: false };

    case "error":
      return { ...state, error: action.payload };

    case "citiesData/loaded":
      return {
        ...state,
        cityName: action.payload.city || action.payload.locality,
        country: action.payload.country,
        emoji: convertToEmoji(action.payload.countryCode),
      };

    case "cityName/changed":
      return { ...state, cityName: action.payload };

    case "date/changed":
      return { ...state, date: action.payload };

    case "notes/changed":
      return { ...state, notes: action.payload };

    default:
      throw new Error("unknown action type");
  }
}

function Form() {
  const [
    { cityName, country, date, notes, isLoadingGeocoding, emoji, error },
    dispatch,
  ] = useReducer(reducer, initialState);

  const navigate = useNavigate();
  const [lat, lng] = useUrlPosition();
  const { createCity, isLoading } = useCities();

  useEffect(
    function () {
      if (!lat && !lng) return;
      (async function () {
        try {
          dispatch({ type: "geocoding/loading" });

          const res = await fetch(
            `${GEOCODE_API_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          if (!data.city || !data.countryCode)
            throw new Error("No city found! Click somewhere else ");

          dispatch({ type: "citiesData/loaded", payload: data });
        } catch (err) {
          dispatch({ type: "error", payload: err.message });
        } finally {
          dispatch({ type: "geocoding/loaded" });
        }
      })();
    },
    [lat, lng]
  );

  if (isLoadingGeocoding) return <Spinner />;

  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the Map" />;

  if (error) return <Message message={error} />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    await createCity(newCity);
    navigate("/app/cities");
  }

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) =>
            dispatch({ type: "cityName/changed", payload: e.target.value })
          }
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          className="react-datepicker"
          selected={date}
          onChange={(date) => dispatch({ type: "date/changed", payload: date })}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) =>
            dispatch({ type: "notes/changed", payload: e.target.value })
          }
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onHandleClick={(e) => {
            e.preventDefault();
            navigate("/app/cities");
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
