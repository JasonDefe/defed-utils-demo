export type transactionType = {
  value?: string;
  from?: string;
  to?: string;
  nonce?: number;
  gasLimit?: number;
  gasPrice?: string;
  data?: string;
  chainId?: number;
};