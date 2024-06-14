const express = require('express');
const db = require('./connect.js');

const app = express();
const port = 3001;
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

//===========================================================

app.get("/Category", async (req, res) => {
    try {

        const Category = await db.query("SELECT * FROM Category");

        res.status(200).json(Category);
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

//===========================================================

app.get("/Product", async (req, res) => {
    try {

        const Product = await db.query("SELECT * FROM Product");

        res.status(200).json(Product);
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});


app.post("/INproduct", upload.single('image'), async (req, res) => {
    try {
        // ตรวจสอบว่า req.file ไม่ได้เป็นค่า undefined ก่อนที่จะใช้งาน
        if (req.file) {
            const { productName, description, price, quantityAvailable, category, Sellerid } = req.body;
            const image = req.file.filename;
            console.log("ตรวจสอบค่าที่ถูกส่งมา:");
            console.log("Product Name:", productName);
            console.log("Description:", description);
            console.log("Price:", price);
            console.log("Quantity Available:", quantityAvailable);
            console.log("Image:", image);
            console.log("Category:", category);
            await db.query(`INSERT INTO Product (Productname, Description, Price, QuantityAvailable, ImageURL, Categoryid, Sellerid) VALUES 
            ('${productName}', '${description}', '${price}', '${quantityAvailable}', '${image}', '${category}', '${Sellerid}')`);
            res.status(201).json({ message: "Product created successfully" });
        } else {
            // ถ้าไม่มี req.file ให้ส่งข้อความผิดพลาดกลับไป
            res.status(400).json({ error: "No image file provided" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/editproduct",  async (req, res) => {
    try {
            const { Productid, Productname, Description, Price, QuantityAvailable, Categoryid ,ImageURL} = req.body;
            console.log("ตรวจสอบค่าที่ถูกส่งมา:");
            console.log("Product Name:", Productname);
            console.log("Description:", Description);
            console.log("Price:", Price);
            console.log("Quantity Available:", QuantityAvailable);
            console.log("Image:", ImageURL);
            console.log("Category:", Categoryid);

            await db.query(`UPDATE Product SET Productname = '${Productname}', Description = '${Description}', Price = ${Price}
            , QuantityAvailable = ${QuantityAvailable}, ImageURL = '${ImageURL}', Categoryid = ${Categoryid} WHERE Productid = ${Productid}`);
            res.status(201).json({ message: "Product updated successfully" });
        }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || "Internal server error" });
    }
});

app.post("/deleteproduct", async (req, res) => {
    try {
        const { Productid } = req.body;
        if (!Productid) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        console.log("Product ID:", Productid);

        await db.query(`DELETE FROM Product WHERE Productid = ${Productid}`);

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || "Internal server error" });
    }
});


//===========================================================

app.get("/User", async (req, res) => {
    try {
        const User = await db.query("SELECT * FROM [User]");

        res.status(200).json(User);
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

app.post("/InUser", async (req, res) => {
    try {
        const { username, password, email, name, Address, Phone } = req.body;
        await db.query(`INSERT INTO [User] (Username, Password, Mail, Name, Address, Phone) VALUES 
        ('${username}', '${password}', '${email}', '${name}', '${Address}', '${Phone}')`);

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/edituser", async (req, res) => {
    try {
        const { Userid, Mail, Name, Address, Phone } = req.body;
        console.log(Address);
        console.log(Mail);
        console.log(Name);
        console.log(Address);
        console.log(Phone);
        await db.query(`UPDATE [User] SET Mail = '${Mail}', Name = '${Name}', Address = '${Address}', Phone = '${Phone}' WHERE Userid = '${Userid}'`);
        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});


//==============================================================

app.get("/like", async (req, res) => {
    try {
        const User = await db.query("SELECT * FROM [like]");

        res.status(200).json(User);
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
});

app.post("/inlike", async (req, res) => {
    try {
        const {Userid,Productid} = req.body;
        console.log(Userid);
        console.log(Productid);
        await db.query(`INSERT INTO [like] (Userid, Productid) VALUES 
        ('${Userid}', '${Productid}')`);

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

//==============================================================

app.use('/public/image', express.static(path.join(__dirname, 'public/image')));
app.use('/img', express.static(path.join(__dirname, 'img')));