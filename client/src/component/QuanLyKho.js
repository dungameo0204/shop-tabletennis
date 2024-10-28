import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuanLyKho.css'; // Import file CSS

const QuanLyKho = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    infor: '',
    cost: '',
    quantity: '',
    status: 'Available',
    category_name: '',
    brand_name: '',
    image: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Gọi API để lấy danh sách sản phẩm
    axios.get('http://localhost:3002/api/get-all-products')
      .then(response => {
        setProducts(response.data.filter(product => product.status === 'Available'));
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async () => {
    try {
      let categoryResponse = null;
      let brandResponse = null;

      try {
        categoryResponse = await axios.get(`http://localhost:3002/api/get-category-by-name/${newProduct.category_name}`);
      } catch (error) {
        categoryResponse = { data: null };
      }

      try {
        brandResponse = await axios.get(`http://localhost:3002/api/get-brand-by-name/${newProduct.brand_name}`);
      } catch (error) {
        brandResponse = { data: null };
      }

      if (!categoryResponse.data || !brandResponse.data) {
        setError('Bạn nhập sai tên của thương hiệu hoặc thể loại');
        return;
      }

      const category_id = categoryResponse.data._id;
      const brand_id = brandResponse.data._id;

      const productData = {
        ...newProduct,
        category_id,
        brand_id
      };

      const response = await axios.post('http://localhost:3002/api/add-product', productData);
      setProducts([...products, response.data.product]);
      setShowForm(false);
      setNewProduct({
        name: '',
        infor: '',
        cost: '',
        quantity: '',
        status: 'Available',
        category_name: '',
        brand_name: '',
        image: ''
      });
      setError('');
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Có lỗi xảy ra khi thêm sản phẩm');
    }
  };

  const handleUpdateProduct = (id) => {
    // Logic để cập nhật sản phẩm
  };

  const handleDeleteProduct = (id) => {
    axios.delete(`http://localhost:3002/api/delete-product/${id}`)
      .then(response => {
        setProducts(products.filter(product => product._id !== id));
      })
      .catch(error => {
        console.error('Error deleting product:', error);
      });
  };

  return (
    <section className="quan-ly-kho">
      <h2>Quản lý kho hàng</h2>
      <button className="add-product-button" onClick={() => setShowForm(!showForm)}>Thêm sản phẩm</button>
      {showForm && (
        <div className="add-product-form">
          <h3>Thêm sản phẩm mới</h3>
          {error && (
            <p className="error-message">
              <span className="icon">⚠️</span> {/* Icon cảnh báo */}
              {error}
            </p>
          )}
          <form>
            <input type="text" name="name" placeholder="Tên sản phẩm" value={newProduct.name} onChange={handleInputChange} />
            <input type="text" name="infor" placeholder="Thông tin sản phẩm" value={newProduct.infor} onChange={handleInputChange} />
            <input type="number" name="cost" placeholder="Giá" value={newProduct.cost} onChange={handleInputChange} />
            <input type="number" name="quantity" placeholder="Số lượng" value={newProduct.quantity} onChange={handleInputChange} />
            <input type="text" name="category_name" placeholder="Tên danh mục" value={newProduct.category_name} onChange={handleInputChange} />
            <input type="text" name="brand_name" placeholder="Tên thương hiệu" value={newProduct.brand_name} onChange={handleInputChange} />
            <input type="text" name="image" placeholder="URL ảnh" value={newProduct.image} onChange={handleInputChange} />
            <button className="submit-button" type="button" onClick={handleAddProduct}>Thêm</button>
          </form>
        </div>
      )}
      <table className="product-table">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Thể loại</th>
            <th>Thương hiệu</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>{product.cost}</td>
              <td>{product.category ? product.category.name : 'N/A'}</td>
              <td>{product.brand ? product.brand.name : 'N/A'}</td>
              <td className="action-buttons">
                <button className="update-button" onClick={() => handleUpdateProduct(product._id)}>Update</button>
                <button className="delete-button" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default QuanLyKho;