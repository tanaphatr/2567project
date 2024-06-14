import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Catagori.css';

function Catagori() {
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/Category');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (showAll) {
      setVisibleCategories(categories);
    } else {
      setVisibleCategories(categories.slice(0, 10));
    }
  }, [showAll, categories]);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <ul className='category-grid'>
        {visibleCategories.map((category, index) => (
          <li key={category.id} className='category-item'>
            <Link to={`/cate/${category.CategoryID}`} className='block text-center'>
              <figure>
                <img
                  className='flex-grow-1 flex-basis-200 block-text-center'
                  src={`http://localhost:3001/public/image/${category.CategoryPic}`}
                  alt="Product"
                  style={{ maxWidth: '80px', maxHeight: '80px' }}
                />
                <figcaption>{category.CategoryName}</figcaption>
              </figure>
            </Link>
          </li>
        ))}
      </ul>
      <div style={{ textAlign: 'center' }}>
        {categories.length > 10 && (
          <button onClick={toggleShowAll}>{showAll ? 'Show Less' : 'Show More'}</button>
        )}
      </div>
      <br />
      <hr />
      <br />
    </div>
  );
}

export default Catagori;
