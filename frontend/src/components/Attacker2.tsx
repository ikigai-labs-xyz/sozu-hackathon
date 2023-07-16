import user from '../assets/user.svg';
import ether from '../assets/ether_icon.svg';
import contract from '../assets/contract_icon.svg';

import tokens from '../transactions/Values';

import Calc from './Calc';

function Attacker2() {

  return (
<>

<div className="grid grid-cols-6 py-5 mb-12 gap-5">

<div className="col-start-3 col-span-6 text-3xl font-extrabold text-black text-left">
    Attacker
</div>



<div className='col-start-1 col-span-6  rounded-lg border border-gray-200 bg-white shadow-md '>
<div className="flex flex-row items-center justify-between border-b border-slate-800/40">
        <div className='flex flex-row items-center'>
        <img src={contract} alt="Attacker Icon" />
        <div className="text-slate-500 text-sm font-semibold">Master Contract</div>
        </div>
        <div className="text-slate-500 text-xs pr-2">0xD3DD40...A6176426</div>

    </div>
    <div className="flex flex-row items-center justify-center gap-3 py-2">

    <div className="flex flex-col items-end">
    <div className="flex flex-row items-center justify-center gap-3 py-2">
        <div className="text-slate-800 text-sm">{tokens.wBTC.title}</div>
        <div className="text-slate-500 text-sm">{tokens.wBTC.amount}</div>
    </div>
    <div className="flex flex-row items-center justify-center gap-3 py-2">
        <div className="text-slate-800 text-sm">{tokens.hwBTC.title}</div>
        <div className="text-slate-500 text-sm"><Calc /></div>
    </div>
    <div className="flex flex-row items-center justify-center gap-3 py-2">
        <div className="text-slate-800 text-sm">{tokens.ETH.title}</div>
        <div className="text-slate-500 text-sm">{tokens.ETH.amount}</div>
    </div>
    </div>

    </div>
</div>

<div className='col-start-1 col-span-6 rounded-lg border border-gray-200 bg-white shadow-md '>
<div className="flex flex-row items-center justify-between border-b border-slate-800/40">
        <div className='flex flex-row items-center'>
        <img src={contract} alt="Attacker Icon" />
        <div className="text-slate-500 text-sm font-semibold">Drainer Contract</div>
        </div>
        <div className="text-slate-500 text-xs pr-2">0xD3DD40...A6176426</div>

    </div>

    <div className="flex flex-row items-center justify-center gap-3 py-2">

        <div className="flex flex-col items-end">
            <div className="flex flex-row items-center justify-center gap-3 py-2">
                <div className="text-slate-800 text-sm">{tokens.wBTC.title}</div>
                <div className="text-slate-500 text-sm">{tokens.wBTC.amount}</div>
            </div>
            <div className="flex flex-row items-center justify-center gap-3 py-2">
                <div className="text-slate-800 text-sm">{tokens.hwBTC.title}</div>
                <div className="text-slate-500 text-sm">{tokens.hwBTC.amount}</div>
            </div>
            <div className="flex flex-row items-center justify-center gap-3 py-2">
                <div className="text-slate-800 text-sm">{tokens.ETH.title}</div>
                <div className="text-slate-500 text-sm">{tokens.ETH.amount}</div>
            </div>
        </div>

    </div>
            
</div>




</div>
</>
  );
}

export default Attacker2;