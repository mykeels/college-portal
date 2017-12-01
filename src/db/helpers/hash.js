/**
 * one-way hashing, useful for passwords
 */

import bcrypt from 'bcrypt'

/**
 * 
 * @param {String} entry the data you intend to hash
 */
export const hash = (entry) => {
    return new Promise(function(resolve, reject) {
      bcrypt.genSalt(10, function(err, salt) {
        if (err) return reject(err);
        bcrypt.hash(entry, salt, function(err, hash) {
          if (err) return reject(err);
          return resolve(hash);
        })
      })
    })
}