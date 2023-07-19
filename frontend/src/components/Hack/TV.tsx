import { contractAddresses, erc20Abi } from "../../../constants/index";


import { useContractRead, contractRead } from 'wagmi'
 
function TVL() {
const { data, isError, isLoading } = useContractRead({
    address: contractAddresses["31337"]["lendingBorrowing"],
    abi: erc20Abi,
    functionName: 'getTVL',
    watch: true,
    chainId: 31337,
  })

  const { data, error } = contractRead

    if (isError) return <div>An error occurred: {error.message}</div>
    if (isLoading) return <div>Loading…</div>
    return (
        <>
        {data?.formatted} {data?.symbol}
        </>
    )
}


export default TVL;