import { CitiesContext } from "../contexts/citiesContext";
import { useContext } from "react";

export function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside of the CitiesProvider");
  return context;
}
