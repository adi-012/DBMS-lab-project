import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import { useAuth } from '../context/auth';
import { FaAngleLeft, FaAngleRight, FaGithub, FaArrowUp  } from 'react-icons/fa';
import Card from '../components/Layout/Card';
import Slider from 'react-slick';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout'
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(null);
  const perPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const navigate = useNavigate();


  const getPaginatedProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products/get-paginated-products-for-homepage', {
        params: {
          perPage: perPage,
          page: currentPage
        }
      });
      setProducts(data.products);
    } catch (error) {
      toast.error(error);
    }
  };

  const getTotalProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/products/get-total-products-in-homepage');
      if (data.success) {
        setTotalProducts(data.count);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleForward = () => {
    if (currentPage === totalPages) setCurrentPage(1);
    else setCurrentPage((page) => page + 1);
  };

  const handleBackward = () => {
    if (currentPage === 1) setCurrentPage(totalPages);
    else setCurrentPage((page) => page - 1);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    getPaginatedProducts();
  }, [currentPage]);

  useEffect(() => {
    getTotalProducts();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(totalProducts / perPage));
  }, [totalProducts]);


  return (
    <div>
      
      <Layout title={"Homepage-Grocery Hut"}>
      <Slider autoplay={true} autoplaySpeed={3000}>
        <div>
          <img
            src="https://img.freepik.com/free-photo/variety-fresh-tasty-vegetables-dark_1220-4444.jpg?w=1380&t=st=1683574655~exp=1683575255~hmac=e13185e4cd9e60dfcc0c6e46b4eddc1eee912cd5659588fbc4f1ce0255d827f5"
            alt="Example image"
            style={{ width: '100vw', height: '60vh' }}
          />
        </div>
        <div>
          <img
            src="https://img.freepik.com/free-photo/high-angle-indian-spices-arrangement_23-2148747644.jpg?w=1060&t=st=1683575187~exp=1683575787~hmac=0048f64b9f242a390cd00a7c15421e8535f73a67760a9c9d519cc83af749cf9c"
            alt="Example image"
            style={{ width: '100vw', height: '60vh' }}
          />
        </div>
        <div>
          <img
            src="https://img.freepik.com/free-photo/top-view-assortment-make-up-beauty-products_23-2148620013.jpg?w=1060&t=st=1683575257~exp=1683575857~hmac=24b76301ca16d225b963cf75cb9212b491d2a932f0c67539cce9f771bc39353a"
            alt="Example image"
            style={{ width: '100vw', height: '60vh' }}
          />
        </div>
      </Slider>

      <div className="cards-list">
        {!loading ? products.map((item) => (
          <Card key={item.product_id} {...item} />
        )) : <div style={{textAlign:'center'}}>
          <h5 >Loading...</h5>
          </div>}
      </div>

      <br />
      <br />
      <br />

      <div className="pagination-container" style={{ textAlign: 'center' }}>
        <button type="button" className="btn btn-success" onClick={handleBackward}>
          <span style={{ textAlign: 'center', alignItems: 'center' }}>
            <FaAngleLeft />
          </span>
        </button>
        {!loading ? (
          <>
            {Array.from(Array(totalPages), (_, index) => (
              <button
                key={index}
                type="button"
                className={`btn ${index + 1 === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                style={{ margin: '3px' }}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </>
        ) : (
          ''
        )}
        <button type="button" className="btn btn-success" onClick={handleForward}>
          <span style={{ textAlign: 'center', alignItems: 'center' }}>
            <FaAngleRight />
          </span>
        </button>
      </div>

      <br />
      <br />

      <div className="team-section" style={{ background: '#18d26e', color: 'white', padding: '50px' }}>
  <h2>Our Team</h2>
  <div className="team-member" style={{ display: 'flex', flexDirection: 'row' }}>
    <div style={{ marginRight: '20px' }}>
      <h3>Harish Dendukuri</h3>
      <p>211CS127</p>
    </div>
    &nbsp;
    &nbsp;
    &nbsp;
    &nbsp;
    &nbsp;
    &nbsp;
    &nbsp;
    <div style={{ marginRight: '20px' }}>
      <h3>G Vishwas</h3>
      <p>211CS122</p>
    </div>
    &nbsp;
    &nbsp;
    &nbsp;
    &nbsp;
    &nbsp;
    &nbsp;
    &nbsp;
    <div style={{ marginRight: '20px' }}>
      <h3>Aditya Tyagi</h3>
      <p>211CS101</p>
    </div>
    &nbsp;
    &nbsp;
    &nbsp;
    &nbsp;
    &nbsp;
    &nbsp;
    &nbsp;
    <div>
      <h3>Lohith CV</h3>
      <p>211CS136</p>
    </div>
  </div>
  <div className="github-link" style={{ background: '#18d26e', color: 'white', padding: '20px', textAlign: 'center' }}>
    <a
      href="https://github.com/Vishwas1687/DBMS-lab-project"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: 'white' }}
    >
      <FaGithub style={{ marginRight: '5px' }} />
      <br />
      This project was developed as a part of the Database Management Systems Lab Course(CS257)
    </a>
  </div>
  
  <div className="copyright">
    &copy; Copyright <strong><span>GroceryHut</span></strong>.
    All Rights Reserved
  </div>
  <button
  className="btn btn-success scroll-top-button"
  onClick={scrollToTop}
  style={{
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '9999',
  }}
>
  <FaArrowUp />
</button>
</div>
</Layout>
    </div>
    
  );
};

export default HomePage;
