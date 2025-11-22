const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: "segredo-top",
        resave: false,
        saveUninitialized: true,
    })
);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));
let produtos = [];
app.get("/", (req, res) => {
    res.redirect("/api/login");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.post("/login", (req, res) => {
    const { usuario, senha } = req.body;

    if (usuario === "admin" && senha === "123") {
        req.session.user = usuario;
        res.cookie("ultimoAcesso", new Date().toLocaleString());
        return res.redirect("/api/cadastro");
    }

    res.send("Usuário ou senha inválidos.");
});
app.get("/cadastro", (req, res) => {
    if (!req.session.user) {
        return res.send("Você precisa fazer login.");
    }

    const ultimoAcesso = req.cookies.ultimoAcesso || "Primeiro acesso";

    res.render("cadastro", { ultimoAcesso });
});
app.post("/cadastro", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/api/login");
    }

    const novoProduto = {
        codigo: req.body.codigo,
        descricao: req.body.descricao,
        precoCusto: req.body.precoCusto,
        precoVenda: req.body.precoVenda,
        dataValidade: req.body.dataValidade,
        estoque: req.body.estoque,
        fabricante: req.body.fabricante,
    };

    produtos.push(novoProduto);

    res.redirect("/api/produtos");
});

app.get("/produtos", (req, res) => {
    if (!req.session.user) return res.redirect("/api/login");

    res.render("produtos", {
        lista: produtos,
        ultimoAcesso: req.cookies.ultimoAcesso,
    });
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.clearCookie("ultimoAcesso");
    res.redirect("/api/login");
});
module.exports = app;
