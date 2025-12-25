import { createBrowserRouter } from "react-router-dom";
import Page from "./Pages/HomePage";
import { CustomerSignupPage } from "./Pages/CustomerSignupPage";
import { CustomerDashboard } from "./Pages/CustomerDashboard";
import CustomerLoginPage from "./Pages/CustomerLoginPage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";

const routers = createBrowserRouter([
    {
        path: "/",
        element: <Page />,

    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/signup",
        element: <SignupPage />,
    },
    {
        path: "/customer/signup",
        element: <CustomerSignupPage />,
    },
    {
        path: "/customer/login",
        element: <CustomerLoginPage />,
    },
    {
        path: "/customer/dashboard",
        element: <CustomerDashboard />,
    },
]);

export default routers;