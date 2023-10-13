import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchListAsync, selectProducts } from "./slices/productSlice";
import styled from "styled-components";
import { increment, selectCartProducts } from "./slices/cartSlice";
import { Button } from "antd";

const Product = styled.div`
  display: flex;
  flex-direction: column;
  img {
    max-width: 100%;
  }
`;

const Products = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts),
        cartProducts = useAppSelector(selectCartProducts);
  console.log(8, products, cartProducts);

  useEffect(() => {
    dispatch(fetchListAsync());
  }, []);

  const handleClick = useCallback((id: number) => () => {
    console.log(27, id);
    dispatch(increment(id));
  }, []);

  const productsJSX = useMemo(() => products.map(product => {
    const cartProduct = cartProducts.find(cardProduct => product.id === cardProduct.id);
    return (
      <Product className="p-3 col-xs-1 col-sm-6 col-lg-4 col-xl-3" key={product.id}>
        {cartProduct?.quantity && <span>{cartProduct?.quantity}</span>}
        <span>{product.title}</span>
        <img src={product.image} />
        <Button onClick={handleClick(product.id)}>add to cart</Button>
      </Product>
    );
  }), [products, cartProducts]);
  
  return (
    <div className="container mt-5">
      <div className="row mt-5">
        {productsJSX}
      </div>
    </div>
  );
}

export default Products;