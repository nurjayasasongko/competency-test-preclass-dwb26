const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const session = require("express-session");
const port = 5000;

const dbConnection = require("./config/db");
const uploadFile = require("./middlewares/uploads");
const getTypeData = require("./middlewares/getTypeData");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

hbs.registerPartials(__dirname + "/views/partials");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    cookie: {
      maxAge: 2 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true,
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: "secretValue",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Home Page
app.get("/", (req, res) => {
  // Get Hero Data
  let query = `SELECT heroes_tb.id,heroes_tb.name,heroes_tb.photo,types_tb.name AS type_name FROM heroes_tb INNER JOIN types_tb ON type_id = types_tb.id ORDER BY heroes_tb.id DESC`;
  dbConnection.query(query, (err, rows) => {
    let data;
    if (err) throw err;

    if (rows.length === 0) {
      console.log("data Kosong");
      data = "";
      res.render("index", {
        datas: data,
      });
    } else {
      data = rows;
      res.render("index", {
        datas: data,
        isLogin: req.session.isLogin,
      });
    }
  });
});

// Add hero
app.get("/add-hero", getTypeData, (req, res) => {
  res.render("addHero", {
    isLogin: req.session.isLogin,
    admin: true,
    typeData: req.typeData,
  });
});

app.post("/add-hero", uploadFile("photo"), (req, res, next) => {
  let { name, type } = req.body;
  let photo = req.file.filename;

  let error = false;

  if (name.length === 0 || type.length === 0) {
    console.log("Please enter complete product data");
    res.render("addHero", {
      name,
      type,
      error: true,
    });
  } else {
    let query = ` INSERT INTO heroes_tb (name,type_id,photo) VALUES ("${name}","${type}","${photo}")`;
    dbConnection.query(query, (err, rows) => {
      if (err) throw err;
      res.redirect("/");
    });
  }
});

// Add Hero Type
app.get("/add-type", (req, res) => {
  res.render("addType", {
    isLogin: req.session.isLogin,
    admin: true, //delet
  });
});

app.post("/add-type", (req, res, next) => {
  let { name } = req.body;

  if (name.length === 0) {
    console.log("Please enter complete product data");
    res.render("addType", {
      name,
      error: true,
    });
  } else {
    let query = ` INSERT INTO types_tb (name) VALUES ("${name}")`;
    dbConnection.query(query, (err, rows) => {
      if (err) throw err;
      res.redirect("/");
    });
  }
});

// Update Hero
app.get("/edit-hero/(:id)", getTypeData, (req, res) => {
  let id = req.params.id;
  let query = `SELECT * FROM heroes_tb WHERE id = ${id}`;

  dbConnection.query(query, (err, rows, field) => {
    if (err) throw err;
    res.render("edit", {
      id: rows[0].id,
      name: rows[0].name,
      type: rows[0].type_name,
      photo: rows[0].photo,
      typeData: req.typeData,
    });
  });
});

app.post("/proses-edit/:id", uploadFile("photo"), (req, res) => {
  let id = req.params.id;
  let { name, type, oldPhoto } = req.body;
  let photo = oldPhoto;

  if (req.file) {
    photo = req.file.filename;
  }
  let error = false;

  if (name.length === 0 || type.length === 0) {
    console.log("Please enter complete product data");
    res.render("edit", {
      name,
      type,
      error: true,
    });
  }

  let query = `UPDATE heroes_tb SET 
      name = "${name}",
      type_id = "${type}",
      photo = "${photo}"
      WHERE id = "${id}"`;

  dbConnection.query(query, (err, rows, field) => {
    if (err) throw err;
    res.redirect("/");
  });
});

//Delete Hero
app.get("/delete-hero/(:id)", (req, res) => {
  let id = req.params.id;
  let query = `DELETE FROM heroes_tb WHERE id = ${id}`;
  dbConnection.query(query, (err, rows) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// Detail Hero
app.get("/detail-hero/(:id)", (req, res) => {
  let id = req.params.id;
  // let query = `SELECT * FROM heroes_tb WHERE id = ${id}`;
  let query = `SELECT heroes_tb.id,heroes_tb.name,heroes_tb.photo,types_tb.name AS type_name FROM heroes_tb  INNER JOIN types_tb ON type_id = types_tb.id WHERE heroes_tb.id = ${id}`;

  dbConnection.query(query, (err, rows, field) => {
    if (err) throw err;
    console.log(rows);
    res.render("detail", {
      id: rows[0].id,
      name: rows[0].name,
      type: rows[0].type_name,
      photo: rows[0].photo,
    });
  });
});

app.listen(port, () => {
  console.log(`Server is Running at Port: $(port)`);
});
