import { AbstractConnector } from '@web3-react/abstract-connector';
import { InjectedConnector } from '@web3-react/injected-connector';

export enum WalletType {
  INJECTED = 'injected',
  WALLET_CONNECT = 'wallet_connect',
  WALLET_LINK = 'wallet_link',
}

export const getWallet = (wallet: WalletType): AbstractConnector => {

  switch (wallet) {

    case WalletType.INJECTED:
      return new InjectedConnector({});

    default: {
      throw new Error(`unsupported wallet`);
    }
  }
};
