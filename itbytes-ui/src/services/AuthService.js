import axios from "axios";

const apiUrl = import.meta.env.VITE_USER_API_URL;

export const isEmailAvailable = async (email) => {
  try {
    const response = await axios.get(apiUrl);
    return !response.data.some(user => user.email === email);
  } catch (error) {
    console.error("Email validation failed:", error);
    throw new Error("Email validation failed");
  }
};

export const registerUser = async (values, accountType) => {
  const payload = {
    firstname: values.firstName,
    lastname: values.lastName,
    middlename: values.middleName,
    role: accountType === 'business' ? 'business' : values.role,
    email: values.email,
    password: values.password,
    isAuth: "pending",
    isDeleted: false,
  };

  try {
    const response = await axios.post(apiUrl, payload);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw new Error("Registration failed");
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${apiUrl}/login`, {email, password});
    console.log("Fetched user:", apiUrl); // Debugging line to check fetched users
    const user = response.data;

    if (!user) return { error: "Invalid email or password." };

    if (user.isDeleted || user.isAuth === 'rejected' || user.isAuth === 'pending') {
      return { error: "Your account has not yet been approved. Please contact support." };
    }

    return { user };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const logoutUser = async (userId) => {
  try {
    const data = { userId: userId }
    await axios.post(`${apiUrl}/logout`, data);
    console.log("User logged out:", data); // Debugging line to check fetched users
  } catch (error) {
    console.error("Logout error:", error);
    return { error: "Something went wrong. Please try again." };
  }
};