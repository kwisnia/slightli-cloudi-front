import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  const handleSubmit = React.useCallback(async () => {
    try {
      const response = await axios.post('/user/register', {
        email,
        password,
      });
      axios.defaults.headers.common.Authorization = `Bearer ${response.headers.authorization}`;
      navigate('/preferences');
    } catch (error) {
      console.log(error);
    }
  }, [email, navigate, password]);
  return (
    <div className="container">
      <h3>Create an account</h3>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="form-control mb-2"
        placeholder="Hasło"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="button" className="btn btn-primary" onClick={handleSubmit}>
        Register
      </button>
    </div>
  );
}

export default Register;
