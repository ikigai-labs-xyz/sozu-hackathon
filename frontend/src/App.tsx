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
import { Chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, goerli,} from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

function App() {

  const mantleTestnet: Chain = {
    id: 5001,
    name: 'Mantle Testnet',
    network: 'mantleTestnet',
    iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/27075.png',
    iconBackground: '#000000',
    nativeCurrency: {
      decimals: 18,
      name: 'Mantle Testnet Token',
      symbol: 'MNT-T',
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.ankr.com/mantle_testnet'],
      },
      public: {
        http: [],
        webSocket: undefined
      }
    },
    blockExplorers: {
      default: { name: 'Testnet Explorer', url: 'https://explorer.testnet.mantle.xyz/' },
      etherscan: { name: 'SnowTrace', url: 'https://snowtrace.io' },
    },
    testnet: true,
  };


  const { chains, provider } = configureChains(
    [mainnet, goerli, mantleTestnet],
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