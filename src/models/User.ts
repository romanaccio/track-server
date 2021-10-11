import bcrypt = require('bcrypt');
// import mongoose = require('mongoose');
import { model, Schema } from 'mongoose';

export interface User {
  email: string;
  password: string;
}

const userSchema = new Schema<User>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

interface UserBaseDocument extends User {
  comparePassword(candidatePassword: string): boolean;
}

userSchema.pre('save', function (next) {
  // on utilise function plutôt qu'un fonction fléchée
  // afin que 'this' fasse référence au user (c'est une
  // subtilité de JS)
  const user = this;
  if (!user.isModified('password')) {
    // pas de modif du password : on continue
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (
  this: UserBaseDocument,
  candidatePassword: string
) {
  const user = this;

  return new Promise((resolve, reject) => {
    // on utilise les Promise à cause de bcrypt
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      if (!isMatch) {
        return reject(false);
      }
      resolve(true);
    });
  });
};
model<User>('User', userSchema);
