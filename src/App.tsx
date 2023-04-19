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

//0x7540781616FEc8C504E770784b8F690835aCe2A1
//测试 Polygon USDT 入金
const mockToken = {
  symbol: "USDT",
  token: "0x544C2007F306c1394D006193A03e13CFA541d28C",
  decimals: "6",
}


//测试 Polygon 提现
const withdrawData = {
  message: '0x00000000000000000000000000000000000000000000000016bcf689b540100000000000000000000000000000000000000000000000000000000000768c09380000000000000000000000006a15bbef1a59b2cb25e79bd48970e54c4a1fa3cd0000000000000000000000002648d3a6d6077affcb72cac78c678e0bf376e9710000000000000000000000000000000000000000000000000000000000989680',
  signature: '0xaedaad6af01ca618f746d2fe2ec6210d9c6c00b5d5ed49388892f80fb7e493d84a2effd12e72eb53313fd1dfb2213aaee1a5b160f0c9655b44d41c3af0c3def201',
}

export default function App() {
  //测试 存100USDT 需要带精度
  const _amount = '100000000'
  const { currentAccount, connectWallet, chainId, signTxData } = useWeb3Context()
  console.log('currentAccount', currentAccount)

  configEnv(1)
  

  const { requireApprove, getAllowance, approve } = useApproveToDefedProtocol(mockToken.token,
    currentAccount
  )
  const { getAssetBalance, depositERC20, depositETH  } = useDepositToDefedProtocol(mockToken.token, _amount, '0xeb843865B0B164bA9bcf71bBC198c7AbdBb1B6f6', currentAccount)

  const { getWithdrawAsset } = useWithdrawFromDefed()
  
  getAllowance()
   
  
  console.log('requireApprove', requireApprove)

  const queryBalance = () => {
    if (!currentAccount) {
      console.log('currentAccount', currentAccount)
      return
    }
    const res = getAssetBalance(mockToken.token, currentAccount)
    console.log('Polygon USDT+balance', res)
  }

  const queryDefedChain = () => {
    supportChain().then((res) => {
      console.log('supportChains', res)
      return res
    }).catch((error) => {
      throw error
    })
  }

  const handleDeposit = () => {
    // getAssetBalance('0x544C2007F306c1394D006193A03e13CFA541d28C').then((res) => {
    //   //返回bignumber result
    //   console.log('res', res)
    // }).catch((error) => {
    //   console.log('error', error)
    // })

    depositERC20().then((res) => {
      console.log('novamax+depositERC20', res.hash)
      return res.hash
    }).catch((error) => {
      throw error
    })
  }

  const handleApprove = () => {
    approve().then(async (res) => {
      console.log('approve+tx', res)
      // await res.wait()
      await getAllowance()
    }).catch((error) => {
      throw error
    })
  }

  
  const handleWithdraw = async () => {
    getWithdrawAsset(withdrawData, 80001, currentAccount).then((res) => {
      // success
      // {code: 200, 
      //   msg: null, 
      //   data: '0x22fcddfc798fb11ea8a8864b24ce50ee546563c52263d7b8cc32e8d7301cbde8'
      // }
      // failure
      // {
      //   code: 500, 
      //   msg: 'already claimed', 
      //   data: null
      // }
      console.log('res', res)
    }).catch((err) => {
      // {code: 4001, message: 'MetaMask Message Signature: User denied message signature.'}
      console.log('err', err)
    })
  }

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


