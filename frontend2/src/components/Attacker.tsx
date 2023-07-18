import user from '../assets/user.svg';
import ether from '../assets/ether_icon.svg';
import contract from '../assets/contract_icon.svg';
import Attacker2 from './Attacker2';
import Victim2 from './Victim2';

function Attacker() {

  return (
<>

    <div className='col-start-1 col-span-12 rounded-2xl border border-gray-200 bg-white shadow-xl py-5 mb-24'>


        <div className='grid grid-cols-12'>
            <div className="col-start-1 col-span-6">
                <Attacker2 />
            </div>

            <div className="col-start-7 col-span-6">
                <Victim2 />
            </div>
        </div>

    </div>
</>
  );
}

export default Attacker;