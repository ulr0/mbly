import axios from 'axios';
import { useState, useEffect, useRef, forwardRef } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import './ProductRegistration.css';

function ProductRegistration(){

    const API_BASE_URL = process.env.REACT_APP_API_ROOT;

    const authState = useSelector((state) => state);

    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [sellers, setSellers] = useState([]);

    useEffect(()=>{
        axios.get(`${API_BASE_URL}/categories`)
        .then((response)=>{
            if ( response != null && response.data != null ) {
                setCategories(response.data.result)
            }
        })
        .catch((error)=>{
            console.log(error);
        })
        axios.get(`${API_BASE_URL}/colors`)
        .then((response)=>{
            if ( response != null && response.data != null ) {
                setColors(response.data.result)
            }
        })
        .catch((error)=>{
            console.log(error);
        })
        axios.get(`${API_BASE_URL}/sizes`)
        .then((response)=>{
            if ( response != null && response.data != null ) {
                setSizes(response.data.result)
            }
        })
        .catch((error)=>{
            console.log(error);
        })
        if ( authState.account_type === 'master' ) {
            axios.get(`${API_BASE_URL}/sellers`)
            .then((response)=>{
                if ( response != null && response.data != null ) {
                    setSellers(response.data.result)
                }
            })
            .catch((error)=>{
                console.log(error);
            })
        }
    },[])
    
    const [sellerId, setSellerId] = useState('');
    const subcategorySelect = useRef();
    const [subcategories, setSubcategories] = useState([]);
    const [subcategoryId, setSubcategoryId] = useState();

    const onChangeSeller = (e) => {
        const target = e.target.value;
        if ( target === 'seller' ) {
            setSellerId('');
        } else {
            setSellerId(sellers[target].id);
        }
    }

    const onChangeCategory = (e) => {
        const category = categories[e.target.value];
        setSubcategories(category.subcategories);
        subcategorySelect.current.value = 'subcategory';
        setSubcategoryId('');
    }
    const onChangeSubcategory = (e) => {
        const target = e.target.value;
        if ( target === 'subcategory' ) {
            setSubcategoryId('');
        } else {
            setSubcategoryId(e.target.value);
        }
    }

    const [productInfo, setProductInfo] = useState({ name : '', price : '', discount_price : '' });
    
    const onChangeProductInfo = (e) => {
        const { name, value} = e.target;
        setProductInfo({ ...productInfo, [name] : value });
    }

    const [mainImg, setMainImg] = useState();
    const onChangeMainImg = (e) => {
        setMainImg(e.target.files[0]);
    }

    const [detailImgs, setDetailImgs] = useState();
    const onChangeDetailImgs = (e) => {
        setDetailImgs(e.target.files);
    }

    const [option, setOption] = useState({ color : '', color_name : '', size : '', size_name : '', extra_price : '' })
    const [options, setOptions] = useState([]);

    const onChangeColor = (e) => {
        const target = e.target.value;
        if (target === 'color') {
            const copy = { ...option };
            copy.color = '';
            copy.color_name = '';
            setOption(copy);
        } else {
            const copy = { ...option };
            copy.color = colors[target].id;
            copy.color_name = colors[target].name;
            setOption(copy);
        }
    }
    const onChangeSize = (e) => {
        const target = e.target.value;
        if (target === 'size') {
            const copy = { ...option };
            copy.size = '';
            copy.size_name = '';
            setOption(copy);
        } else {
            const copy = { ...option };
            copy.size = sizes[target].id;
            copy.size_name = sizes[target].name;
            setOption(copy);
        }
    }
    const onChangeExtraPrice = (e) => {
        const copy = { ...option };
        copy.extra_price = e.target.value;
        setOption(copy);
    }
    
    const onClickOptionAdd = () => {
        const a = options.find((e)=>e.color==option.color && e.size == option.size)
        if ( !option.color || !option.size ){
            alert('??????, ???????????? ??????????????????.');
        } else if ( !a ){
            setOptions( [ ...options, option ] )
        } else {
            alert('?????? ???????????? ?????? ???????????????.')
        }
    }
    const onClickOptionDelete = (i) => {
        const copy = [ ...options ];
        copy.splice(i, 1);
        setOptions(copy);
    }

    const onClickRegistration = () => {
        const formData = new FormData();
        if ( !subcategoryId ) {
            alert('??????????????? ??????????????????.')
        } else if ( authState.account_type === 'master' && !sellerId ) {
            alert('????????? ??????????????????.')
        } else if ( !productInfo.name || !productInfo.price ) {
            alert('???????????? ????????? ??????????????????.')
        } else if ( !mainImg ) {
            alert('??????????????? ??????????????????.')
        } else if ( !detailImgs ) {
            alert('??????????????? ??????????????????.')
        } else if ( options.length === 0 ) {
            alert('?????? ????????? ??????????????????.')
        } else if ( productInfo.price && productInfo.discount_price && productInfo.price <= productInfo.discount_price ) {
            alert('??????????????? ???????????? ??? ??? ????????????.')
        } else if ( productInfo.price <= 0 || ( productInfo.discount_price && productInfo.discount_price <= 0 )) {
            alert('????????? 0?????? ??? ?????? ??????????????????.')
        } else {
            const data = {
                product_subcategory : subcategoryId,
                producthistory_set : [productInfo],
                productoption_set : options,
                seller : sellerId
            }
            formData.append('data', JSON.stringify(data))
            formData.append('main_image', mainImg)
            Array.from(detailImgs).forEach(img=>formData.append('detail_images', img))
            
            axios.post(`${API_BASE_URL}/admin/products`, formData, {
                headers : {
                    Authorization : localStorage.getItem('access_token')
                }
            })
            .then(()=>{
                alert('????????? ?????????????????????.')
                window.location.reload();
            })
            .catch((error)=>{
                console.log(error);
            })
        }
    }

    return (
        <Form className='registrationForm'>
            {
                authState.account_type === 'master'
                ? ( <Form.Select onChange={onChangeSeller}>
                        <option value='seller'>??????</option>
                        {
                            sellers.map((a, i)=>{
                                return <option key={i} value={i}>{a.name}</option>
                            })
                        }
                    </Form.Select> )
                : null
            }
            <Row>
                <Col>
                    <Form.Select onChange={onChangeCategory}>
                        <option value='category'>1???????????????</option>
                        {
                            categories.map((a, i)=>{
                                return <option key={i} value={i}>{a.name}</option>
                            })
                        }
                    </Form.Select>
                </Col>
                <Col>
                    <Subcategory subcategories={subcategories} onChangeSubcategory={onChangeSubcategory} ref={subcategorySelect}/>
                </Col>
            </Row>

            <Form.Group>
                <Form.Label>?????????</Form.Label>
                <Form.Control type='text' name='name' onChange={onChangeProductInfo}/>
            </Form.Group>
            
            <Form.Group>
                <Form.Label>??????</Form.Label>
                <Form.Control type='text' name='price' onChange={onChangeProductInfo}/>
            </Form.Group>
            
            <Form.Group>
                <Form.Label>????????????</Form.Label>
                <Form.Control type='text' name='discount_price' onChange={onChangeProductInfo}/>
            </Form.Group>

            <Form.Group>
                <Form.Label>?????? ?????? ??????</Form.Label>
                <Form.Control type="file" onChange={onChangeMainImg}/>
            </Form.Group>

            <Form.Group>
                <Form.Label>?????? ?????? ??????</Form.Label>
                <Form.Control type="file" multiple onChange={onChangeDetailImgs}/>
            </Form.Group>

            <Row className='productOption'>
                <Col>
                    <Form.Select onChange={onChangeColor}>
                        <option value='color'>??????</option>
                        {
                            colors.map((a, i)=>{
                                return <option key={i} value={i}>{a.name}</option>
                            })
                        }
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Select onChange={onChangeSize}>
                        <option value='size'>?????????</option>
                        {
                            sizes.map((a, i)=>{
                                return <option key={i} value={i}>{a.name}</option>
                            })
                        }
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Control type='text' placeholder='?????? ?????? ??????' onChange={onChangeExtraPrice}/>
                    </Form.Group>
                </Col>
                <Col xs={2}>
                    <Button variant="success" size="sm" onClick={onClickOptionAdd}>?????? ??????</Button>
                </Col>
            </Row>
            {
                options.map((a,i)=>{
                    return (
                    <OptionItem key={i}>?????? {i+1} : {a.color_name} / {a.size_name} ?????? ?????? : { !a.extra_price ? 0 : a.extra_price }
                        <Button onClick={()=>{
                            onClickOptionDelete(i)
                        }} style={{ marginLeft : 'auto' }} variant="danger" size='sm'>X</Button>
                    </OptionItem>
                )
            })
            }
            <Button variant="primary" onClick={onClickRegistration}>?????? ??????</Button>
            

        </Form>
    )
}

const Subcategory = forwardRef((props, ref)=>{

    return(
        <Form.Select ref={ref} onChange={props.onChangeSubcategory}>
            <option value='subcategory'>2???????????????</option>
            {
                props.subcategories.map((a, i)=>{
                    return <option key={i} value={a.id}>{a.name}</option>
                })
            }
        </Form.Select>
    )

})

const OptionItem = styled.p`
    display : flex`

export default ProductRegistration