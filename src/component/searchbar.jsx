import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import searchIcon from '../Image/searchIcon.png';
import './searchbar.css';

function Searchbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isValid, setIsValid] = useState(false); 
  const { query } = useParams(); 

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
    }
  }, [query]);

  useEffect(() => {
    setIsValid(searchTerm.trim() !== '');
  }, [searchTerm]);

  const handleSearchIconClick = () => {
    if (isValid) {
      console.log('Searching for:', searchTerm);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isValid) {
      window.location.href = `/searchpage/${searchTerm}`;
    }
  };

  return (
    <div className='p-4' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f2f2' }}>
      <div style={{ position: 'relative', width: '800px' }}>
        <input
          className="searchbar-input"
          type="text"
          placeholder="ค้นหา..."
          style={{
            padding: '10px 30px 10px 10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '100%',
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Link to={`/searchpage/${searchTerm}`} style={{ textDecoration: 'none' }}>
          <button
            disabled={!isValid} 
            onClick={handleSearchIconClick}
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <img
              src={searchIcon}
              alt="search"
              style={{
                width: '20px',
                height: '20px'
              }}
            />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Searchbar;
