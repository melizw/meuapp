const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use(
    session({
        secret: "segredo123",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 10 },
    })
);

let produtos = [];

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.post("/login", (req, res) => {
    const { usuario, senha } = req.body;

    if (usuario === "admin" && senha === "123") {
        req.session.user = usuario;
        res.cookie("ultimoAcesso", new Date().toLocaleString(), {
            maxAge: 1000 * 60 * 60,
        });
        return res.redirect("/produtos");
    }

    return res.send("<h3>Usuário ou senha incorretos!</h3><a href='/'>Voltar</a>");
});

app.get("/produtos", (req, res) => {
    if (!req.session.user) {
        return res.send("<h3>Você precisa estar logado!</h3><a href='/'>Login</a>");
    }
    res.sendFile(path.join(__dirname, "views", "produtos.html"));
});

app.post("/cadastrar", (req, res) => {
    if (!req.session.user) {
        return res.send("Você não está logado!");
    }

    produtos.push(req.body);
    res.redirect("/produtos");
});

app.get("/listar", (req, res) => {
    res.json({
        ultimoAcesso: req.cookies.ultimoAcesso || "Nenhum",
        produtos: produtos,
    });
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
