import React from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { capitalize } from 'lodash';
import { City } from '../types/APICity';
import Autocomplete from '../components/Autocomplete';

function Preferences() {
  const [welcomeMessage, setWelcomeMessage] = React.useState('You make me feel special');
  const [selectedCity, setSelectedCity] = React.useState<City | null>(null);
  const [dailyUpdate, setDailyUpdate] = React.useState(false);
  const [dailyUpdateTime, setDailyUpdateTime] = React.useState<string | null>(null);
  const [weeklyUpdate, setWeeklyUpdate] = React.useState(false);
  const [weeklyUpdateDay, setWeeklyUpdateDay] = React.useState<string | null>(null);
  const [weeklyUpdateTime, setWeeklyUpdateTime] = React.useState<string | null>(null);
  const [weekendUpdate, setWeekendUpdate] = React.useState(false);
  const [weekendUpdateDay, setWeekendUpdateDay] = React.useState<string | null>(null);
  const [weekendUpdateTime, setWeekendUpdateTime] = React.useState<string | null>(null);
  const [clothingRecommendation, setClothingRecommendation] = React.useState(false);

  const getWelcomeMessage = React.useCallback(() => {
    const today = new Date();
    const hour = today.getHours();
    if (hour > 4 && hour < 7) {
      return 'Rise and shine, ';
    }
    if (hour < 12) {
      return 'Good morning, ';
    }
    if (hour < 18) {
      return 'Good afternoon, ';
    }
    if (hour > 22 || hour < 4) {
      return 'You should probably be sleeping, ';
    }
    return 'Good evening, ';
  }, []);

  React.useEffect(() => {
    const getPreferences = async () => {
      const preferences = await axios.get('/user/preferences');
      setWelcomeMessage(getWelcomeMessage() + preferences.data.user.email.split('@')[0]);
      setDailyUpdate(preferences.data.receivingDaily);
      setDailyUpdateTime(preferences.data.dailyReceivingTime);
      setWeeklyUpdate(preferences.data.receivingWeekly);
      setWeeklyUpdateDay(capitalize(preferences.data.weeklyReceivingWeekday));
      setWeeklyUpdateTime(preferences.data.weeklyReceivingTime);
      setWeekendUpdate(preferences.data.receivingWeekends);
      setWeekendUpdateDay(capitalize(preferences.data.weekendsReceivingWeekday));
      setWeekendUpdateTime(preferences.data.weekendsReceivingTime);
      const cities = await axios.get<City[]>(
        `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/geo/1.0/reverse?lat=${preferences.data.latitude}&lon=${preferences.data.longitude}&limit=5&appid=05bc63e7aefbf35ff1cfc19d7258723c`,
      );
      setSelectedCity(cities.data[0]);
    };
    getPreferences();
  }, [getWelcomeMessage]);

  const updatePreferences = React.useCallback(async () => {
    try {
      await axios.patch('/user/preferences', {
        latitude: selectedCity?.lat,
        longitude: selectedCity?.lon,
        receivingWeekly: weeklyUpdate,
        weeklyReceivingTime: weeklyUpdateTime,
        weeklyReceivingWeekday: weeklyUpdateDay?.toUpperCase(),
        receivingDaily: dailyUpdate,
        dailyReceivingTime: dailyUpdateTime,
        receivingWeekends: weekendUpdate,
        weekendsReceivingTime: weekendUpdateTime,
        weekendsReceivingWeekday: weekendUpdateDay?.toUpperCase(),
        clothingRecommendation,
      });
    } catch (error) {
      console.log(error);
    }
  }, [
    dailyUpdate,
    weeklyUpdate,
    weekendUpdate,
    selectedCity,
    dailyUpdateTime,
    weeklyUpdateDay,
    weeklyUpdateTime,
    weekendUpdateDay,
    weekendUpdateTime,
    clothingRecommendation,
  ]);
  return axios.defaults.headers.common.Authorization ? (
    <div>
      <h3>{welcomeMessage}</h3>
      <p>Choose your location</p>
      <Autocomplete selectHandler={setSelectedCity} initialCity={selectedCity} />
      <div className="form-check">
        <label className="form-check-label" htmlFor="dailyUpdate">
          I want to receive updates daily
          <input
            className="form-check-input"
            type="checkbox"
            id="dailyUpdate"
            checked={dailyUpdate}
            onChange={() => setDailyUpdate(!dailyUpdate)}
          />
        </label>
      </div>
      {dailyUpdate && (
        <label className="form-check-label" htmlFor="dailyUpdateTime">
          At what time?
          <input type="time" value={dailyUpdateTime || ''} onChange={(e) => setDailyUpdateTime(e.target.value)} />
        </label>
      )}
      <div className="form-check">
        <label className="form-check-label" htmlFor="weeklyUpdate">
          I want to receive updates weekly
          <input
            className="form-check-input"
            type="checkbox"
            id="weeklyUpdate"
            checked={weeklyUpdate}
            onChange={() => setWeeklyUpdate(!weeklyUpdate)}
          />
        </label>
      </div>
      {weeklyUpdate && (
        <div>
          <label className="form-check-label" htmlFor="weeklyUpdateDay">
            On what day?
            <select
              className="form-select"
              id="weeklyUpdateDay"
              value={weeklyUpdateDay || ''}
              onChange={(e) => setWeeklyUpdateDay(e.target.value)}
            >
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
              <option>Saturday</option>
              <option>Sunday</option>
            </select>
          </label>
          <br />
          <label className="form-check-label" htmlFor="dailyUpdateTime">
            At what time?
            <input type="time" value={weeklyUpdateTime || ''} onChange={(e) => setWeeklyUpdateTime(e.target.value)} />
          </label>
        </div>
      )}
      <div className="form-check">
        <label className="form-check-label" htmlFor="weekendsUpdateCheck">
          I want to receive updates on the weekends
          <input
            className="form-check-input"
            type="checkbox"
            id="disabledFieldsetCheck"
            checked={weekendUpdate}
            onChange={() => setWeekendUpdate(!weekendUpdate)}
          />
        </label>
      </div>
      {weekendUpdate && (
        <div>
          <label className="form-check-label" htmlFor="weekendsUpdateDay">
            On what day?
            <select
              className="form-select"
              id="weekendsUpdateDay"
              value={weekendUpdateDay || ''}
              onChange={(e) => setWeekendUpdateDay(e.target.value)}
            >
              <option>Friday</option>
              <option>Saturday</option>
              <option>Sunday</option>
            </select>
          </label>
          <br />
          <label className="form-check-label" htmlFor="weekendsUpdateTime">
            At what time?
            <input
              type="time"
              value={weekendUpdateTime || ''}
              onChange={(e) => setWeekendUpdateTime(e.target.value)}
              id="weekendsUpdateTime"
            />
          </label>
        </div>
      )}
      <div className="form-check">
        <label className="form-check-label" htmlFor="clothingRecommendationCheck">
          I want to receive clothing recommendations
          <input
            className="form-check-input"
            type="checkbox"
            id="clothingRecommendationCheck"
            checked={clothingRecommendation}
            onChange={() => setClothingRecommendation(!clothingRecommendation)}
          />
        </label>
      </div>
      <button type="button" className="btn btn-primary" onClick={updatePreferences}>
        Submit
      </button>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}

export default Preferences;
