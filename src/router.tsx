// import path from "path";
import { createBrowserRouter } from "react-router-dom";
import { LoginForm } from "./components/login-form";
// import { Pages } from "./Pages/HomePage";
import Page from "./Pages/HomePage";
// import { SignupForm } from "./Pages/Signup_Registerpage";
import { SignupForm } from "./components/signup-form";

const routers = createBrowserRouter([
    {
        path: "/",
        element: <Page />,

    },
    {
        path: "/login",
        element: <LoginForm />,
    },
    {
        path: "/signup",
        element: <SignupForm />,
    },
]);

export default routers;