import { useEffect } from "react";
import { fetchListAsync, selectProducts } from "./slices/productSlice";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { Link, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Products from "./Products";
import styled from "styled-components";
import Cart from "./Cart";

// routing reference: https://github.com/remix-run/react-router/blob/dev/examples/modal-route-with-outlet/src/App.tsx

const Navigation = styled.div`
  position: fixed;
  background: white;
`;


const Layout = () => {
  return (
    <div className="h-100 d-flex flex-column">
      <Navigation className="w-100 p-5 d-flex">
        <Link to="/">Home</Link>
        <Link to="/products" className="ms-3">Products</Link>
        <Link to="/cart" className="ms-3">Cart</Link>
      </Navigation>
      <div className="mt-5 pt-5">
        <Outlet />
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1 className="m-5">Welcome to my e-commerce!</h1>
      },
      {
        path: "/products",
        element: <Products />
      },
      {
        path: "/cart",
        element: <Cart />
      }
    ]
  }
]);

export default () => {
  return <RouterProvider router={router} />;
}
