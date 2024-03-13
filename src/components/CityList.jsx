import styles from "./CityList.module.css";
import CityItem from "./CityItem.jsx";
import Spinner from "./Spinner";
import Message from "./Message.jsx";
import { useCities } from "../hooks/useCities";

export default function CityList() {
  const { cities, isLoading, error } = useCities();

  return (
    <ul className={styles.cityList}>
      {error && console.log(error)}
      {!cities.length && (
        <Message message="Add your first city by clicking on a city on the map" />
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {cities?.map((city) => (
            <CityItem key={city.id} city={{ city }} />
          ))}
        </>
      )}
    </ul>
  );
}
