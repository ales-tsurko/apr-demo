import { ApiPromise, WsProvider } from "@polkadot/api";

async function main() {
    const [, , userStake] = process.argv;

    if (!userStake) {
        console.error("to calculate APR provide user' stake amount");
        process.exit(1);
    }

    const wsProvider = new WsProvider('wss://testnet-rpc.atleta.network:9944');
    const api = await ApiPromise.create({ provider: wsProvider });

    // get the previous era number
    const era = (await api.query.staking.activeEra()).unwrap().index - 1;
    const totalStake = await api.query.staking.erasTotalStake(era);
    const totalRewards = await api.query.staking.erasValidatorReward(era);
    const erasPerDay = 24; // 1 era per hour, 24 hours per day
    const rewardRatePerDay = totalRewards / totalStake * erasPerDay;
    const rewardRatePerYear = rewardRatePerDay * 365;
    console.log(`Estimated reward rate per day is: ${rewardRatePerDay} (${(rewardRatePerDay * 100).toFixed(2)}%, ${userStake * rewardRatePerDay} ATLA)`);
    console.log(`Estimated reward rate per year is: ${rewardRatePerYear} (${(rewardRatePerYear * 100).toFixed(2)}%, ${userStake * rewardRatePerYear} ATLA)`);
}

main().catch(console.error).finally(() => process.exit());
