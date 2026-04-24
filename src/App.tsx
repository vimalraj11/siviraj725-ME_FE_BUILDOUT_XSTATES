import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  useEffect(() => {
    fetch("https://location-selector.labs.crio.do/countries")
      .then((res) => res.json())
      .then((data: string[]) => setCountries(data))
      .catch((err) => console.error("Countries error:", err));
  }, []);

  const handleCountryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const country = e.target.value;

    setSelectedCountry(country);
    setSelectedState("");
    setSelectedCity("");
    setStates([]);
    setCities([]);

    if (!country) return;

    try {
      const res = await fetch(
        `https://location-selector.labs.crio.do/country=${country}/states`
      );
      const data: string[] = await res.json();
      setStates(data);
    } catch (err) {
      console.error("States error:", err);
    }
  };

  const handleStateChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const state = e.target.value;

    setSelectedState(state);
    setSelectedCity("");
    setCities([]);

    if (!state) return;

    try {
      const res = await fetch(
        `https://location-selector.labs.crio.do/country=${selectedCountry}/state=${state}/cities`
      );
      const data: string[] = await res.json();
      setCities(data);
    } catch (err) {
      console.error("Cities error:", err);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div className="app">
      <h1>Select Location</h1>

      <div className="dropdown-container">
        <select value={selectedCountry} onChange={handleCountryChange}>
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          value={selectedState}
          onChange={handleStateChange}
          disabled={!selectedCountry}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          value={selectedCity}
          onChange={handleCityChange}
          disabled={!selectedState}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {selectedCity && (
        <h2>
          You selected {selectedCity}, {selectedState}, {selectedCountry}
        </h2>
      )}
    </div>
  );
}

export default App;
