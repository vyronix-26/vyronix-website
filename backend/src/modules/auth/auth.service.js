const bcrypt = require("bcryptjs");

const authRepository = require("./auth.repository");
const AppError = require("../../utils/AppError");
const generateToken = require("../../utils/generateToken");

const signup = async ({ fullName, email, password }) => {
  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await authRepository.createUser({
    fullName,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user);

  return {
    user,
    token,
  };
};

const login = async ({ email, password }) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  const safeUser = {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    role: user.role,
  };

  const token = generateToken(safeUser);

  return {
    user: safeUser,
    token,
  };
};

module.exports = {
  signup,
  login,
};