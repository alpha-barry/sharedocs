const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const Sequelize = require('sequelize');
const sequelize = require('./models').sequelize;
const User = require('./models/user')(sequelize, Sequelize.DataTypes);
const Room = require('./models/room')(sequelize, Sequelize.DataTypes);
const Docs = require('./models/docs')(sequelize, Sequelize.DataTypes);

const UserRooms = require('./models/userrooms')(sequelize, Sequelize.DataTypes);

Room.belongsToMany(User, { through: 'UserRooms' });
User.belongsToMany(Room, { through: 'UserRooms' });

const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const fs = require('fs');
const cookieParser = require('cookie-parser')

const multer = require('multer');
const helmet = require("helmet");
const upload = multer({ storage: multer.memoryStorage() })

app.set("views", "./views");
app.set("view engine", 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser());
/*app.use(helmet({
    frameguard: false,
}));*/

app.use(helmet.frameguard())

app.use("/static", express.static('./static/'));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('a user diconnected');
    });
});

app.get("/", (req, res) => {
    return res.render("index", { token: "token" });
});

app.get("/signup", (req, res) => {
    console.log(req.cookies);
    let mes = 'test';
    return res.render("signup", { mes: mes });
});

app.post("/signup", (req, res) => {

    console.log("OK");

    if (!validator.isEmail(req.body.email)) {
        res.status(400);
        return res.json({
            emailErr: "email invalide.",
            passwordErr: "",
            confirmationErr: "",
        });
    }

    if (req.body.password.length < 4) {
        res.status(400);
        return res.json({
            emailErr: "",
            passwordErr: "le mot de passe doit contenir au moin 4 caratères.",
            confirmationErr: "",
        });
    }

    if (req.body.confirmation !== req.body.password) {
        res.status(400);
        return res.json({
            emailErr: "",
            passwordErr: "",
            confirmationErr: "Confirmation different du mot de passe.",
        });
    }

    User.findOne({
        attributes: ['email'],
        where: { email: req.body.email }
    }).then((userFind) => {
        if (!userFind) {
            bcrypt.hash(req.body.password, 10).then(hash => {
                User.create({
                    email: req.body.email,
                    password: hash,
                }).then(user => {
                    res.status(200);
                    return res.json({
                        emailErr: "Utilisateur crée",
                        passwordErr: "",
                        confirmationErr: "",
                    });
                });
            }).catch(err => {
                return res.status(500);
            });


        } else {
            res.status(400);
            return res.json({
                emailErr: "Utilisateur déja existant",
                passwordErr: "",
                confirmationErr: "",
            });
        }
    }).catch((err) => {
        return res.status(500);
    })
});

app.get("/login", (req, res) => {
    return res.render("login");
});

app.post("/login", (req, res) => {

    User.findOne({
        where: { email: req.body.email }
    }).then((userFind) => {
        if (!userFind) {
            res.status(400);
            return res.json({
                type: "email",
                msg: "email inexistant",
            });
        }

        bcrypt.compare(req.body.password, userFind.password).then(valid => {
            if (!valid) {
                return res.status(401).json({
                    type: "pwd",
                    msg: "mot de passe incorrecte",
                });
            } else {
                res.cookie("access_token", jwt.sign(
                    { userId: userFind.id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                ), {
                    httpOnly: true,
                    secure: false,
                });

                return res.status(200).json({
                    type: "",
                    msg: "",
                });
            }
        }).catch(error => res.status(500).json({
            type: "serveur",
            msg: "Une erreur est survenue",
         }));

    }).catch((err) => {
        res.end("ERROR");
    })
});

const auth = (req, res, next) => {
    jwt.verify(req.cookies.access_token, 'RANDOM_TOKEN_SECRET', (err, decoded) => {
        if (err) {
            return res.status(401).json('token_not_valid');
        } else {
            req.body.userId = decoded.userId;
            next();
        }
    });
}

app.get("/rooms", auth, (req, res) => {

    /*  Room.findAll({
          attributes: ['name'],
          //where: [],
      }).then(rooms => {
          rooms.forEach(room => {
              console.log(room);
          });
      });/*.then(rooms => {
          rooms.forEach(room => {
              console.log(room.name);
          });
      }).catch(err => {
          res.status(500).json({ err });
      }) */

    res.render('rooms');
})

app.post("/rooms", auth, upload.single('file'), (req, res) => {
      Room.create({
          name: req.body.name,
        
      }).then(user => {
          console.log("ROOM CRETE");
          res.status(200);
          return res.json({
              emailErr: "Utilisateur crée",
              passwordErr: "",
              confirmationErr: "",
          });
      }).catch(err => res.status(300));
})

app.post('/sendFile', upload.single('file'), (req, res) => {

    if (req.file != null) {
        Docs.create({
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            file: req.file.buffer,
        });
    }

    res.end();
})

app.get("/getFile", async (req, res) => {
    /*  if (req.file != null) {
          var fileName = req.file.originalname;
          var fileContents = Buffer.from(req.file.buffer, "base64");
          var savedFilePath = 'C:/Users/alpha/Documents' + fileName; // in some convenient temporary file folder
  
          fs.writeFile(savedFilePath, fileContents, function () {
              res.download(savedFilePath);
          });
      }*/

      

    try {
        const docs = await Docs.findAll();

        /*console.log(docs[docs.length - 1].file);

        var fileName = "CV.pdf";//req.file.originalname;
        var fileContents = Buffer.from(docs[docs.length - 1].file, "base64");
        var savedFilePath = 'C:/Users/alpha/Documents' + fileName; // in some convenient temporary file folder

        fs.writeFile(savedFilePath, fileContents, function () {
            //console.log(fileContents);
            res.json(savedFilePath);
        });*/

        res.json({
            originalname: docs[docs.length - 1].originalname,
            mimetype: docs[docs.length - 1].mimetype,
            file: docs[docs.length - 1].file,
        });
    } catch (err) {
        console.log(err);
    }

    res.end();
})

app.get('/checkout', (req, res) => {
    res.render('checkout');
})

server.listen(8080, () => {
    console.log("Le serveur écoute sur le port 8080");
})