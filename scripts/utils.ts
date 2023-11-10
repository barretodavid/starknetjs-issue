import { Account, stark, ec, RpcProvider } from 'starknet';
import {promises as fs} from 'fs';
import path from 'path';
import readline from 'readline';
import 'dotenv/config';

export async function waitForEnter(message: string): Promise<void> {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(message, _ => {
            rl.close();
            resolve();
        });
    });
};

export async function importChalk() {
    return import("chalk").then( m => m.default);
}

export function connectToStarknet() {
    return new RpcProvider({
        nodeUrl: process.env.RPC_ENDPOINT as string
    });
}

export function getDeployerWallet(provider: RpcProvider) {
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY as string;
    const address = '0x011088d3cbe4289bc6750ee3a9cf35e52f4fa4e0ac9f42fb0b62e983139e135a';
    return new Account(provider, address, privateKey);
}

export function createKeyPair() {
    const privateKey = stark.randomAddress();
    const publicKey = ec.starkCurve.getStarkKey(privateKey);
    return {
        privateKey,
        publicKey,
    };
}

export async function getCompiledCode() {
    const sierraFilePath = path.join(__dirname, `../target/dev/issue_Simple.contract_class.json`);
    const casmFilePath = path.join(__dirname, `../target/dev/issue_Simple.compiled_contract_class.json`);

    const code = [sierraFilePath, casmFilePath].map(async(filePath) => {
        const file = await fs.readFile(filePath);
        return JSON.parse(file.toString('ascii'));
    });

    const [sierraCode, casmCode] = await Promise.all(code);

    return {
        sierraCode,
        casmCode,
    };
}

interface DeclareAccountConfig {
    provider: RpcProvider;
    deployer: Account;
    sierraCode: any;
    casmCode: any;
}

export async function declareContract({provider, deployer, sierraCode, casmCode}: DeclareAccountConfig) {
    const declare = await deployer.declare({
        contract: sierraCode,
        casm: casmCode,
    });
    await provider.waitForTransaction(declare.transaction_hash);
}