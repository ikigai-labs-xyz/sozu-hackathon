import { useContractWrite, usePrepareContractWrite,} from 'wagmi'
import { useNetwork } from 'wagmi'
import { contractAddresses, contractAbi } from "../../../constants/index";
import { parseEther } from 'viem'



function TVL() {

    const { chain }  = useNetwork()
    let contractAddress = ""

    if (chain && contractAddresses) {
        const chainId = String(chain.id);
        contractAddress = contractAddresses["31337"]["firewalledProtocol"]
      }

      const amount = parseEther('100000')
    
      const { config, error } = usePrepareContractWrite({
        address: contractAddress as `0x${string}`,
        abi: contractAbi,
        functionName: "deposit",
        args: [amount.toString()],
      })
      const { write } = useContractWrite(config)


  return (
    <>
      <button disabled={!write} onClick={() => write?.()}>
        Send Transaction
      </button>
      {error && (
        <div>An error occurred preparing the transaction: {error.message}</div>
      )}
    </>
  )
}

export default TVL;