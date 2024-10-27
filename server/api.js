const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();
const Admin = require('./schema/admin');  // Import model Admin
const Product = require('./schema/product');  // Imp
const Category = require('./schema/category');
const Brand = require('./schema/brand');

// Middleware
router.use(bodyParser.json());

// MongoDB connection
const dbUrl = `mongodb+srv://0204hoangdung:wonkachocolate@cluster1.smbtc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;
mongoose.set('strictQuery', false);

async function connectDB() {
    try {
        await mongoose.connect(dbUrl);
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.log("Error!" + error);
    }
}

connectDB();



// api admin
router.post('/admin', async (req, res) => {
    try {
        const newAdmin = new Admin({
            admin_user: req.body.admin_user,
            admin_password: req.body.admin_password
        });
        await newAdmin.save();
        res.status(201).send({ message: 'Admin created successfully', admin: newAdmin });
    } catch (error) {
        res.status(400).send({ message: 'Error creating admin', error: error.message });
    }
});
// Route để lấy thông tin tất cả admin
router.get('/login-admin', async (req, res) => {
    try {
        const adminUser = req.query.admin_user;
        const admins = await Admin.find({ admin_user: adminUser });
        res.status(200).send(admins);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching admins', error: error.message });
    }
});

router.get('/get-all-admins', async (req, res) => {
    try {
        const admins = await Admin.find({});
        res.status(200).send(admins);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching admins', error: error.message });
    }
});

router.delete('/delete-admin', async (req, res) => {
    try {
        const adminUser = req.body.admin_user;
        const deletedAdmin = await Admin.findOneAndDelete({ admin_user: adminUser });
        if (!deletedAdmin) {
            return res.status(404).send({ message: 'Admin not found' });
        }
        res.status(200).send({ message: 'Admin deleted successfully', admin: deletedAdmin });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting admin', error: error.message });
    }
});





//api product
router.post('/add-product', async (req, res) => {
    const { name, infor, cost, quantity, status, category_id, brand_id, image} = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !infor || !cost || !quantity || !status || !category_id || !brand_id || !image) {
        return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin sản phẩm.' });
    }

    try {
        // Kiểm tra xem danh mục có tồn tại không
        const category = await Category.findById(category_id);
        if (!category) {
            return res.status(400).json({ error: 'Danh mục không tồn tại.' });
        }

        // Kiểm tra xem thương hiệu có tồn tại không
        const brand = await Brand.findById(brand_id);
        if (!brand) {
            return res.status(400).json({ error: 'Thương hiệu không tồn tại.' });
        }

        // Tạo sản phẩm mới
        const newProduct = new Product({
            name,
            infor,
            cost,
            quantity,
            status,
            category: category_id,
            brand: brand_id,
            image
        });

        // Lưu sản phẩm vào cơ sở dữ liệu
        await newProduct.save();

        res.status(201).json({ message: 'Sản phẩm đã được thêm thành công!', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: 'Có lỗi xảy ra khi thêm sản phẩm.', details: error.message });
    }
});
router.put('/update-product', async (req, res) => {
    const { name, newInfor, newCost, newQuantity, newStatus, newCategory_id, newBrand_id, newImage } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name) {
        return res.status(400).json({ error: 'Vui lòng cung cấp tên sản phẩm.' });
    }

    try {
        // Kiểm tra xem danh mục có tồn tại không nếu có cập nhật
        if (newCategory_id) {
            const category = await Category.findById(newCategory_id);
            if (!category) {
                return res.status(400).json({ error: 'Danh mục không tồn tại.' });
            }
        }

        // Kiểm tra xem thương hiệu có tồn tại không nếu có cập nhật
        if (newBrand_id) {
            const brand = await Brand.findById(newBrand_id);
            if (!brand) {
                return res.status(400).json({ error: 'Thương hiệu không tồn tại.' });
            }
        }

        // Tìm và cập nhật sản phẩm
        const updatedProduct = await Product.findOneAndUpdate(
            { name },
            { 
                ...(newInfor && { infor: newInfor }),
                ...(newCost && { cost: newCost }),
                ...(newQuantity && { quantity: newQuantity }),
                ...(newStatus && { status: newStatus }),
                ...(newCategory_id && { category: newCategory_id }),
                ...(newBrand_id && { brand: newBrand_id }),
                ...(newImage && { image: newImage })
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Sản phẩm không tồn tại.' });
        }

        res.status(200).json({ message: 'Sản phẩm đã được cập nhật thành công!', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Có lỗi xảy ra khi cập nhật sản phẩm.', details: error.message });
    }
});
router.get('/get-all-products', async (req, res) => {       
    try {
        const products = await Product.find({}).populate('category').populate('brand');
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching products', error: error.message });
    }
});





// api category
router.post('/add-category', async (req, res) => {
    const { name, description } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name) {
        return res.status(400).json({ error: 'Vui lòng cung cấp tên danh mục.' });
    }

    try {
        // Tạo danh mục mới
        const newCategory = new Category({
            name,
            description
        });

        // Lưu danh mục vào cơ sở dữ liệu
        await newCategory.save();

        res.status(201).json({ message: 'Danh mục đã được thêm thành công!', category: newCategory });
    } catch (error) {
        res.status(500).json({ error: 'Có lỗi xảy ra khi thêm danh mục.' });
    }
});

router.put('/update-category', async (req, res) => {
    const { name, newDescription } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !newDescription) {
        return res.status(400).json({ error: 'Vui lòng cung cấp tên danh mục và mô tả mới để cập nhật.' });
    }

    try {
        // Tìm và cập nhật danh mục
        const updatedCategory = await Category.findOneAndUpdate(
            { name },
            { description: newDescription },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Danh mục không tồn tại.' });
        }

        res.status(200).json({ message: 'Danh mục đã được cập nhật thành công!', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ error: 'Có lỗi xảy ra khi cập nhật danh mục.', details: error.message });
    }
});

router.delete('/delete-category', async (req, res) => {
    const { name } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name) {
        return res.status(400).json({ error: 'Vui lòng cung cấp tên danh mục.' });
    }

    try {
        // Tìm và xóa danh mục
        const deletedCategory = await Category.findOneAndDelete({ name });

        if (!deletedCategory) {
            return res.status(404).json({ error: 'Danh mục không tồn tại.' });
        }

        res.status(200).json({ message: 'Danh mục đã được xóa thành công!', category: deletedCategory });
    } catch (error) {
        res.status(500).json({ error: 'Có lỗi xảy ra khi xóa danh mục.', details: error.message });
    }
});

router.get('/get-all-categories', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching categories', error: error.message });
    }
});
router.get('/get-category-by-name/:category_name', async (req, res) => {
    const { category_name } = req.params;

    try {
        const category = await Category.findOne({ name: category_name });
        if (!category) {
            return res.status(404).json({ error: 'Danh mục không tồn tại.' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy danh mục.', details: error.message });
    }
});





//api brand
router.post('/add-brand', async (req, res) => {
    const { name, description, image} = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !image) {
        return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin.' });
    }

    try {
        // Tạo thương hiệu mới
        const newBrand = new Brand({
            name,
            description,
            image
        });

        // Lưu thương hiệu vào cơ sở dữ liệu
        await newBrand.save();

        res.status(201).json({ message: 'Thương hiệu đã được thêm thành công!', brand: newBrand });
    } catch (error) {
        res.status(500).json({ error: 'Có lỗi xảy ra khi thêm thương hiệu.' });
    }
});
router.delete('/delete-brand', async (req, res) => {
    const { name } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name) {
        return res.status(400).json({ error: 'Vui lòng cung cấp tên thương hiệu.' });
    }

    try {
        // Tìm và xóa thương hiệu
        const deletedBrand = await Brand.findOneAndDelete({ name });

        if (!deletedBrand) {
            return res.status(404).json({ error: 'Thương hiệu không tồn tại.' });
        }

        res.status(200).json({ message: 'Thương hiệu đã được xóa thành công!', brand: deletedBrand });
    } catch (error) {
        res.status(500).json({ error: 'Có lỗi xảy ra khi xóa thương hiệu.', details: error.message });
    }
});

router.put('/update-brand', async (req, res) => {
    const { name, newDescription, newImage } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || (!newDescription && !newImage)) {
        return res.status(400).json({ error: 'Vui lòng cung cấp tên thương hiệu và ít nhất một thông tin mới để cập nhật.' });
    }

    try {
        // Tìm và cập nhật thương hiệu
        const updatedBrand = await Brand.findOneAndUpdate(
            { name },
            { 
                ...(newDescription && { description: newDescription }),
                ...(newImage && { image: newImage })
            },
            { new: true }
        );

        if (!updatedBrand) {
            return res.status(404).json({ error: 'Thương hiệu không tồn tại.' });
        }

        res.status(200).json({ message: 'Thương hiệu đã được cập nhật thành công!', brand: updatedBrand });
    } catch (error) {
        res.status(500).json({ error: 'Có lỗi xảy ra khi cập nhật thương hiệu.', details: error.message });
    }
});

router.get('/get-all-brands', async (req, res) => {
    try {
        const brands = await Brand.find({});
        res.status(200).send(brands);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching brands', error: error.message });
    }
});
router.get('/get-brand-by-name/:brand_name', async (req, res) => {
    const { brand_name } = req.params;

    try {
        const brand = await Brand.findOne   ({ name: brand_name });
        if (!brand) {
            return res.status(404).json({ error: 'Thương hiệu không tồn tại.' });
        }
        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy thương hiệu.', details: error.message });
    }
});


module.exports = router;