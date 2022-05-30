import { Link } from 'react-router-dom';
import './styles/App.css';

function App() {
  return (
    <div>
      <h3>SlightliCloudi</h3>
      <p>Info about weather and how to prepare for it delivered straight to you!</p>
      <Link to="login">
        <button type="button" className="btn btn-primary mx-2">
          Login
        </button>
      </Link>
      <Link to="register">
        <button type="button" className="btn btn-success">
          Register
        </button>
      </Link>
    </div>
  );
}

export default App;
