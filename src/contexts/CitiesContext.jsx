import { createContext, useCallback, useEffect } from "react";
import { useReducer } from "react";

export const CitiesContext = createContext();

const initialState = {
  data: [],
  currentCity: {},
  isLoading: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true, error: "" };

    case "loaded":
      return { ...state, isLoading: false };

    case "res/loaded":
      return { ...state, data: action.payload };

    case "error":
      return { ...state, error: action.payload };

    case "city/loaded":
      return { ...state, currentCity: action.payload };

    case "city/created":
      return { ...state, data: [...state.data, action.payload] };

    case "city/deleted":
      return { ...state, data: action.payload };

    default:
      throw new Error("Unknown Action Type!");
  }
}

function CitiesProvider({ children }) {
  const SERVER_URL = "http://localhost:3000/cities";

  const [{ data, currentCity, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    const controller = new AbortController();

    (async function () {
      try {
        dispatch({ type: "loading" });

        const prom = await fetch(`${SERVER_URL}`, {
          signal: controller.signal,
        });
        const res = await prom.json();
        if (!prom.ok)
          throw new Error("Something went wrong while fetching data!");

        dispatch({ type: "res/loaded", payload: res });
      } catch (err) {
        err.name !== "AbortError" &&
          dispatch({ type: "error", payload: err.message });
      } finally {
        dispatch({ type: "loaded" });
      }
    })();

    return () => controller.abort();
  }, []);

  const getCurrentCity = useCallback(async function (id) {
    try {
      if(Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });

      const res = await fetch(`${SERVER_URL}/${id}`);
      const jsonResponse = await res.json();
      if (!res.ok) throw new Error("Something went wrong while fetching data!");

      dispatch({ type: "city/loaded", payload: jsonResponse });
    } catch (err) {
      console.log(err);
    } finally {
      dispatch({ type: "loaded" });
    }
  }, [currentCity.id]);

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });

      const res = await fetch(`${SERVER_URL}`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonResponse = await res.json();
      if (!res.ok) throw new Error("Something went wrong while posting data!");
      dispatch({ type: "city/created", payload: jsonResponse });
    } catch (err) {
      console.log(err);
    } finally {
      dispatch({ type: "loaded" });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${SERVER_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Something went wrong while deleting data!");

      const newData = data.filter((city) => city.id !== id);
      dispatch({ type: "city/deleted", payload: newData });
    } catch (err) {
      console.log(err);
    } finally {
      dispatch({ type: "loaded" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities: data,
        isLoading,
        error,
        currentCity,
        getCurrentCity,
        createCity,
        deleteCity,
      }}
    >
      x {children}
    </CitiesContext.Provider>
  );
}

export default CitiesProvider;
