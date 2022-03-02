import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from "axios";
import styled from 'styled-components';

function KakaoLogin(){

    const API_BASE_URL = process.env.REACT_APP_API_ROOT;
    const { Kakao } = window;

    let history = useHistory();

    const dispatch = useDispatch();
    
    const kakaoLogin = () => {
        Kakao.Auth.login({
            success: function(response) {
                axios.get(`${API_BASE_URL}/accounts/login/kakao`, 
                { headers : { Authorization : response.access_token } })
                .then((response)=>{
                    
                    if ( response !== null && !response.date !== null ) {
                        
                        localStorage.setItem('access_token', response.data.access_token);
                        localStorage.setItem('account_type', response.data.account_type);
                        dispatch({ type : 'login', payload : response.data.account_type });
                        history.push('/');

                        } 
                    });
            },
            fail: function(error) {
                console.log(error);
            }
        })
    }

    return(
        <div>
            <KakaoImage src="https://ulr0-bucket.s3.ap-northeast-2.amazonaws.com/kakao_login.png" onClick={kakaoLogin}/>
        </div>
    )
}

const KakaoImage = styled.img`
    cursor: pointer;
    margin: 10px;`

export default KakaoLogin