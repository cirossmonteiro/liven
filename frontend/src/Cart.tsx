import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchListAsync, selectProducts } from "./slices/productSlice";
import styled from "styled-components";
import { decrement, increment, selectCartProducts } from "./slices/cartSlice";

const Table = styled.table`
  thead {
    background: lightgray;
  }

  tr {
    background: #f2f2f2;
    &:nth-child(even) {
      background-color: #ddd;
    }
  }
`;

const Product = styled.div`
  display: flex;
  flex-direction: column;
  img {
    max-width: 100%;
  }

  input {
    width: 25px;
  }

  .p-1 {
    cursor: pointer;
  }
`;

const Cart = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts),
        cartProducts = useAppSelector(selectCartProducts);
  console.log(8, products);

  useEffect(() => {
    dispatch(fetchListAsync());
  }, []);

  const handleClickMinus = useCallback((id: number) => () => {
    dispatch(decrement(id));
  }, []);

  const handleClickPlus = useCallback((id: number) => () => {
    dispatch(increment(id));
  }, []);

  const cartProductsJSX = useMemo(() => cartProducts.map(cardProduct => {
    const product = products.find(p => p.id === cardProduct.id);
    return (
      <Product className="p-3 col-xs-1 col-sm-6 col-lg-4 col-xl-3" key={product?.id}>
        <span>{product?.title}</span>
        <img src={product?.image} />
        <span>US$ {product?.price.toFixed(2)}</span>
        <div className="d-flex justify-content-center">
          <span className="p-1" onClick={handleClickMinus(product?.id ?? 0)}>-</span>
          <input value={cardProduct.quantity} readOnly/>
          <span className="p-1" onClick={handleClickPlus(product?.id ?? 0)}>+</span>
        </div>
      </Product>
    );
  }), [products, cartProducts]);

  const total = useMemo(() => {
    let s = 0;
    cartProducts.forEach(cardProduct => {
      const product = products.find(p => p.id === cardProduct.id);
      s += cardProduct.quantity * (product?.price ?? 0);
    })
    return s;
  }, [products, cartProducts]);
  
  return (
    <div className="container mt-5">
      <div className="row mt-5">
        {cartProductsJSX}
      </div>
      <Table>
        <thead>
          <th className="p-2">quantity</th>
          <th className="p-2">price</th>
          <th className="p-2">subtotal</th>
        </thead>
        <tbody>
          {cartProducts.map(cardProduct => {
            const product = products.find(p => p.id === cardProduct.id);
            return (
              <tr>
                <td className="p-2">{cardProduct.quantity}</td>
                <td className="p-2">{product?.price.toFixed(2)}</td>
                <td className="p-2">{(cardProduct.quantity * (product?.price ?? 0)).toFixed(2)}</td>
              </tr>
            )
          })}
          <tr>
            <td className="p-2"></td>
            <td className="p-2">total</td>
            <td className="p-2">{total.toFixed(2)}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default Cart;