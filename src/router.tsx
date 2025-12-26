import { createBrowserRouter } from "react-router-dom";
import Page from "./Pages/HomePage";
import { CustomerSignupPage } from "./Pages/CustomerSignupPage";
import { CustomerDashboard } from "./Pages/CustomerDashboard";
import { CreateCustomerPage } from "./Pages/CreateCustomerPage";
import { CustomerListPage } from "./Pages/CustomerListPage";
import { EditCustomerPage } from "./Pages/EditCustomerPage";
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
    {
        path: "/create-customer",
        element: <CreateCustomerPage />,
    },
    {
        path: "/customers",
        element: <CustomerListPage />,
    },
    {
        path: "/customers/:id/edit",
        element: <EditCustomerPage />,
    },
]);

export default routers;