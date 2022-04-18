import axios from "axios";
import { useEffect, useState } from "react"
import styled from 'styled-components';
import CartItem from './CartItem.js';
import TotalPrice from './TotalPrice.js';

function Cart(){

    const API_BASE_URL = process.env.REACT_APP_API_ROOT;
    
    const [cartItems, setCartItems] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    let totalPrice = 0;

    useEffect(()=>{
        axios.get(`${API_BASE_URL}/products/cartitems`, {
            headers : {
                Authorization : localStorage.getItem('access_token')
            }
        })
        .then((response)=>{
            if (response != null && response.data != null) {
                const cartItemList = response.data.cart_items;
                setCartItems(cartItemList);
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    }, []);

    const onClickDelete = () => {
        if (checkedItems.length === 0) {
            alert('상품을 선택해주세요.')
        } else {
            if (window.confirm('선택한 상품을 삭제하시겠습니까?')) {
                const accessToken = localStorage.getItem('access_token')
                let productOptionIds = [];
                checkedItems.forEach(e => productOptionIds.push(e.productOptionId))
    
                axios.delete(`${API_BASE_URL}/products/cartitems`, 
                { headers : { 
                    Authorization : accessToken },
                    data : { product_option_ids : productOptionIds }})
                .then(()=>{
                    window.location.reload();
                })
                .catch((error)=>{
                    console.log(error);
                })
            } 
        }
    }

    if (cartItems.length === 0){
        return (
            <NoItemContainer>
                <NoItemImage src='https://ulr0-bucket.s3.ap-northeast-2.amazonaws.com/pngwing.com.png'/>
                <p>장바구니에 상품을 담아보세요.</p>
            </NoItemContainer>
        )
    } else {
        return(
            <ItemContainer>
                <div>
                    <Title>장바구니</Title>
                    <DeleteBtnContainer>
                        <DeleteBtn onClick={ onClickDelete }>선택삭제</DeleteBtn>
                    </DeleteBtnContainer>
                    <hr/>
                </div>

                <CartItem 
                    cartItems={cartItems} 
                    checkedItems={checkedItems} 
                    setCheckedItems={setCheckedItems}
                    totalPrice={totalPrice}
                />
                {
                    checkedItems.map((item)=>{
                        
                        totalPrice += item.optionPrice;
                    })
                }
                <TotalPrice
                    cartItems={cartItems}
                    checkedItems={checkedItems}
                    totalPrice={totalPrice}
                    
                />
            </ItemContainer>
        )
    }

}

export default Cart

const NoItemContainer = styled.div`
    margin : 200px auto;
`

const NoItemImage = styled.img`
    width : 100px;
    margin-bottom : 10px;
`

const ItemContainer = styled.div`
    width : 80%;
    margin : auto;
    padding-bottom : 70px;
`

const Title = styled.h1`
    margin-top : 20px;
    display : flex;
`

const DeleteBtnContainer = styled.div`
    display : flow-root;
`

const DeleteBtn = styled.button`
    float : right;
    background-color : #ffffff;
    border : 1px solid;
    border-radius : 6px;
    font-size : 15px;
`