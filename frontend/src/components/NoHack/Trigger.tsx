import { useContractEvent } from 'wagmi'
import { useNetwork } from 'wagmi'
import { contractAddresses, contractAbi } from "../../../constants/index";
import Popup from '../Popup';



function Trigger() {

    const [isOpen, setIsOpen] = useState(false);


    const { chain }  = useNetwork()
    let contractAddress = ""
    let firewalledProtocol = ""

    if (chain && contractAddresses) {
        const chainId = String(chain.id);
        contractAddress = contractAddresses["31337"]["turtleShellFirewall"]
        firewalledProtocol = contractAddresses["31337"]["firewalledProtocol"]
      }
    
      useContractEvent({
        address: contractAddress as `0x${string}`,
        abi: contractAbi,
        eventName: "FirewallStatusUpdate",
        listener(log) {
            console.log(log)
          },  
      })

  return (
    <>
      {isOpen && <Popup />} {firewalledProtocol}
      {error && (
        <div>An error occurred preparing the transaction: {error.message}</div>
      )}
    </>
  )
}

export default Trigger;