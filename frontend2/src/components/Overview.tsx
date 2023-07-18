
import user from '../assets/user.svg';
import ether from '../assets/ether_icon.svg';
import contract from '../assets/contract_icon.svg';

import tokens from '../transactions/Values';

function Overview() {

  return (
    <>
<div className="grid grid-cols-12 py-5 mb-12 gap-5">

{/* <div className="col-start-1 col-span-6 text-2xl font-extrabold text-black text-left">
    Stats Overview
</div> */}



<div className='col-start-1 col-span-4  rounded-lg border border-gray-200 bg-white shadow-md '>
<div className='text-black border-b border-slate-800/40'>Total Value Locked</div>
        <div className="flex flex-row items-center justify-between border-b border-slate-800/40">
    </div>
    <div className="flex flex-row items-center justify-center gap-3 py-2">
        <div className="text-slate-800 text-lg">amount xyz</div>
    </div>
</div>

<div className='col-start-5 col-span-4  rounded-lg border border-gray-200 bg-white shadow-md '>
<div className='text-black border-b border-slate-800/40'>Total Value Locked</div>
        <div className="flex flex-row items-center justify-between border-b border-slate-800/40">
    </div>
    <div className="flex flex-row items-center justify-center gap-3 py-2">
        <div className="text-slate-800 text-lg">amount xyz</div>
    </div>
</div>

<div className='col-start-9 col-span-4 rounded-lg border border-gray-200 bg-white shadow-md '>
    <div className='text-black border-b border-slate-800/40'>Total Value Locked</div>
        <div className="flex flex-row items-center justify-between border-b border-slate-800/40">
    </div>
    <div className="flex flex-row items-center justify-center gap-3 py-2">
        <div className="text-slate-800 text-lg">amount xyz</div>
    </div>
</div>





</div>
</>
  );
}

export default Overview;