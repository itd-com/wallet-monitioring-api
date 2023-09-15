const crypto = require('crypto');
const addDays = require('date-fns/addDays');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();
const fs = require('fs');

const publicEncrypt = (input) => {
      // Read keys from file system
      const publicKeyPath = process.env.PUBLIC_KEY_PATH || '';
      const publicKey = fs.readFileSync(process.cwd() + publicKeyPath, 'utf-8');

      // Convert the message to a Buffer so we can encrypt it
      const messageBuffer = Buffer.from(input, 'utf8');

      // Encrypt the message using the public key
      const encryptedMessage = crypto.publicEncrypt(publicKey, messageBuffer);

      return encryptedMessage.toString('base64');
};

exports.seed = async (knex) => {
      const now = new Date();

      await knex('users').insert([
            {
                  name: 'ta',
                  email: 'natthawat.n@waanx.com',
                  username: 'natthawat.n',
                  passwordEcd: publicEncrypt('Test1234!'),
                  role: 'ADMIN',
                  accessToken: publicEncrypt(`natthawat.n=${addDays(now, 1).toISOString()}`),
                  accessTokenExpire: addDays(now, 1),
                  apiToken: publicEncrypt(`natthawat.n=${addDays(now, 1).toISOString()}`),
                  apiTokenExpire: addDays(now, 30),
                  externalApiToken: publicEncrypt(`natthawat.n=${addDays(now, 1).toISOString()}`),
                  externalApiTokenExpire: addDays(now, 30),
            },
            {
                  name: 'pan',
                  email: 'pan.j@waanx.com',
                  username: 'pan.j',
                  passwordEcd: publicEncrypt('Test1234!'),
                  role: 'ADMIN',
                  accessToken: publicEncrypt(`pan.j=${addDays(now, 1).toISOString()}`),
                  accessTokenExpire: addDays(now, 1),
                  apiToken: publicEncrypt(`pan.j=${addDays(now, 1).toISOString()}`),
                  apiTokenExpire: addDays(now, 30),
                  externalApiToken: publicEncrypt(`pan.j=${addDays(now, 1).toISOString()}`),
                  externalApiTokenExpire: addDays(now, 30),
            },
            {
                  name: 'kittipong',
                  email: 'kittipong.s@waanx.com',
                  username: 'kittipong.s',
                  passwordEcd: publicEncrypt('Test1234!'),
                  role: 'ADMIN',
                  accessToken: publicEncrypt(`kittipong.s=${addDays(now, 1).toISOString()}`),
                  accessTokenExpire: addDays(now, 1),
                  apiToken: publicEncrypt(`kittipong.s=${addDays(now, 1).toISOString()}`),
                  apiTokenExpire: addDays(now, 30),
                  externalApiToken: publicEncrypt(`kittipong.s=${addDays(now, 1).toISOString()}`),
                  externalApiTokenExpire: addDays(now, 30),
            },
      ]);
};
