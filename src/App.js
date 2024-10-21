
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './Components/Home/home';
import Weatherinfopage from './Components/Weather-page/weatherinfopage';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Homepage />
    },
    {
      path: '/weatherinfopage',
      element: <Weatherinfopage />
    }
    ,
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
