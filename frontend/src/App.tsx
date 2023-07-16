import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import './styles/Animations.css'
import MainPage from './MainPage';
import HackPage from './HackPage';
function App() {



  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage/>,
    },
    {
      path: "/hack",
      element: <HackPage/>,
    },
  ]);


  return (

    <div className='border selection:bg-blue-700/100 selection:text-orange-500/100'>
      <RouterProvider router={router} />
    </div>

  );
}

export default App;