import { createBrowserRouter } from "react-router-dom";
import Login from "../login/Login"
import LAYOUT from "../layout/Layout"
import MAIN from "../main/Main";
import Entreprises from "../entreprise/Entreprises";
import Contacts from "../Contacts/Contacts";
import Admin from "../admin/Admin";
import EntrepriseDetail from "../entreprise/EntrepriseDetails";
import ContactDetail from "../Contacts/ContactDetails";

export const router= createBrowserRouter([
    {
        path:"/",
        element:<Login/>,
    },
    {
        path:'/',
        element:<LAYOUT/>,
        children:[
            {
                path:'main',
                element:<MAIN/>
            },
            {
                path:'entreprises',
                children:[
                    {
                        index:true,
                        element:<Entreprises/>
                    },
                    {
                        path:':id',
                        element:<EntrepriseDetail/>
                    }
                ]
            },
            {
                path:'contacts',
                children:[
                    {
                        index:true,
                        element:<Contacts />
                    },
                    {
                        path:':id',
                        element:<ContactDetail />
                    }
                ]
            },
            {
                path:'admin',
                element:<Admin/>
            },
        ]
    }
]);