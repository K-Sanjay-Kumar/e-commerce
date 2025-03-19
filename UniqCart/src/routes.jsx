import { useRoutes } from "react-router-dom"
import Home2 from "./pages/Home"
import Page404 from "./pages/Page404"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Home from "./components/home.jsx"

export default function Routes() {
    const routes = useRoutes([
        {
            path: '/',
            element: <Home />
        },
        {
            path: '/home2',
            element: <Home2 />
        },
        {
            path: '/about',
            element: <About />
        },
        {
            path: '/contact',
            element: <Contact />
        },
        {
            path: '*',
            element: <Page404 />
        }
    ])

    return routes
}