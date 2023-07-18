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

    <div className='selection:bg-red-500/100 selection:text-slate-100/100'>
      <RouterProvider router={router} />
    </div>

  );
}

export default App;