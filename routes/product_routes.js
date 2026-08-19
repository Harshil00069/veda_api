// const express = require("express");
// const router = express.Router();
// const {register,login} = require("../controller/product_controller");

import express from "express";

import   {
  register,
  login,
  registerAdmin,
  adminLogin
}from "../controller/product_controller.js";;

const router = express.Router();


router.route("/register").post(register);
router.route("/registerAdmin").post(registerAdmin);
router.route("/login").post(login);
router.route("/adminLogin").post(adminLogin);



export default router;