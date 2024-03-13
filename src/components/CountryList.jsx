import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem.jsx";
import Spinner from "./Spinner";
import Message from "./Message.jsx";
import { useCities } from "../hooks/useCities";

export default function CountryList() {
  const { cities, isLoading, error } = useCities();

  const countries = cities.reduce((arr, city) => {
    if (arr.map((el) => el.country).includes(city.country)) return arr;
    return [...arr, { country: city.country, emoji: city.emoji }];
  }, []);

  return (
    <>
      {!countries.length && (
        <Message message="Add your first city by clicking on a city on the map" />
      )}
      <div className={styles.countryList}>
        {error && console.log(error)}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {countries.map((country, id) => (
              <CountryItem key={id} country={country} />
            ))}
          </>
        )}
      </div>
    </>
  );
}
