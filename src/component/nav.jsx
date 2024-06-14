import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link component from react-router-dom

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const data = localStorage.getItem('username');

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <nav className='p-4 justify-between'>
      <div className='flex items-center justify-between'>
        <div className='text-black text-2xl font-bold'>StudentSwapShop</div>

        <div className="md:hidden">
          <button id='menu-toggle' className='text-black' onClick={toggleMenu}>
            <svg fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' className='w-6 h-6'>
              <path d='M4 6h16M4 12h16M4 18h16'></path>
            </svg>
          </button>
        </div>
          <ul className='hidden md:flex space-x-4'>
            <li className='flex items-center justify-between'><Link to='/' className='text-black'>Home</Link></li>
            {data ? <li className='flex items-center justify-between'><Link to='/Sell' className='text-black'>Sell</Link></li> : null}
            {data ? <li className='flex items-center justify-between'><Link to='/login' onClick={handleLogout} className='text-black'>Logout</Link></li> : null}
            {data ? <li><Link to='/userprofile' style={{ textDecoration: 'none' }}><div style={{ fontWeight: 'bold', fontSize: '30px', color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, width: '50px', height: '50px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>{data.charAt(0).toUpperCase()}</div></Link></li> : null}
            {data ? null : <li className='flex items-center justify-between'><Link to='/register' className='text-black'>Register</Link></li>}
            {data ? null : <li className='flex items-center justify-between'><Link to='/login' className='text-black'>Login</Link></li>}
          </ul>
      </div>

      {/* menu */}
      {menuOpen ? (
        <ul className='flex-col md:hidden'>
          <li className='py-1'><Link to='/' className='text-black'>Home</Link></li>
          {data ? <li className='flex items-center justify-between'><Link to='/Sell' className='text-black'>Sell</Link></li> : null}
          {data ? <li className='py-1'><Link to='/login' onClick={handleLogout} className='text-black'>Logout</Link></li> : null}
          {data ? <li><Link to='/userprofile' className='text-black' style={{ fontWeight: 'bold', fontSize: '30px', color: `#${Math.floor(Math.random() * 16777215).toString(16)}` }}>{data.charAt(0).toUpperCase()}</Link></li> : null}
          {data ? null : <li className='py-1'><Link to='/register' className='text-black'>Register</Link></li>}
          {data ? null : <li className='py-1'><Link to='/login' className='text-black'>Login</Link></li>}
        </ul>
      ) : null}
      <br />
      <hr />
    </nav>
  );
}

export default Nav;
