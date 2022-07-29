#!/usr/bin/env ts-node

require('dotenv').config()

import * as program from 'commander'

const prompt = require("prompt-async");

import { loginAccount } from '../lib/accounts/registration'

import { ensureAccessToken } from '../lib/access_tokens'

import { Socket } from '../ws/client'

program
  .command('logs')
  .action(async () => {

    let {email, password} = await prompt.get([{
      name: 'email',
      required: true
    }, {
      name: 'password',
      hidden: true,
      conform: function () {
        return true;
      }
    }])

    let account = await loginAccount({email, password})

    const token = await ensureAccessToken(account);

    const jwt = token.jwt

    let socket = new Socket({ token: jwt })

    socket.on('authenticated', () => {

      console.log('socket.authenticated')

    })

    socket.on('account.event', data => {

      const { type, payload } = data

      console.log({ type }, JSON.stringify(payload))

    })

  })

program.parse(process.argv) 

