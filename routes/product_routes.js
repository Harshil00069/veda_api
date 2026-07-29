// const express = require("express");
// const router = express.Router();
// const {register,login} = require("../controller/product_controller");

import express from "express";

import   {
  register,
  login,
}from "../controller/product_controller.js";;

const router = express.Router();


router.route("/register").get(register);
router.route("/login").get(login);





export default router;