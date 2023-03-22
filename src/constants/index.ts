const TEST_ETH_RPC_URL = 'https://eth-goerli.public.blastapi.io/'

const TEST_POLYGON_RPC_URL = 'https://rpc.ankr.com/polygon_mumbai'

export const DEV_BACKEND_API_URL = 'https://dev-legency.defed.finance'

export const ETH_RPC_URL = TEST_ETH_RPC_URL

export const POLYGON_RPC_URL = TEST_POLYGON_RPC_URL

export const MAX_UINT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

export const DEFED_PROTOCOL_ADDRESS = '0x03a8A14fe399164FFb8CfED0a572bb0416414959'

export const DEFED_USDT_ADDRESS = '0x544C2007F306c1394D006193A03e13CFA541d28C'
//to 地址
export const NOVA_CONTRACT_ADDRESS = '0xeb843865B0B164bA9bcf71bBC198c7AbdBb1B6f6'

export * from './types'

const TEST_PROXY_ADMIN = '0x3c813C7E07Ab917D46Da7DFd8B59393F5BBAD305'

export const getTypeDataV2 = (message: any, chainId: string) => {
  return {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      ExecTransaction: [
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "data", type: "bytes" },
        { name: "operation", type: "uint8" },
        { name: "nonce", type: "uint256" },
      ],
    },
    primaryType: 'ExecTransaction',
    domain: {
      name: 'Defed Wallet',
      version: '1',
      chainId: chainId || '1',
      verifyingContract: TEST_PROXY_ADMIN,
    },
    message
  }
}