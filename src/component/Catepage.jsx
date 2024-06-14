import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from './nav';
import PageAB from './PageAB';

function Catepage() {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [likeData, setLikeData] = useState([]);
    const [filteredLikeData, setFilteredLikeData] = useState([]);
    const [phoneModalOpen, setPhoneModalOpen] = useState(false);
    const [currentUserIndex, setCurrentUserIndex] = useState(0);
    const [a, setA] = useState(0);
    const [b, setB] = useState(6);
    const stoid = localStorage.getItem('userid');
    const categoryIdToDisplay = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3001/product');
                const data = await response.json();
                const filteredAndSortedProducts = data
                    .filter(product => product.Categoryid === parseInt(categoryIdToDisplay))
                    .sort((max, min) => min.Productid - max.Productid);

                setProducts(filteredAndSortedProducts);

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

        const fetchCategory = async () => {
            try {
                const response = await fetch('http://localhost:3001/Category');
                const data = await response.json();
                const category = data.find(cat => cat.CategoryID === parseInt(categoryIdToDisplay));
                if (category) {
                    setCategoryName(category.CategoryName);
                }
            } catch (error) {
                console.error('Error fetching category:', error);
            }
        };

        const fetchData = () => {
            fetchProducts();
            fetchUsers();
            fetchLikes();
            fetchCategory();
        };

        fetchData();
        const intervalId = setInterval(fetchData, 60000);

        return () => clearInterval(intervalId);
    }, [categoryIdToDisplay]);

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

    const Next = () => {
        if (b < products.length) {
            setA(prevA => prevA + 6);
            setB(prevB => prevB + 6);
        }
    };

    const Back = () => {
        if (a > 0) {
            setA(prevA => prevA - 6);
            setB(prevB => prevB - 6);
        }
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
        setCurrentUserIndex(prevIndex => (prevIndex + 1) % filteredLikeData.length);
    };

    const showPreviousUser = () => {
        setCurrentUserIndex(prevIndex => (prevIndex - 1 + filteredLikeData.length) % filteredLikeData.length);
    };

    const closeModal = () => {
        setPhoneModalOpen(false);
    };

    const getProductWithUserPhone = (product) => {
        const user = users.find(user => user.Userid === product.Sellerid);
        return { ...product, Phone: user ? user.Phone : 'N/A' };
    };

    const getCurrentUserDetails = () => {
        if (filteredLikeData.length > 0) {
            const currentUser = users.find(user => user.Userid === filteredLikeData[currentUserIndex].Userid);
            return currentUser || {};
        }
        return {};
    };

    return (
        <div>
            <Nav />
            <p style={{ margin: '20px', fontWeight: 'bold', fontSize: '20px', whiteSpace: 'nowrap' }}>หมวดหมู่ : {categoryName}</p>
            <div className='p-4' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ul className='flex-wrap wrap' style={{ display: 'flex', justifyContent: 'space-around' }}>
                    {products.slice(a, b).map(product => {
                        const productWithUserPhone = getProductWithUserPhone(product);
                        return (
                            <li key={productWithUserPhone.Productid} style={{ maxWidth: '225px', maxHeight: '400px', margin: '5px' }}>
                                <figure className='block text-center' style={{ border: '2px solid lightgray', padding: '10px' }}>
                                    <Link to={`/item/${productWithUserPhone.Productid}`}>
                                        <img
                                            className='flex-grow-1 flex-basis-200 block-text-center'
                                            src={`http://localhost:3001/public/image/${productWithUserPhone.ImageURL}`}
                                            alt="Product"
                                            style={{ maxWidth: '200px', maxHeight: '300px' }}
                                        />
                                    </Link>

                                    <h1>{productWithUserPhone.Productname}</h1>
                                    <p>Price: {productWithUserPhone.Price} ฿</p>
                                    <p>Quantity: {productWithUserPhone.QuantityAvailable}</p>
                                    <div>
                                        {productWithUserPhone.Sellerid !== parseInt(stoid) && (
                                            <button2 className='gray-button' onClick={() => handleCallButtonClick(productWithUserPhone.Productid)}>สนใจ</button2>
                                        )}
                                        {productWithUserPhone.Sellerid === parseInt(stoid) && (
                                            <button2 className='gray-button' onClick={() => handlelikeButtonClick(productWithUserPhone.Productid)}>แสดงผู้ที่สนใจ</button2>
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
            <br />
            <div style={{ display: 'flex', justifyContent: 'center', userSelect: 'none' }}>
                <button2 onClick={Back} disabled={a === 0}>Previous</button2>
                <button2 onClick={Next} disabled={b >= products.length}>Next</button2>
            </div>
            <PageAB />
        </div>
    );
}

export default Catepage;
