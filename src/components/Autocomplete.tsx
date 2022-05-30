import axios from 'axios';
import { debounce } from 'lodash';
import React from 'react';
import { City } from '../types/APICity';
import '../styles/Autocomplete.css';

interface AutocompleteProps {
  selectHandler: (city: City) => void;
  initialCity: City | null;
}

function Autocomplete({ selectHandler, initialCity }: AutocompleteProps) {
  const [city, setCity] = React.useState('');
  const [apiCities, setApiCities] = React.useState<City[]>([]);
  const getApiCities = React.useCallback(async (givenCity) => {
    try {
      const cities = await axios.get<City[]>(
        `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/geo/1.0/direct?q=${givenCity}&limit=5&appid=05bc63e7aefbf35ff1cfc19d7258723c`,
      );
      setApiCities(cities.data);
    } catch (error) {
      setApiCities([]);
    }
  }, []);
  const debounced = React.useMemo(() => debounce(getApiCities, 500), [getApiCities]);

  React.useEffect(() => {
    if (initialCity) {
      setCity(`${initialCity.name}, ${initialCity.state}, ${initialCity.country}`);
    }
  }, [initialCity]);

  return (
    <div>
      <input
        type="text"
        className="form-control"
        value={city}
        onChange={(e) => {
          setCity(e.target.value);
          debounced(e.target.value);
        }}
      />
      <div className="bg-white">
        {apiCities.map((apiCity, index) => (
          <div
            key={JSON.stringify(apiCity)}
            onClick={() => {
              selectHandler(apiCity);
              setApiCities([]);
            }}
            onKeyDown={() => {}}
            role="button"
            tabIndex={index}
            className="cell"
          >
            {apiCity.name}, {apiCity.state}, {apiCity.country}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Autocomplete;
