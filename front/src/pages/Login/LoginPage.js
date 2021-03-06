import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import './LoginPage.css';

function LoginPage(){

    const API_BASE_URL = process.env.REACT_APP_API_ROOT;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const dispatch = useDispatch();

    const emailHandler = (e) => {
        setEmail(e.target.value)
    };
    const passwordHandler = (e) => {
        setPassword(e.target.value)
    };

    const onClickHandler = (e) => {
        e.preventDefault();

        axios.post(`${API_BASE_URL}/accounts/login`, 
        { email : email, password : password })
        .then((response)=>{
            if ( response !== null && response.date !== null) {

                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('account_type', response.data.account_type);
                dispatch({ type : 'login' , payload : response.data.account_type });
                history.push('/');

                    } 
                })
        .catch((error)=>{
            console.log(error);
            alert('이메일 또는 비밀번호가 틀렸습니다.')
        });
    };

    return(
        <div className="login">
            <form>
                <div>
                    <input type="text" placeholder="Email" onChange={emailHandler}/>
                </div>
                <div>
                    <input type="password" placeholder="Password" onChange={passwordHandler}/>
                </div>
                <div>
                    <button onClick={onClickHandler}>Log In</button>
                </div>
            </form>
        </div>
    )
}

export default LoginPage