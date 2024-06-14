import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [a, setA] = useState(0);
  const [b, setB] = useState(6);
  const [likeData, setLikeData] = useState([]);
  const [filteredLikeData, setFilteredLikeData] = useState([]);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const stoid = localStorage.getItem('userid');


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/product');
        const data = await response.json();
        const sortedProducts = [...data].sort((max, min) => min.Productid - max.Productid);
        setProducts(sortedProducts);
        setDisplayedProducts(sortedProducts.slice(a, b));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/user');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchLikes = async () => {
      try {
        const response = await fetch('http://localhost:3001/like');
        const data = await response.json();
        setLikeData(data);
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    const fetchData = () => {
      fetchProducts();
      fetchUsers();
      fetchLikes();
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000); // Fetch data every 60 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [a, b]);

  const handleCallButtonClick = async (productId) => {
    if (!stoid) {
      console.error('User not logged in');
      return;
    }

    const existingLike = likeData.find(like => like.Userid === parseInt(stoid) && like.Productid === productId);

    if (existingLike) {
      console.error('User has already liked this product');
      alert('User has already liked this product');
      return;
    }

    const newLikeData = {
      Userid: stoid,
      Productid: productId,
    };

    try {
      const response = await fetch('http://localhost:3001/inlike', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLikeData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Like data sent successfully:', data);
      setLikeData(prevLikeData => [...prevLikeData, newLikeData]);
    } catch (error) {
      console.error('Error sending like data:', error);
    }
  };

  const closeModal = () => {
    setPhoneModalOpen(false);
  };

  const getProductWithUserContact = (product) => {
    const user = users.find((user) => user.Userid === product.Sellerid);
    return { ...product, Phone: user ? user.Phone : 'N/A', Email: user ? user.Mail : 'N/A' };
  };

  const Next = () => {
    console.log(a);
    console.log(b);
    if (a === 0 && b < 6) {
      setA(1);
      setB(7);
    }
  if (b >= products.length) {
      setA(0);
      setB(6);
    } else {
      // Increment 'a' and 'b' by 6
      setA((a) => a + 6);
      setB((b) => b + 6);
    }
  };
  

  const Back = () => {
    if (a === 0) {
      setA(products.length);
      setB(products.length + 6 );
    }
    if (a < 6 && a !== 0){
      setA(0);
      setB((b) => b - 6);
    }
     else {
      setA((a) => a - 6);
      setB((b) => b - 6);
    }
    console.log(a);
    console.log(b);
  };


  const handlelikeButtonClick = (productId) => {
    const filteredLikes = likeData.filter(like => like.Productid === productId);

    if (filteredLikes.length === 0) {
      alert('ไม่มีคนสนใจ');
    } else {
      setFilteredLikeData(filteredLikes);
      setPhoneModalOpen(true);
    }
  };

  const showNextUser = () => {
    setCurrentUserIndex((prevIndex) => (prevIndex + 1) % filteredLikeData.length);
  };

  const showPreviousUser = () => {
    setCurrentUserIndex((prevIndex) => (prevIndex - 1 + filteredLikeData.length) % filteredLikeData.length);
  };

  const getCurrentUserDetails = () => {
    const currentLike = filteredLikeData[currentUserIndex];
    const user = users.find((user) => user.Userid === currentLike.Userid);
    return user || { Name: 'Unknown', Mail: 'Unknown', Phone: 'Unknown', Address: 'Unknown' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', userSelect: 'none' }}>
        <div className='scroll-container'>
          <ul className='scroll-content'>
            {displayedProducts.map((product) => {
              const productWithUserContact = getProductWithUserContact(product);
              return (
                <li key={productWithUserContact.Productid} className='scroll-item'>
                  <figure className='scroll-figure'>
                    <Link to={`/item/${productWithUserContact.Productid}`}>
                      <img
                        className='flex-grow-1 flex-basis-200 block-text-center'
                        src={`http://localhost:3001/public/image/${productWithUserContact.ImageURL}`}
                        alt="Product"
                        style={{ maxWidth: '200px', maxHeight: '300px' }}
                      />
                    </Link>
                    <h1 style={{ whiteSpace: 'nowrap' }}>{productWithUserContact.Productname}</h1>
                    <p>Price: {productWithUserContact.Price}฿</p>
                    <p>Price: {productWithUserContact.QuantityAvailable}</p>
                    <div>
                      {productWithUserContact.Sellerid !== parseInt(stoid) && (
                        <button2 className='gray-button' onClick={() => handleCallButtonClick(productWithUserContact.Productid)}>สนใจ</button2>
                      )}
                      {productWithUserContact.Sellerid === parseInt(stoid) && (
                        <button2 className='gray-button' onClick={() => handlelikeButtonClick(productWithUserContact.Productid)}>แสดงผู้ที่สนใจ</button2>
                      )}
                    </div>
                  </figure>
                </li>
              );
            })}
          </ul>
        </div>

        {phoneModalOpen && filteredLikeData.length > 0 && (
          <div className="modal">
            <div className="overlay" onClick={closeModal}></div>
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <h3 style={{ margin: '20px', fontWeight: 'bold', fontSize: '20px', whiteSpace: 'nowrap' }}>Users who liked this product:</h3>
              <div>
                {filteredLikeData.length > 0 ? (
                  <div>
                    <p>Name: {getCurrentUserDetails().Name}</p>
                    <p>Email: {getCurrentUserDetails().Mail}</p>
                    <p>Phone: {getCurrentUserDetails().Phone}</p>
                    <p>Address: {getCurrentUserDetails().Address}</p>
                    <br />
                    <button2 onClick={showPreviousUser}>Previous</button2>
                    <button2 onClick={showNextUser}>Next</button2>
                  </div>
                ) : (
                  <p>No likes found for this product</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <br />
      <div style={{ display: 'flex', justifyContent: 'center', userSelect: 'none' }}>
        <button2 onClick={Back} disabled={a === 0}>Previous</button2>
        <button2 onClick={Next} disabled={b >= products.length}>Next</button2>
      </div>
    </div>
  );
}

export default Home;
