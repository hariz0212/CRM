import { Outlet } from "react-router-dom"
import NAV from "./nav"
function Layout(){
    return(
        <div>
            <NAV/>
            <Outlet/>
        </div>
    )
}

export default Layout;