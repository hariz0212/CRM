
import { RouterProvider } from 'react-router-dom';
import { router } from './component/router/browser_router';
import { LoginProvider } from './component/login/LoginContext';

function App() {


  return (
    <>
      <LoginProvider>
      <RouterProvider router={router} />
      </LoginProvider>
    </>
  )
}

export default App;
