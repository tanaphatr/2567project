import React, { useState, useEffect } from 'react';
import Nav from './nav';
import './Item.css';
import PageAB from './PageAB';
import { Link } from 'react-router-dom';

function Item() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [likeData, setLikeData] = useState([]);
  const [filteredLikeData, setFilteredLikeData] = useState([]);
  const [users, setUsers] = useState([]);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const stoid = localStorage.getItem('userid');

  useEffect(() => {
    const fetchProductAndUsers = async () => {
      const url = window.location.href;
      const Pro_ID = url.substring(url.lastIndexOf('/') + 1); // Extract the ID from the URL

      try {
        const productResponse = await fetch('http://localhost:3001/product');
        const products = await productResponse.json();
        const product = products.find(item => item.Productid === parseInt(Pro_ID));
        if (product) {
          setSelectedProduct(product);
        } else {
          console.log('Product not found');
        }

        const usersResponse = await fetch('http://localhost:3001/user');
        const usersData = await usersResponse.json();
        setUsers(usersData);

        const likesResponse = await fetch('http://localhost:3001/like');
        const likesData = await likesResponse.json();
        setLikeData(likesData);

        const filteredLikes = likesData.filter(like => like.Productid === parseInt(Pro_ID));
        setFilteredLikeData(filteredLikes);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProductAndUsers();
  }, []);

  const handleAddLike = async (productId) => {
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
      Productid: productId
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
      setPhoneModalOpen(true);
    } catch (error) {
      console.error('Error sending like data:', error);
    }
  };

  const getProductWithUserContact = (product) => {
    const user = users.find((user) => user.Userid === product.Sellerid);
    return { ...product, Phone: user ? user.Phone : 'N/A', Email: user ? user.Mail : 'N/A' };
  };

  const handleLikeButtonClick = () => {
    setPhoneModalOpen(true);
  };

  const closeModal = () => {
    setPhoneModalOpen(false);
    setCurrentUserIndex(0);
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
      <Nav />
      {selectedProduct ? (
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              className='flex-grow-1 flex-basis-200 block-text-center'
              src={`http://localhost:3001/public/image/${selectedProduct.ImageURL}`}
              alt="Product"
              style={{ maxWidth: '400px', maxHeight: '400px' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div>
              <h1>ชื่อ {selectedProduct.Productname}</h1>
              <p>จำนวน {selectedProduct.QuantityAvailable}</p>
              {selectedProduct.Price && (
                <p>ราคา: {selectedProduct.Price} ฿</p>
              )}
              <p>คำอธิบาย: {selectedProduct.Description}</p>
              {selectedProduct.Sellerid && (
                <div>
                  <p>ข้อมูลผู้ขาย:</p>
                  {getProductWithUserContact(selectedProduct).Email && (
                    <p>Email: {getProductWithUserContact(selectedProduct).Email}</p>
                  )}
                  {getProductWithUserContact(selectedProduct).Phone && (
                    <p>Phone: {getProductWithUserContact(selectedProduct).Phone}</p>
                  )}
                </div>
              )}
              <br />
              <div>
                {selectedProduct.Sellerid !== parseInt(stoid) ? (
                  <button className='gray-button' onClick={() => handleAddLike(selectedProduct.Productid)}>สนใจ</button>
                ) : (
                  <>
                    <Link to={`/productfix/${selectedProduct.Productid}`}>
                      <button2 className='gray-button'>แก้ไข</button2>
                    </Link>
                    <button2 className='gray-button' onClick={handleLikeButtonClick}>แสดงผู้ที่สนใจ</button2>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading product...</p>
      )}
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
      <PageAB />
    </div>
  );
  
}

export default Item;
