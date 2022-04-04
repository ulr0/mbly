import styled from 'styled-components';

function CartItem(props){

    const cartItems = props.cartItems;

    const onChangeCheckbox = (e, productOptionId, optionPrice) => {
        if (e.target.checked) {
            props.setCheckedItems([ ...props.checkedItems, { productOptionId : productOptionId, optionPrice : optionPrice }])
        } else {
            props.setCheckedItems(props.checkedItems.filter((e) => e.productOptionId !== productOptionId));
        }
    }

    return(
        <div>
            <CartItemHeader>
                <ItemInfoCell>
                    <HeaderName>상품 정보</HeaderName>
                </ItemInfoCell>
                <ItemOptionCell>
                    <HeaderName>상품 옵션</HeaderName>
                </ItemOptionCell>
                <ItemPriceCell>
                    <HeaderName>가격</HeaderName>
                </ItemPriceCell>
            </CartItemHeader>
            <hr/>

            {
                cartItems.map((item)=>{

                    let price;
                    if (!item.discount_price) {
                        price = Number(item.price);
                    } else {
                        price = Number(item.discount_price);
                    }

                    let optionPrice;
                    if (!item.extra_price) {
                        optionPrice = price * item.quantity;
                    } else {
                        optionPrice = (price + Number(item.extra_price)) * item.quantity;
                    }

                    return (
                        <div key={ item.product_option_id }>
                            <Item>
                                <CheckboxCell>
                                    <Checkbox type='checkbox' checked={ 
                                        !props.checkedItems.find((e)=> e.productOptionId === item.product_option_id) 
                                        ? false 
                                        : true 
                                    } onChange={(e)=>{ onChangeCheckbox(e, item.product_option_id, optionPrice) }}></Checkbox>
                                </CheckboxCell>

                                <ItemInfoCell>
                                    <ImgContainer>
                                        <ItemImg src={ item.main_image_url }/>
                                    </ImgContainer>
                                    <ItemInfoContainer>
                                        <ItemNameRow>
                                            <ItemName>{ item.product_name }</ItemName>
                                        </ItemNameRow>
                                        <ItemPriceRow>
                                            {
                                                !item.discount_price
                                                ? <Price>{ Number(item.price) }원</Price>
                                                : (
                                                    <>
                                                    <Price>{ Number(item.discount_price) }원</Price>
                                                    <LinedPrice>{ Number(item.price) }원</LinedPrice>
                                                    </>
                                                )
                                            }
                                        </ItemPriceRow>
                                    </ItemInfoContainer>
                                </ItemInfoCell>

                                <ItemOptionCell>
                                    <OptionInfoContainer>
                                        <span>{ item.color } / { item.size } { !item.extra_price ? null : " (+" + Number(item.extra_price) + "원)" }</span>
                                    </OptionInfoContainer>
                                    <hr/>
                                    <QuantityContainer>
                                        <QuantityBtn>-</QuantityBtn>
                                        <QuantityInput type='number' value={ item.quantity } readOnly />
                                        <QuantityBtn>+</QuantityBtn>
                                    </QuantityContainer>
                                    <OptionPriceContainer>
                                        <Price>{ optionPrice }원</Price>
                                    </OptionPriceContainer>
                                </ItemOptionCell>

                                <ItemPriceCell>
                                    <ItemPrice>{ optionPrice }원</ItemPrice>
                                    <ItemOrderBtn>주문하기</ItemOrderBtn>
                                </ItemPriceCell>
                            </Item>
                            <hr/>
                        </div>           
                    )
                })
            }

        </div>
    )
}

export default CartItem

const Table = styled.div`
    display : table;
    width : 100%;
`

const Cell = styled.div`
    display : table-cell;
    vertical-align : middle;
`

const CartItemHeader = styled(Table)``

const HeaderName = styled.p`
    margin : 0;
`

const CheckboxCell = styled(Cell)`
    width : 20px;
`

const ItemInfoCell = styled(Cell)`
    width : 50%;
`

const ItemOptionCell = styled(Cell)`
    width : 30%;
`

const ItemPriceCell = styled(Cell)`
    width : 20%;
`

const Item = styled(Table)``

const ImgContainer = styled(Cell)`
    width : 120px;
`

const Checkbox = styled.input`
    width : 15px;
    height : 15px;
`

const ItemImg = styled.img`
    width : 100px;
    height : 100px;
`

const ItemInfoContainer = styled(Cell)``

const ItemName = styled.span`
    display : table-cell;
    font-size : 17px;
    font-weight : 500;
`

const ItemNameRow = styled.div`
    heignt : 30px;
`

const ItemPriceRow = styled(Cell)`
    padding-top : 40px;
`

const Price = styled.span`
    font-size : 18px;
    font-weight : bold;
    margin-right : 7px;
`

const LinedPrice = styled.span`
    text-decoration : line-through;
`

const OptionInfoContainer = styled(Cell)``

const QuantityContainer = styled(Cell)``

const QuantityBtn = styled.button`
    width : 30px;
    height : 30px;
    border : 1px #adb5bd solid;
    background-color : white;
`

const QuantityInput = styled.input`
    width : 50px;
    height : 30px;
    border : 1px #adb5bd solid;
`

const OptionPriceContainer = styled(Cell)`
    padding-left : 15px;
`

const ItemPrice = styled.p`
    font-size : 20px;
    font-weight : bold;
    margin-bottom : 5px;
`

const ItemOrderBtn = styled.button`
    width : 100px;
    height : 35px;
    color : white;
    background-color : black;
    border : none;
    border-radius : 6px;
`