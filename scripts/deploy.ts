import { 
    hash,
    LibraryError,
} from 'starknet';

import {
    importChalk,
    connectToStarknet,
    getDeployerWallet,
    getCompiledCode,
    declareContract,
} from './utils';

async function main() {
    const chalk = await importChalk();
    const provider = connectToStarknet();
    const deployer = getDeployerWallet(provider);

    let sierraCode, casmCode;
    try {
        ({ sierraCode, casmCode } = await getCompiledCode());
    } catch (error: any) {
        console.log(chalk.red('Failed to read contract files'));
        process.exit(1);
    }

    try {
        console.log('Declaring contract...');
        await declareContract({ provider, deployer, sierraCode, casmCode });
        console.log(chalk.green('Contract successfully declared'));
    } catch(error: any) {
        if(error instanceof LibraryError && error.message.includes('already declared')) {
            console.log(chalk.yellow('Contract class already declared'));
        } else {
            console.log(chalk.red('Declare transaction failed'));
            console.log(error);
            process.exit(1);
        }
    }

    const classHash = hash.computeContractClassHash(sierraCode);
    console.log(`Class Hash = ${chalk.blue(classHash)}`);
}

main();