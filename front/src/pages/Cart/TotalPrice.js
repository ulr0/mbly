import { useEffect } from 'react';
import styled from 'styled-components';

function TotalPrice(props){

    return (
        <div>
            <TotalPriceHr/>
            <TotalPriceText>총 결제금액</TotalPriceText>
            <TotalPriceNum>{ props.totalPrice }</TotalPriceNum>
            <TotalPriceHr/>
            <OrderBtn>구매하기</OrderBtn>
        </div>
    )
}

export default TotalPrice

const TotalPriceHr = styled.hr`
    border : 1px #41464b solid;
`

const TotalPriceText = styled.p`
    font-size : 25px;
    font-weight : bold;
    margin : 0;
`

const TotalPriceNum = styled.p`
    font-size : 25px;
    font-weight : bold;
    color : #f73c4e;
`

const OrderBtn = styled.button`
    width : 250px;
    height : 50px;
    border : 0;
    border-radius : 6px;
    background-color : #f73c4e;
    color : white;
    font-weight : bold;
    font-size : 17px;
`