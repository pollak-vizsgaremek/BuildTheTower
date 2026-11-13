import bcrypt from 'bcryptjs';

export const encrypt = password => bcrypt.hash(password, 12);
export const passwordCompare = (password, encryptedPassword) => bcrypt.compare(password, encryptedPassword);
