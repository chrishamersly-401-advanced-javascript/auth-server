'use strict';

const superagent = require('superagent');
const Users = require('../models/users-model.js');
const express = require('express');
require('dotenv').config();

const tokenServerUrl = 'https://github.com/login/oauth/access_token'; 
const remoteAPI = process.env.REMOTE_API;

const API_SERVER = process.env.API_SERVER;
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
console.log('in the oath route');

module.exports = async function authorize(req, res, next) {
  console.log('in auth function');
  console.log('CLIENT_ID', CLIENT_ID);
  try {
    console.log('in try in the oauth');
    let code = req.query.code;
    console.log('(1) CODE:', code);
    let remoteToken =  await exchangeCodeForToken(code);
    console.log('(2) ACCESS TOKEN:', remoteToken);

    let remoteUser = await getRemoteUserInfo(remoteToken);
    console.log('(3) GITHUB USER', remoteUser);

    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    console.log('(4) LOCAL USER', user);

    next();
  } catch (e) { next(`ERROR: ${e.message}`); }

};

async function exchangeCodeForToken(code) {
  let tokenResponse = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code',
  });
  let access_token = tokenResponse.body.access_token;
  return access_token;
}

async function getRemoteUserInfo(remotetoken) {
  let userResponse =
    await superagent.get(remoteAPI)
      .set('user-agent', 'express-app')
      .set('Authorization', `token ${remotetoken}`);

  let user = userResponse.body;

  return user;

}

async function getUser(remoteUser) {
  let user =  Users.createFromOauth(remoteUser.login);
  let token = user.generateToken();
  return [user, token];
}