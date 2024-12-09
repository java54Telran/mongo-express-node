import express from 'express';
export const accounts_route = express.Router();
import asyncHandler from 'express-async-handler';
import { ACCOUNTS_ACCOUNT, ACCOUNTS_LOGIN, ACCOUNTS_SET_ROLE, DELETE_GET_ACCOUNT } from '../config/pathes.mjs';
import { accountsService } from '../config/service.mjs';
import { getError } from '../errors/error.mjs';
accounts_route.post(ACCOUNTS_ACCOUNT, asyncHandler(async (req, res) => {
    const account = await accountsService.insertAccount(req.body);
    res.status(201).json(account);
}));
accounts_route.put(ACCOUNTS_ACCOUNT, asyncHandler(async (req, res) => {
    if(req.user != req.body.username) {
        throw getError(403, "");
    }
   const account = await accountsService.updatePassword(req.body);
   res.status(200).json(account);
}));
accounts_route.get(DELETE_GET_ACCOUNT, asyncHandler(async (req, res) => {
    if(req.user != req.body.username && req.role != "ADMIN") {
        throw getError(403, "");
    }
    const account = await accountsService.getAccount(req.params.username);
   res.status(200).json(account);
}))
accounts_route.delete(DELETE_GET_ACCOUNT, asyncHandler(async (req, res) => {
    const account = await accountsService.deleteAccount(req.params.username);
   res.status(200).json(account);
}))
accounts_route.post(ACCOUNTS_LOGIN, asyncHandler(async (req, res) => {
    const result = await accountsService.login(req.body);
    res.status(200).json(result);
}))
accounts_route.put(ACCOUNTS_SET_ROLE,  asyncHandler(async (req, res) => {
    const header = req.header("Authorization");
    if (!header?.startsWith("Basic ")) {
        throw getError(401, '');
    }
    const usernamePassword = Buffer.from(header.substring(6), "base64").toString("ascii").split(":");
    const [username, password] = usernamePassword;
    if (username !== process.env.SET_ROLE_USERNAME || password !== process.env.SET_ROLE_PASSWORD) {
        throw getError(401, '');
    }
    const account = await accountsService.setRole(req.body);
   res.status(200).json(account);
}))