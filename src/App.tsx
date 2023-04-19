import { configEnv, login, supportChain } from 'defedtestsdk'
import { useDepositContract, useApproveToDefed, getWithdrawSignData } from 'defedtestsdk/dist/src/hooks/useDefedProtocol'
import { useApproveToDefedProtocol, useDepositToDefedProtocol, useWithdrawFromDefed } from 'defedtestsdk'
import { getAssetsBalance } from 'defedtestsdk'
import { useWeb3Context } from "./hooks/useWeb3Context";
import { WalletType } from "./constants/WalletOptions";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
 
import Dashboard from './Dashboard';
import Auth from './auth';



export default function App() {
  

  return (
    <Router>
      <div>
        {/* <nav>
          <ul>
            <li>
              <Link to="/">App</Link>
            </li>
            <li>
              <Link to="/auth">auth</Link>
            </li>
          </ul>
        </nav> */}
        <Routes>
          <Route path="/" element={<Dashboard />}>
            {/* <Dashboard /> */}
          </Route>
          <Route path="/auth" element={<Auth />}>
            {/* <Auth /> */}
          </Route>
        </Routes>
      </div>
    </Router>
    
  );
}


