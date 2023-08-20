const router = require("express").Router();
const Product = require("../models/productModel.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const cloudinary = require("../config/cloudinaryConfig.js");
const multer = require("multer");
// const cors = require("cors");

// router.use(cors);

router.post("/add-product", authMiddleware, async function(req, res) {
    try 
    {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.send({
            success: true,
            message: "Product added successfully!"
        });
    } 
    catch (error) 
    {
        res.send({
            success: false,
            message: error.message
        });    
    }
});

router.post("/get-products", async function(req, res) {
    try 
    {
        const {seller, category = [], age = [], status} = req.body; 
        let filters = {};
        if(seller)
        {
            filters.seller = seller;
        }
        if(status)
        {
            filters.status = status;
        }

        //filter by category
        if(category.length > 0)
        {
            filters.category = {$in: category};
        }

        //filter by age
        if(age.length > 0)
        {
            age.forEach(function(item) {
                const fromAge = item.split("-")[0];
                const toAge = item.split("-")[1];
                filters.age = {$gte: fromAge, $lte: toAge};
            });
        }

        const Products = await Product.find(filters).populate("seller").sort({createdAt: -1});
        res.send({
            success: true,
            data: Products
        });    
    } 
    catch (error) 
    {
        res.send({
            success: false,
            message: error.message
        });    
    }
});

router.get("/get-product-by-id/:id", async function(req, res) {
    try 
    {
        const product = await Product.findById(req.params.id).populate("seller");
        res.send({
            success: true,
            data: product
        });    
    } 
    catch (error) 
    {
        res.send({
            success: false,
            message: error.message
        });
    }
});

router.put("/edit-product/:id", authMiddleware, async function(req, res) {
    try 
    {
        await Product.findByIdAndUpdate(req.params.id, req.body);
        res.send({
            success: true,
            message: "Product updated successfully!"
        });
    } 
    catch (error) 
    {
        res.send({
            success: false,
            message: error.message
        });
    }
});

router.delete("/delete-product/:id", authMiddleware, async function(req, res) {
    try 
    {
        await Product.findByIdAndDelete(req.params.id);
        res.send({
            success: true,
            message: "Product deleted successfully!"
        });
    }
    catch (error) 
    {
        res.send({
            success: false,
            message: error.message
        });
    }
});

//get image from pc
const storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

router.post("/upload-image-to-product", authMiddleware, multer({storage: storage}).single("file"), async function(req, res) {
    try 
    {
        //upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {folder: "SecondHand Utopia"});
        const productId = req.body.productId;
        await Product.findByIdAndUpdate(productId, {$push: {images: result.secure_url}});
        res.send({
            success: true,
            message: "Image uploaded successfully!",
            data: result.secure_url
        });
    } 
    catch (error) 
    {
        res.send({
            success: false,
            message: error.message
        });
    }
});

router.put("/update-product-status/:id", authMiddleware, async function(req, res) {
    try 
    {
        const {status} = req.body;
        await Product.findByIdAndUpdate(req.params.id, {status});
        res.send({
            success: true,
            message: "Product status updated successfully!"
        });
    } catch (error) 
    {
        res.send({
            success: false,
            message: error.message
        });    
    }
})

module.exports = router;