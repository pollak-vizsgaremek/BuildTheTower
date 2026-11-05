import bcrypt from "bcrypt";

export function encrypt(password) {
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
}

export function passwordCompare(
  password,
  encryptedPassword,
) {
  return bcrypt.compareSync(password, encryptedPassword);
}
