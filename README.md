# StarknetJS / RPC Issue

This repo is just a sample code to reproduce an issue when trying to declare a contract that has already been declared on testnet using `starknetjs`. The script fails with a `LibraryError: -32603: Internal error` when just a few days ago failed with a properly formatted error message describing that an already declared contract cannot be redeclared.

To run the script you have to create a `.env` file in the root folder of the project and add two keys:

```
DEPLOYER_PRIVATE_KEY=<YOUR_FUNDED_TESTNET_WALLET_PK>
RPC_ENDPOINT=<YOUR_RPC_URL_FOR_STARKNET_TESTNET>
```

The Deployer wallet is needed to pay for the gas fees associated with declaring and deploying a contract. The RPC endpoint can be an Infura or Alchemy URL.

You'll need to have NodeJS 20 or higher and install the script dependencies with `npm install`.

Run the script with `npm run deploy` and see it fail.