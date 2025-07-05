import React from 'react';
import './css/login.css';
import { InputGroup, InputGroupText, Input, FormGroup, Button, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import logo2 from '../../assets/images/logo2.png'
import { API_BACK_URL } from '../../config/config';

function Login() {
    const [user, setUser] = React.useState({
        username: '',
        password: ''
    });
    const [alert, setAlert] = React.useState(null);
    const navigate = useNavigate();
    const validateUser = async () => {
        try {
            const credentials = btoa(`${user.username}:${user.password}`);
            const headers = new Headers({
                Authorization: `Basic ${credentials}`,
                'Content-Type': 'application/json',
            });
            const requestOptions = {
                method: 'POST',
                headers: headers,
            };
            const response = await fetch(`${API_BACK_URL}/login/`, requestOptions);
            const data = await response.json();
            console.log(data)
        
            if (data.detail || data.error) {
                console.log(data.detail || data.error);
                setAlert({
                    type: 'danger',
                    message: data.detail || data.error
                });
                return;
            } else {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('user', JSON.stringify(data));
            }
            navigate('/home')
        } catch (error) {
            console.error('Error:', error);
        }
    }; 


    const handleInput = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }
    return (
      <div className="login-page">
        <h3 className='login-title'>Cartório App</h3>
        <p>Utilize o usuário "lucas" e senha "123"</p>
        <FormGroup className='form-login'>
        <InputGroup >
            <InputGroupText>
              @
            </InputGroupText>
            <Input placeholder="username" name='username' onChange={(e) => handleInput(e)}/>
        </InputGroup>
        <Input
        id="examplePassword"
        name="password"
        placeholder="password"
        type="password"
        onChange={(e) => handleInput(e)}
      />
      <Button color="success" onClick={validateUser}>Login</Button>
      </FormGroup>
      {alert && (
        <Alert color={alert.type} style={{position: 'fixed', bottom: '10px', right: '10px'}}>
          {alert.message}
        </Alert>
      )}
      </div>
    );
  }
  
  export default Login;