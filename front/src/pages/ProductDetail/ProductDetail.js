import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import styled from 'styled-components';

function ProductDetail(){

    const { product_id } = useParams();
    const API_BASE_URL = process.env.REACT_APP_API_ROOT;
    const history = useHistory();

    const[product, setProduct] = useState({});
    const[seller, setSeller] = useState({});
    const[options, setOptions] = useState([]);
    const[images, setImages] = useState([]);

    const authState = useSelector((state)=>state);

    useEffect(()=>{
        axios.get(`${API_BASE_URL}/products/detail/${product_id}`)
        .then((response)=>{
            if ( response !== null && response.data !== null ){
                let data = response.data;
                setProduct(data.product);
                setSeller(data.seller);
                setOptions(data.product.options);
                setImages(data.product.images);
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    }, []);

    let price;
    if ( !product.discount_price ) {
        price = Number(product.price)
    } else {
        price = Number(product.discount_price)
    }
    
    const [selectedOptions, setSelectedOptions] = useState([]);

    const onChangeOption = (e) => {
        const target = Number(e.target.value);
        
        if (target !== 'option'){
            const a = selectedOptions.find((element) => element.id === target);
            if (!a){
                const selectedOption = { id : target, quantity : 1 };
                setSelectedOptions([ ...selectedOptions, selectedOption ]);
            }
        }
    }

    let totalPrice = 0

    const onClickQuantity = (type, index) => {
        if (type === 'plus'){
            let copy = [ ...selectedOptions ];
            if (copy[index].quantity === 30){
                alert('최대 구매 수량은 30개입니다.')
            } else {
                copy[index].quantity ++;
                setSelectedOptions(copy);
            } 
        } else {
            let copy = [ ...selectedOptions ];
            if (copy[index].quantity === 1){
                alert('최소 구매 수량은 1개입니다.')
            } else{
                copy[index].quantity --;
                setSelectedOptions(copy);
            }
        }
    }

    const onClickDelete = (index) => {
        let copy = [ ...selectedOptions ];
        copy.splice(index, 1);
        setSelectedOptions(copy);
    }

    const onClickCart = () => {
        if (!selectedOptions.length) {
            alert('상품 옵션을 선택해주세요.');
            return ;
        }
        const accessToken = localStorage.getItem('access_token')
        if (!authState.isLogin || !accessToken) {
            if (window.confirm('로그인이 필요한 서비스입니다. 로그인하시겠습니까?')) {
                history.push('/accounts/login')
            }
        } else {
            axios.post(`${API_BASE_URL}/products/cartitems`, 
            { product_id : product.id, product_options : selectedOptions },
            { headers : { Authorization : accessToken } })
            .then(()=>{
                if (window.confirm('장바구니에 상품이 추가되었습니다. 장바구니로 이동하시겠습니까?')) {
                    history.push('/cart')
                }
            })
            .catch((error)=>{
                console.log(error);
            })
        }

    }

    return(
        <Container>
            
            <MainImageContainer>
                <MainImage src={ product.main_image_url } />
            </MainImageContainer>

            <ProductInfoContainer>

                <SellerInfoDiv>
                    <SellerImage src={ seller.image_url }/>
                    <SellerName>{ seller.name }</SellerName>
                </SellerInfoDiv>

                <hr/>
                <ProductName>{ product.name }</ProductName>

                <PriceDiv>
                    {
                        !product.discount_price
                        ? <Price>{ Number(product.price) }원</Price>
                        : (
                            <>
                                <Price>{ Number(product.discount_price) }원</Price>
                                <LinedPrice>{ Number(product.price) }원</LinedPrice>
                            </>
                        )
                    }
                    <br/>
                </PriceDiv>

                <SelectBox onChange={ onChangeOption }>
                    <option value='option'>[필수] 상품 옵션 선택</option>
                    {
                        options.map((option, i)=>{
                            return (
                            <option key={i} value={option.id}>
                                { option.color } / { option.size } { !option.extra_price ? null : " (+" + Number(option.extra_price) + "원)" }
                            </option>
                            )    
                        })
                    }
                </SelectBox>

                {
                    selectedOptions.map((a, i)=>{
                        let option = options.filter((object)=>{
                            if (object.id === a.id){
                                return object
                            }
                        })

                        option = option[0]

                        let optionPrice;
                        if (!option.extra_price) {
                            optionPrice = price * a.quantity;
                        } else {
                            optionPrice = (price + Number(option.extra_price)) * a.quantity
                        }

                        totalPrice += optionPrice
                        
                        return (
                            <SelectedOption key={i}>
                                <OptionInfo>{ option.color } / { option.size }</OptionInfo>
                                <DeleteBtn onClick={()=>{ onClickDelete(i) }}>x</DeleteBtn>
                                <br/>
                                <QuantityBtn onClick={()=>{ onClickQuantity('minus', i) }}>-</QuantityBtn>
                                <QuantityInput type='number' value={ a.quantity } readOnly />
                                <QuantityBtn onClick={()=>{ onClickQuantity('plus', i) }}>+</QuantityBtn>
                                <OptionPrice>{ optionPrice }원</OptionPrice>
                            </SelectedOption>
                        )
                    })
                }

                <hr/>
                <span>총 상품 금액</span>
                <TotalPrice>{ totalPrice }원</TotalPrice>
                
                <hr/>
                <CartBtn onClick={ onClickCart }>장바구니 담기</CartBtn>

            </ProductInfoContainer>

            <DetailImageContainer>
                <hr/>
                {
                    images.map((image, i)=>{
                        return <DetailImage key={i} src={ image }/> 
                    })
            }
            </DetailImageContainer>

        </Container>
    )
}

export default ProductDetail

const Container = styled.div`
    width : 80%;
    margin : auto;
    text-align : left;
`

const MainImageContainer = styled.div`
    width : 50%;
    float : left;
`

const MainImage = styled.img`
    width : 300px;
    height : 400px; 
    margin-top: 15px;
`

const ProductInfoContainer = styled.div`
    width : 50%;
    float : right;
    margin-top : 15px;
`

const SellerInfoDiv = styled.div`
    display : inline-flex;
`

const SellerImage = styled.img`
    width : 50px;
    height : 50px;
    border-radius : 100%;
`

const SellerName = styled.p`
    margin : auto 10px;
`

const ProductName = styled.span`
    font-weight : bold;
    font-size : 20px;
`

const PriceDiv = styled.div`
    display : inline-flex;
    float : right;
`

const Price = styled.span`
    fontSize : 18px;
    font-weight : bold;
    margin-right : 5px;
`

const LinedPrice = styled.span`
    text-decoration : line-through; 
`
const SelectBox = styled.select`
    margin-top : 15px;
    width : 250px; 
    height : 25px;
`

const SelectedOption = styled.div`
    background-color: #f8f9fa; 
    margin-top : 10px; 
    padding : 10px;
`

const OptionInfo = styled.span`
    margin-bottom : 10px;
    font-weight : bold;
`

const DeleteBtn = styled.button`
    float : right; 
    border-style : none; 
    color : grey; 
    background-color : #f8f9fa;
`

const QuantityBtn = styled.button`
    width : 30px;
    border-color : #a9a9a9;
`

const QuantityInput = styled.input`
    width : 50px;
`

const TotalPrice = styled.span`
    float : right; 
    color : red; 
    font-weight : bold; 
    font-size : 20px;
`

const CartBtn = styled.button`
    display : block;
    margin : 20px auto;
    width : 300px;
    height : 50px;
    background-color : #fff0f5;
    color : #f55775;
    border-style : none;
    border-radius : 5%;
`

const DetailImageContainer = styled.div`
    display : inline-block;
`

const DetailImage = styled.img`
    width : 100%;
`

const OptionPrice = styled.span`
    float : right;
`