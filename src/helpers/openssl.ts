import crypto from 'crypto';

require('dotenv').config();
const fs = require('fs');

// Read keys from file system
const publicKeyPath = process.env.PUBLIC_KEY_PATH || '';
const publicKey = fs.readFileSync(process.cwd() + publicKeyPath, 'utf-8');

const privateKeyPath = process.env.PRIVATE_KEY_PATH || '';
const privateKey = fs.readFileSync(process.cwd() + privateKeyPath, 'utf-8');

export namespace OpensslHelper {
    export const publicEncrypt = (input: string): string => {
        // Convert the message to a Buffer so we can encrypt it
        const messageBuffer = Buffer.from(input, 'utf8');

        // Encrypt the message using the public key
        const encryptedMessage = crypto.publicEncrypt(publicKey, messageBuffer);

        return encryptedMessage.toString('base64');
    };

    export const privateDecrypt = (input: string): string => {
        // Convert the encryptedMessage to a Buffer so we can decrypt it
        const encryptedBuffer = Buffer.from(input, 'base64');
        // Decrypt the message using the private key
        const decryptedMessage = crypto.privateDecrypt(privateKey, encryptedBuffer);

        return decryptedMessage.toString('utf8');
    };
}
