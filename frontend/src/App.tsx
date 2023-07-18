import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainPage from './MainPage';
import HackPage from './HackPage';

import "./polyfills";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

function App() {
  const { chains, provider } = configureChains(
    [mainnet, goerli],
    [infuraProvider({ apiKey: "51282d8221e64ba0a0b0e9dd604ea35a" }), publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "1inch Fusion Dashboard",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });



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


    <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>

          <div className='selection:bg-red-500/100 selection:text-slate-100/100'>
            <RouterProvider router={router} />
          </div>  
       
          </RainbowKitProvider>
    </WagmiConfig>

  );
}

export default App;