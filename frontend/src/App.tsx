import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainPage from './Mainpage';
function App() {



  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage/>,
    },
    {
      path: "/hack",
    },
  ]);


  return (

    <div className='border selection:bg-blue-700/100 selection:text-orange-500/100'>
      <RouterProvider router={router} />
    </div>

  );
}

export default App;
