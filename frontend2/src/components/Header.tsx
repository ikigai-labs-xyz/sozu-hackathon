import logo from '../assets/logo.svg';

function Header() {

  return (

    <div className='grid grid-cols-12 gap-4 items-center pt-5'>

        <div className='col-start-1 col-span-1'>
            <img src={logo} alt="" />
        </div>

        <div className='col-start-5 col-span-2 text-center p-2 hover:shadow-xl hover:bg-slate-700 hover:text-white font-extrabold text-black rounded-md'>
          <a href="https://turtleshell.xyz" target="_blank" rel="noopener noreferrer">
            <div className="">Website</div>
          </a>
        </div>
     
        <div className='col-start-7 col-span-2 text-center p-2 hover:shadow-xl hover:bg-slate-700 hover:text-white font-extrabold text-black rounded-md'>
        <a href="https://turtleshell.gitbook.io/introduction/" target="_blank" rel="noopener noreferrer">
            <div className="">Docs</div>
            </a>
        </div>


    </div>

  );
}

export default Header;