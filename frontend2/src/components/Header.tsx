import logo from '../assets/logo.svg';

function Header() {

  return (

    <div className='grid grid-cols-12 gap-4 items-center pt-5'>

        <div className='col-start-1 col-span-4'>
          <div className="flex flex-row items-center justify-center gap-5 ">
            <img src={logo} alt="" />
            <div className="font-extrabold text-4xl text-white">Firewall Project</div>
            </div>
        </div>

        <div className='col-start-5 col-span-2 text-center p-2 hover:shadow-xl hover:bg-slate-700 hover:text-slate-500 font-extrabold text-white rounded-md'>
          <a href="https://turtleshell.xyz" target="_blank" rel="noopener noreferrer">
            <div className="">Website</div>
          </a>
        </div>
     
        <div className='col-start-7 col-span-2 text-center p-2 hover:shadow-xl hover:bg-slate-700 hover:text-slate-500 font-extrabold text-white rounded-md'>
        <a href="https://turtleshell.gitbook.io/introduction/" target="_blank" rel="noopener noreferrer">
            <div className="">Docs</div>
            </a>
        </div>


    </div>

  );
}

export default Header;