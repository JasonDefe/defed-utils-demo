import { configEnv, supportChain } from 'defedtestsdk'
import { useDepositContract, useApproveToDefed, getWithdrawSignData } from 'defedtestsdk/dist/src/hooks/useDefedProtocol'
import { useApproveToDefedProtocol, useDepositToDefedProtocol, useWithdrawFromDefed, useDefedProtocolFee } from 'defedtestsdk'
import { getAssetsBalance } from 'defedtestsdk'
import { useWeb3Context } from "./hooks/useWeb3Context";
import { WalletType } from "./constants/WalletOptions";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  useParams
} from "react-router-dom";

//0x7540781616FEc8C504E770784b8F690835aCe2A1
//测试 Polygon USDT 入金
const mockToken = {
  symbol: "USDT",
  token: "0x544C2007F306c1394D006193A03e13CFA541d28C",
  decimals: "6",
}

//测试 eth USDT Approve和deposit
const mockUSDTToken = {
  symbol: "USDT",
  token: "0x7540781616FEc8C504E770784b8F690835aCe2A1",
  decimals: "6",
}


//测试 Polygon 提现
const withdrawData = {
  message: '0x00000000000000000000000000000000000000000000000016bcf689b540100000000000000000000000000000000000000000000000000000000000768c09380000000000000000000000006a15bbef1a59b2cb25e79bd48970e54c4a1fa3cd0000000000000000000000002648d3a6d6077affcb72cac78c678e0bf376e9710000000000000000000000000000000000000000000000000000000000989680',
  signature: '0xaedaad6af01ca618f746d2fe2ec6210d9c6c00b5d5ed49388892f80fb7e493d84a2effd12e72eb53313fd1dfb2213aaee1a5b160f0c9655b44d41c3af0c3def201',
}
// sign body useParams
const withdrawTest = {
  "contract":"0x2648d3a6d6077affcb72cac78c678e0bf376e971", //ERC20合约地址
  "to":"0x6a15bbef1a59b2cb25e79bd48970e54c4a1fa3cd", //用户地址
  "value":10000000, //withdraw amount
  "deadLine":177841545799 //最后有效期，根据它来判断签名是否失效
}
//Withdraw
const withdrawParams = {
  tokenAddress: "0x544C2007F306c1394D006193A03e13CFA541d28C", //提现的代币地址
  tokenSymbol: "PolyUSDT", //提现的代币symbol
  amount: "10000000", //withdraw amount
  deadLine: "177841545799", //最后有效期，根据它来判断签名是否失效
  chainId: "80001", //提现到的网络
  toAddress: "0x6a15bbef1a59b2cb25e79bd48970e54c4a1fa3cd", //用户地址
  message: '0x00000000000000000000000000000000000000000000000016c87782cec0100000000000000000000000000000000000000000000000000000000029682ea2470000000000000000000000006a15bbef1a59b2cb25e79bd48970e54c4a1fa3cd0000000000000000000000002648d3a6d6077affcb72cac78c678e0bf376e9710000000000000000000000000000000000000000000000000000000000989680',
  signature: '0x0559a8e64bd144dc009fe34761c367196588de38c8a5795be4519adb144dfa6535776ae0cbac16411aeee8629374b71998c204dc09ed1f257005111d46b72ab900',
}

export default function Dashboard() {
  //测试 存100USDT 需要带精度
  const _amount = '100000000'
  const { currentAccount, connectWallet, chainId, signTxData } = useWeb3Context()
  // console.log('currentAccount', currentAccount)

  //配置环境
  configEnv(0)
  

  //授权相关
  const { requireApprove, getAllowance, approveForDapp, pollingApprove } = useApproveToDefedProtocol(
    mockUSDTToken.token,
    currentAccount
  )

  const { depositToDapp, getAssetBalance  } = useDepositToDefedProtocol()

  const { loading, estAmount, getBridgeAndNetworkFee } = useDefedProtocolFee()
  const { withdrawFromDapp, getWithdrawType } = useWithdrawFromDefed()
  
  const [usdtBalance, setUsdtBalance] = useState('')
  const [defeSupportChain, setDefeSupportChain] = useState(0)
  const [defeShowChain, setDefeShowChain] = useState('')
  const [whetherApprove, setWhetherApprove] = useState(false)
  const [latestAllowcap, setLatestAllowcap] = useState(0)
  const [approveStatus, setApproveStatus] = useState(false)

   
  
  // console.log('requireApprove', requireApprove)

  useEffect(() => {
    if (!currentAccount) return
    if (defeSupportChain === 0) {
      setDefeShowChain('请先点击Query Defed Support Chain按钮')
    } else if (defeSupportChain === 5) {
      setDefeShowChain('Ethereum Goerli 测试网络')
    }
  }, [defeSupportChain, currentAccount])


  const connectMetamask = () => {
    connectWallet(WalletType.INJECTED)
  }

  const connectDefedAccount = () => {
    const oauth2Url = 'https://dev.defed.finance/oauth2/?client_id=1&response_type=code&scope=read&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth'
    window.open(oauth2Url, '_blank')
  }

  const queryBalance = () => {
    if (!currentAccount) {
      // console.log('currentAccount', currentAccount)
      return
    }
    const res = getAssetBalance(mockToken.token, currentAccount)
    console.log('Polygon USDT+balance', res)
  }

  const queryL1Balance = async () => {
    const res = await getAssetBalance('0x7540781616FEc8C504E770784b8F690835aCe2A1', currentAccount)
    console.log('Metamask L1 USDT+balance', res)
    setUsdtBalance(res)
  }

  const queryDefedChain = () => {
    supportChain().then((res) => {
      console.log('supportChains', res)
      if (res.length >= 1) {
        setDefeSupportChain(res[0])
      }
      return res
    }).catch((error) => {
      throw error
    })
  }

  const queryApproveTxStatus = async () => {
    const txStatus = await pollingApprove()
    console.log('pollingApprove()+status', txStatus)
    setLatestAllowcap(txStatus.allowance)
    setApproveStatus(txStatus.requireApprove)
  }

  const handleQueryApprove = async () => {
    // await getAllowance()
    console.log('requireApprove+allownce+new', requireApprove)
    // setWhetherApprove(requireApprove)
  }

  const handleApprove = async () => {
    if (!currentAccount) return;
    approveForDapp('1', mockUSDTToken.token, 'USDT', currentAccount)
  }

  const handleDeposit = () => {
    //v1.1
    depositToDapp('1', '0x7540781616FEc8C504E770784b8F690835aCe2A1', 'USDT', '100.0000', '0x6a15bbef1a59b2cb25e79bd48970e54c4a1fa3cd')
  }

  const handleQueryDeposit = () => {
    window.open('https://mumbai.polygonscan.com/address/0x4d82e5ad6d6e30e30eec400373f909e0fdc71c11#tokentxns')
  }

  const handleQueryWithdrawalToType = async () => {
    const withdrawalTypes = await getWithdrawType('1')
    console.log('withdrawalTypes', withdrawalTypes)
  }

  const handleEstimateWithdrawalFee = async () => {
    if (!currentAccount) return;
    const estFee =  await getBridgeAndNetworkFee(
      '0xA09f65e60d796eaAf5856D61781daE3F8194bf7E', 
      '300.000000', 
      '6', 
      currentAccount
    )
    console.log('loading+estFee', loading, estFee)
  }

  const handleWithdraw = async () => {
    //v1.0
    // getWithdrawAsset(withdrawData, 80001, currentAccount).then((res) => {
    //   // success
    //   // {code: 200, 
    //   //   msg: null, 
    //   //   data: '0x22fcddfc798fb11ea8a8864b24ce50ee546563c52263d7b8cc32e8d7301cbde8'
    //   // }
    //   // failure
    //   // {
    //   //   code: 500, 
    //   //   msg: 'already claimed', 
    //   //   data: null
    //   // }
    //   console.log('res', res)
    // }).catch((err) => {
    //   // {code: 4001, message: 'MetaMask Message Signature: User denied message signature.'}
    //   console.log('err', err)
    // })


    // v1.1
    withdrawFromDapp('1', '0xA09f65e60d796eaAf5856D61781daE3F8194bf7E', 'USDT', '0x6a15bbef1a59b2cb25e79bd48970e54c4a1fa3cd', '0x97ab293f2b01eb8b283bd5e81b5adb4cbad40f41', 'false', '30.0000', '2999999999999', '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016e0f7bde9401000000000000000000000000000000000000000000000000000000002ba7def2fff0000000000000000000000006a15bbef1a59b2cb25e79bd48970e54c4a1fa3cd000000000000000000000000a09f65e60d796eaaf5856d61781dae3f8194bf7e0000000000000000000000000000000000000000000000000000000001c9c380', '0xf510b6a4884f8e4c0b5ff8d57a8538d8ebf8749ac33872d9e46b83f156c7add97495b480db64168cc8f973e0a783e8f1828528603af8afec0b8af106c3380a5c00')
    // withdrawFromDapp('1', 
    //   '0xA09f65e60d796eaAf5856D61781daE3F8194bf7E', 
    //   'USDT', 
    //   '0x6a15bbef1a59b2cb25e79bd48970e54c4a1fa3cd', 
    //   '0x97ab293f2b01eb8b283bd5e81b5adb4cbad40f41', 
    //   'false', 
    //   '30.0000', 
    //   '2999999999999', 
    //   '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016e0f7bde9401000000000000000000000000000000000000000000000000000000002ba7def2fff0000000000000000000000006a15bbef1a59b2cb25e79bd48970e54c4a1fa3cd000000000000000000000000a09f65e60d796eaaf5856d61781dae3f8194bf7e0000000000000000000000000000000000000000000000000000000001c9c380', 
    //   '0xf510b6a4884f8e4c0b5ff8d57a8538d8ebf8749ac33872d9e46b83f156c7add97495b480db64168cc8f973e0a783e8f1828528603af8afec0b8af106c3380a5c00'
    // )
  }


  const handleWithdrawFromMax= async () => {
    // v1.1
    withdrawFromDapp('1', '0xA09f65e60d796eaAf5856D61781daE3F8194bf7E', 'USDT', '0x6a15bbef1a59b2cb25e79bd48970e54c4a1fa3cd', '0x97ab293f2b01eb8b283bd5e81b5adb4cbad40f41', 'true', '30.0000', '2999999666666', '0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000016e0fab246801000000000000000000000000000000000000000000000000000000002ba7dea19ea00000000000000000000000097ab293f2b01eb8b283bd5e81b5adb4cbad40f41000000000000000000000000a09f65e60d796eaaf5856d61781dae3f8194bf7e0000000000000000000000000000000000000000000000000000000001c9c380', '0xcc0a62347e532ea358b6d6cd66b8fbb3f8929249dbc3974b4ca04953507febd700296a4466b62df5d74ac5a41d67a3aca1e2f490b9b712fb68956b06d124f7cb00')
    // withdrawFromDapp('1', 
    //   '0xA09f65e60d796eaAf5856D61781daE3F8194bf7E', 
    //   'USDT', 
    //   '0x6a15bbef1a59b2cb25e79bd48970e54c4a1fa3cd', 
    //   '0x97ab293f2b01eb8b283bd5e81b5adb4cbad40f41', 
    //   'true', 
    //   '30.0000', 
    //   '2999999666666', 
    //   '0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000016e0fab246801000000000000000000000000000000000000000000000000000000002ba7dea19ea00000000000000000000000097ab293f2b01eb8b283bd5e81b5adb4cbad40f41000000000000000000000000a09f65e60d796eaaf5856d61781dae3f8194bf7e0000000000000000000000000000000000000000000000000000000001c9c380', 
    //   '0xcc0a62347e532ea358b6d6cd66b8fbb3f8929249dbc3974b4ca04953507febd700296a4466b62df5d74ac5a41d67a3aca1e2f490b9b712fb68956b06d124f7cb00'
    // )
  }

  return (
    <div className="Dashboard">
      <img src='/logos/novamax.png' alt='novamaxlogo' />
      <br />
      <br />
      <button onClick={connectMetamask}>Connect DEFED</button>
      <div>user address:{currentAccount}</div>
      <br />
      <button onClick={queryBalance}>Query USDT Balance</button>
      <br />
      <br />
      <button onClick={queryDefedChain}>Query Defed Support Chain</button>
      <br />
      <div>Defed chain dev: {defeShowChain}</div>
      <br />
      <br />
      <button onClick={handleQueryApprove}>查询用户是否需要Approve USDT</button>
      <br />
      <div>当前用户{currentAccount}: {!requireApprove ? '已授权USDT' : '未授权USDT'}</div>
      <br />
      <br />
      <button onClick={handleApprove}>Approve</button>
      <br />
      <br />
      <button onClick={queryApproveTxStatus}>查询最新的Approve状态</button>
      <br />
      <div>当前用户Allow: {latestAllowcap}, Approve状态:{!approveStatus ? 'Success' : 'fail'}</div>
      <br />
      <br />
      <br />
      <button onClick={handleDeposit}>Deposit To Novamax</button>
      <br />
      <br />
      <button onClick={handleQueryDeposit}>Query DepositToNovamax Transaction Status</button>
      <br />
      <br />
      <button onClick={handleQueryWithdrawalToType}>Query From Novamax withdrawal to types</button>
      <br />
      <br />
      <button onClick={handleEstimateWithdrawalFee}>Estimate From Novamax withdrawal Fee</button>
      <br />
      <br />
      <button onClick={handleWithdraw}>Withdraw 30U To Metamask wallet</button>
      <br />
      <br />
      <button onClick={handleWithdrawFromMax}>Withdraw 30USDT To DEFED saving</button>
        {/* <div>user usdt balance:{usdtBalance}</div> */}
    </div>
  );
}


