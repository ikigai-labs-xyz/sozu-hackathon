import { useBalance } from 'wagmi'
import { useNetwork } from 'wagmi'
import { contractAddresses} from "../../constants/index.ts";

function TVL() {

  const { chain }  = useNetwork()
    let contractAddress = ""
    let usdc = ""

    if (chain && contractAddresses) {
        const chainId =   chain.id;
        contractAddress = contractAddresses[chainId]["lendingBorrowing"]
        usdc = contractAddresses[chainId]["usdc"]
      }

  const { data, isError, isLoading } = useBalance({
    address: contractAddress as `0x${string}`,
    chainId: chain,
    token: usdc as `0x${string}`,
  })

  if (isLoading) return <div>Fetching balance…</div>
  if (isError) return <div>Error fetching balance</div>
  return (
    <>
    {data?.formatted}
    </>
  )
}

export default TVL;