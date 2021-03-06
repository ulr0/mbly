import { useEffect, useState } from "react";
import { useHistory  } from "react-router-dom";
import axios from "axios";
import './ProductListPage.css';
import PaginationBtns from '../../components/PaginationBtns'

function ProductList (){
    
    const API_BASE_URL = process.env.REACT_APP_API_ROOT;

    const [products, setProducts] = useState([]);
    const [pages, setPages] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 8;

    const [search, setSearch] = useState('');
    const history = useHistory();
    const style = { cursor : 'pointer' }

    const onChangeSearch = (e) => {
        setSearch(e.target.value);
    }
    const onSubmitSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);

        axios.get(`${API_BASE_URL}/products/list`, { params : { page : currentPage, search_word : search } })
        .then((response)=>{
            const productList = response.data.product_lists;
            setProducts(productList);
            const productCounts = response.data.product_counts;
            setPages(Math.ceil(productCounts/limit));
        })
    }

    useEffect(()=>{
        axios.get(`${API_BASE_URL}/products/list`, { params : { page : currentPage, search_word : search } })
        .then((response)=>{
            const productList = response.data.product_lists;
            setProducts(productList);
            const productCounts = response.data.product_counts;
            setPages(Math.ceil(productCounts/limit));
        })
    }, [currentPage])

    const onClickProductImage = (productId) => {
        history.push(`/products/${productId}`);
    }

    return(
        <>
        
        <div className="container">
            <div className="row">
            <div className="inputContainer">
                <form onSubmit={onSubmitSearch}>
                    <input placeholder="Search..." onChange={onChangeSearch}/>
                </form>
            </div>
                {
                    products.map((product, i)=>{
                        return (
                            <div key={i} className="col-3">
                                <img style={style} src={product.main_image_url} onClick={()=>{onClickProductImage(product.id)}}/>
                                <h6>{product.product_name}</h6>
                                <p>{Number(product.price)}???</p>
                            </div>
                        )
                    })
                }
            </div>
            <PaginationBtns pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
        </div>
        </>
    )
}

export default ProductList