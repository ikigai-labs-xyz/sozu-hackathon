import React, { useEffect, useRef, useState} from "react"
import "./hundredMenu.css"
import { Spinner } from "../../assets/huIcons/huIcons"
import { Network } from "../../networks"
import { BigNumber } from "../../bigNumber"
import { useUiContext } from "../../Types/uiContext"
import { useGlobalContext } from "../../Types/globalContext"
import { Contract } from 'ethers'
import { useWeb3React } from "@web3-react/core"
import { ExecuteWithExtraGasLimit } from "../../Classes/TransactionHelper"
import { COMPTROLLER_ABI, HUNDRED_ABI, MINTER_ABI, VOTING_ESCROW_ABI } from "../../abi"
import { useHundredDataContext } from "../../Types/hundredDataContext"
import { UpdateTypeEnum } from "../../Hundred/Data/hundredData"

const HundredMenu: React.FC = () => {
    const mounted = useRef<boolean>(false)
    
    const { library, account } = useWeb3React()
    const {hndBalance, hndEarned, hundredBalance, hndRewards, tokenRewards, rewardTokenSymbol, vehndBalance, gaugeAddresses, updateMarket} = useHundredDataContext()

    const { setSpinnerVisible, claimLegacyHnd, setClaimLegacyHnd, claimHnd, setClaimHnd, claimLockHnd, setClaimLockHnd, toastErrorMessage, toastSuccessMessage} = useUiContext()
    const {network, hndPrice} = useGlobalContext()

    const networkRef = useRef<Network | null>(null)
    networkRef.current = network

    useEffect(() => {
      mounted.current = true

      return(() => {
        mounted.current = false
      })
    })

    useEffect(() => {
        networkRef.current = {...network} as any
    }, [network])

    const [tvl, setTvl] = useState<BigNumber | null>(null)

    useEffect(() => {
        if(networkRef.current  && networkRef.current.hundredLiquidityPoolAddress && hundredBalance){
            if(networkRef.current.liquidity){
                const temp = +hundredBalance.toString() / (networkRef.current.hndPoolPercent ? networkRef.current.hndPoolPercent : 1) *hndPrice
                setTvl(BigNumber.parseValue(temp.noExponents()))
            }
            else{
                const temp = +hundredBalance.toString() * 2 * hndPrice
                setTvl(BigNumber.parseValue(temp.noExponents()))
            }
        }
        else setTvl(null)
    }, [hndPrice, hundredBalance])

    const handleCollect = async (): Promise<void> => {
        if(library && network && account){
          try{
            setClaimLegacyHnd(true)
            setSpinnerVisible(true)

            const signer = library.getSigner()
            const comptroller = new Contract(network.unitrollerAddress, COMPTROLLER_ABI, signer)
            const tx = await ExecuteWithExtraGasLimit(comptroller, "claimComp", [account], 0)

            setSpinnerVisible(false)
            const receipt = await tx.wait()
            
            console.log(receipt)
            if(receipt.status === 1){
              toastSuccessMessage("Transaction completed successfully.\nUpdating contracts")
              await updateMarket(null, UpdateTypeEnum.ClaimHndLegacy)
            }
            else if(receipt.message){
              toastErrorMessage(`${receipt.message}`);  
            }
          }
          catch(error: any){
            console.log(error)
            toastErrorMessage(`${error?.message.replace(".", "")} on Hundred Claim Legacy`)
          }
          finally{
            setClaimLegacyHnd(false)
            setSpinnerVisible(false)
          }
        }
      }

      const handleClaimHnd = async (): Promise<void> => {
        if(library && network){
          try{
            setClaimHnd(true)
            setSpinnerVisible(true)
    
            const signer = library.getSigner()
            let mintAddress = ''
            network.lendly ? network.minterAddressLendly ? mintAddress = network.minterAddressLendly : null: null;
            network.minterAddress ? mintAddress = network.minterAddress : null; 
    
            const minter = new Contract(mintAddress, MINTER_ABI, signer)
            const tx = await ExecuteWithExtraGasLimit(minter, "mint_many", [gaugeAddresses], 0)
            
            setSpinnerVisible(false)
            
            const receipt = await tx.wait()
            console.log(receipt)
            if(receipt.status === 1){
              toastSuccessMessage("Transaction completed successfully.\nUpdating contracts")
              await updateMarket(null, UpdateTypeEnum.ClaimHnd)
            }
            else if(receipt.message){
              toastErrorMessage(`${receipt.message}`);  
            }
          }
          catch(error: any){
            console.log(error)
            toastErrorMessage(`${error?.message.replace(".", "")} on Hundred Claim`)
          }
          finally{
            setClaimHnd(false)
            setSpinnerVisible(false)
          }
        }}
    
     const handleClaimLockHnd = async (): Promise<void> => {
        if(library && network && account){
          try{
            if (network.votingAddress) 
            {   
              setClaimLockHnd(true)
              setSpinnerVisible(true)
            
              const signer = library.getSigner()
              let mintAddress = ''
              network.lendly ? network.minterAddressLendly ? mintAddress = network.minterAddressLendly : null: null;
              network.minterAddress ? mintAddress = network.minterAddress : null; 
    
              const minter = new Contract(mintAddress, MINTER_ABI, signer)
              const tx = await ExecuteWithExtraGasLimit(minter, "mint_many", [gaugeAddresses], 0)
            
              setSpinnerVisible(false)
            
              const receipt1 = await tx.wait()
              if(receipt1.status === 1){
                setSpinnerVisible(true)
                const votingContract = new Contract(network.votingAddress, VOTING_ESCROW_ABI, signer); 
                const balanceContract = new Contract(network.hundredAddress, HUNDRED_ABI, library)
                const rewards = await balanceContract.balanceOf(account)
                const tx2 = await ExecuteWithExtraGasLimit(votingContract, "increase_amount", [rewards], 0)
                
                setSpinnerVisible(false)

                const receipt = await tx2.wait()
                console.log(receipt)
                if(receipt.status === 1){
                  toastSuccessMessage("Transaction completed successfully.\nUpdating contracts")
                  await updateMarket(null, UpdateTypeEnum.ClaimLockHnd)
                }
                else if(receipt.message){
                  toastErrorMessage(`${receipt.message}`);  
                }
              }
            }
          }
          catch(error: any){
            console.log(error)
            toastErrorMessage(`${error?.message.replace(".", "")} on Hundred Claim & Lock`)
          }
          finally{
            setClaimLockHnd(false)
            setSpinnerVisible(false)
          }
        }}

    return (
        <div className="hundred-menu">
            <hr/>
            <div className="hundred-menu-item">
                <div className="hundred-menu-item-label"><label>HND Price </label><span>${BigNumber.parseValue(hndPrice.toString()).toRound(2, true, true)}</span></div>
                {tvl ? <div className="hundred-menu-item-label"><label>{networkRef.current?.liquidity ? "Liquidity" : "TVL"}</label><span>${tvl.toRound(2, true, true)}</span></div> : null}
                {networkRef.current  && networkRef.current.trade ? <div className="hundred-menu-item-label"><a className="hundred-menu-link" href={networkRef.current.trade} target="_blank" rel="noreferrer">Trade</a></div> : null}
                {networkRef.current  && networkRef.current.addLiquidity ? <div className="hundred-menu-item-label"><a className="hundred-menu-link" href={networkRef.current.addLiquidity} target="_blank" rel="noreferrer">Add Liquidity</a></div> : null}
                {networkRef.current  && networkRef.current.stakeLp ? <div className="hundred-menu-item-label"><a className="hundred-menu-link" href={networkRef.current.stakeLp} target="_blank" rel="noreferrer">Stake LP</a></div> : null}
            </div>
            <div className="hundred-menu-item">
                <hr/>
                <div className="hundred-menu-item-label"><label>HND Balance </label><span>{hndBalance ? (hndBalance.gt(BigNumber.from(0)) ? hndBalance.toRound(2, true, true) : "0.00") : "--"}</span></div>
                <div className="hundred-menu-item-label"><label>veHND Balance </label><span>{vehndBalance ? (vehndBalance.gt(BigNumber.from(0)) ? vehndBalance.toRound(2, true, true) : "0.00") : "--"}</span></div>
                <div className="hundred-menu-item-label"><label>HND Earned </label><span>{hndRewards ? (hndRewards.gt(BigNumber.from(0)) ? +hndRewards.toRound(2, true, true) === 0 ? ">0.00" : hndRewards.toRound(2, true, true) : "0.00") : "--"}</span></div>
                { rewardTokenSymbol ?
                    <div className="hundred-menu-item-label"><label>{rewardTokenSymbol} Earned </label><span>{tokenRewards ? (tokenRewards.gt(BigNumber.from(0)) ? +tokenRewards.toRound(2, true, true) === 0 ? ">0.00" : tokenRewards.toRound(2, true, true) : "0.00") : "--"}</span></div>
                : '' }
                <div className= {`${!claimHnd && !claimLockHnd && !claimLegacyHnd && ((hndRewards && +hndRewards?.toString() > 0) || (tokenRewards && +tokenRewards?.toString() > 0)) ? "hundred-menu-item-button" : "hundred-menu-item-button-disabled"}`} onClick={() => handleClaimHnd()}>{claimHnd ? (<Spinner size={"25px"}/>) : "Claim rewards"}</div>
                <div className= {`${!claimHnd && !claimLockHnd && !claimLegacyHnd && hndRewards && +hndRewards?.toString() > 0 ? "hundred-menu-item-button" : "hundred-menu-item-button-disabled"}`} onClick={() => handleClaimLockHnd()}>{claimLockHnd ? (<Spinner size={"25px"}/>) : "Claim and Lock HND"}</div>

                {hndEarned && +hndEarned.toString() > 0 ? 
                    <><div style={{paddingTop: "15px"}} className="hundred-menu-item-label"><label>HND Earned<br/>(Legacy)</label><span>{hndEarned ? hndEarned?.gt(BigNumber.from(0)) ? hndEarned?.toRound(2, true, true) : "0.00" : "--"}</span></div>
                    <div className={`${claimHnd || claimLockHnd || claimLegacyHnd ? "hundred-menu-item-button-disabled" : "hundred-menu-item-button"}`} onClick={() => !claimLegacyHnd ? handleCollect() : null}>
                        {claimLegacyHnd ? (<Spinner size={"25px"}/>) : "Claim Legacy HND"}</div></> : null
                }
            </div>
        </div>
    )
}

export default HundredMenu