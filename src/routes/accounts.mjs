import express from 'express';
export const accounts_route = express.Router();
import asyncHandler from 'express-async-handler';
import AccountsService from '../service/AccountsService.mjs';
import { ACCOUNTS_ACCOUNT, DELETE_GET_ACCOUNT } from '../config/pathes.mjs';
const accountsService = new AccountsService(process.env.MONGO_URI, process.env.DB_NAME);
accounts_route.post(ACCOUNTS_ACCOUNT, asyncHandler(async (req, res) => {
    const account = await accountsService.insertAccount(req.body);
    res.status(201).json(account);
}));
accounts_route.put(ACCOUNTS_ACCOUNT, asyncHandler(async (req, res) => {
   const account = await accountsService.updatePassword(req.body);
   res.status(200).json(account);
}));
accounts_route.get(DELETE_GET_ACCOUNT, asyncHandler(async (req, res) => {
    const account = await accountsService.getAccount(req.params.username);
   res.status(200).json(account);
}))
accounts_route.delete(DELETE_GET_ACCOUNT, asyncHandler(async (req, res) => {
    const account = await accountsService.deleteAccount(req.params.username);
   res.status(200).json(account);
}))