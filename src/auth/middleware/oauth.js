'use strict';

const superagent = require('superagent');
const Users = require('../models/users-model.js');
const express = require('express');
require('dotenv').config();

const tokenServerUrl = 'https://github.com/login/oauth/access_token'; 
const remoteAPI = process.env.REMOTE_API;

const API_SERVER = process.env.API_SERVER;
const CLIENT_ID = '20890cdbd3f7991d7d1e';
const CLIENT_SECRET = '385dbe4e6f30bcc22c5fc278002f70a23eedff2f';
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
  console.log('made it to the exchange function');
  let tokenResponse = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: '20890cdbd3f7991d7d1e',
    client_secret: '385dbe4e6f30bcc22c5fc278002f70a23eedff2f',
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code',
  });
  console.log('made it below the exchange function');
  // console.log('tokenResponse.body', tokenResponse);
  let remoteToken = tokenResponse.body.access_token;
  console.log('tokenResponse.response.body',tokenResponse.response.body);

  return remoteToken;

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