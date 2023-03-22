export type NetworkConfig = {
  name: string;
  privateJsonRPCUrl?: string; // private rpc will be used for rpc queries inside the client. normally has private api key and better rate
  privateJsonRPCWSUrl?: string;
  publicJsonRPCUrl: readonly string[]; // public rpc used if not private found, and used to add specific network to wallets if user don't have them. Normally with slow rates
  publicJsonRPCWSUrl?: string;

  /**
   * When this is set withdrawals will automatically be unwrapped
   */
  wrappedBaseAssetSymbol?: string;
  baseAssetSymbol: string;
  // needed for configuring the chain on metemask when it doesn't exist yet
  baseAssetDecimals: number;
  // usdMarket?: boolean;
  // function returning a link to etherscan et al
  explorerLink: string;
  // set this to show faucets and similar
  isTestnet?: boolean;
};

export enum ChainId {
  mainnet = 1,
  goerli = 5,
  polygon = 137,
  mumbai = 80001,
}

export const ChainIdToNetwork: Record<number, string> = {
  1: 'mainnet',
  5: 'goerli',
  137: 'polygon',
  80001: 'mumbai',
};

export const networkConfigs = {
  [ChainId.goerli]: {
    name: 'Ethereum Görli',
    publicJsonRPCUrl: [
      'https://eth-goerli.public.blastapi.io',
      'https://rpc.ankr.com/eth_goerli',
      'https://goerli.prylabs.net',
    ],
    publicJsonRPCWSUrl: 'wss://eth-goerli.public.blastapi.io',
    baseAssetSymbol: 'ETH',
    wrappedBaseAssetSymbol: 'WETH',
    baseAssetDecimals: 18,
    explorerLink: 'https://goerli.etherscan.io',
    isTestnet: true,
  },
  [ChainId.mainnet]: {
    name: 'Ethereum',
    publicJsonRPCUrl: [
      'https://rpc.ankr.com/eth',
      'https://rpc.flashbots.net',
      'https://eth-mainnet.public.blastapi.io',
      'https://cloudflare-eth.com/v1/mainnet',
    ],
    publicJsonRPCWSUrl: 'wss://eth-mainnet.alchemyapi.io/v2/demo',
    baseAssetSymbol: 'ETH',
    wrappedBaseAssetSymbol: 'WETH',
    baseAssetDecimals: 18,
    explorerLink: 'https://etherscan.io',
  },
  [ChainId.polygon]: {
    name: 'Polygon POS',
    privateJsonRPCUrl: 'https://poly-mainnet.gateway.pokt.network/v1/lb/62b3314e123e6f00397f19ca',
    publicJsonRPCUrl: [
      'https://polygon-rpc.com',
      'https://polygon-mainnet.public.blastapi.io',
      'https://rpc-mainnet.matic.quiknode.pro',
    ],
    publicJsonRPCWSUrl: 'wss://polygon-rpc.com',
    baseAssetSymbol: 'MATIC',
    wrappedBaseAssetSymbol: 'WMATIC',
    baseAssetDecimals: 18,
    explorerLink: 'https://polygonscan.com',
  },
  [ChainId.mumbai]: {
    name: 'Mumbai',
    publicJsonRPCUrl: [
      'https://rpc.ankr.com/polygon_mumbai',
      'https://rpc-mumbai.maticvigil.com',
      'https://polygon-testnet.public.blastapi.io',
      'https://polygon-mumbai.g.alchemy.com/v2/demo',
    ],
    publicJsonRPCWSUrl: 'wss://polygon-mumbai.g.alchemy.com/v2/demo',
    baseAssetSymbol: 'MATIC',
    wrappedBaseAssetSymbol: 'WMATIC',
    baseAssetDecimals: 18,
    explorerLink: 'https://explorer-mumbai.maticvigil.com',
    isTestnet: true,
  },
} as const;
