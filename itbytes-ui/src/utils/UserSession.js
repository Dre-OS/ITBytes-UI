const USER_KEY = "userData";

const UserSession = {
  set(user) {
    const userData = {
      userId: user._id,
      isAuthenticated: true,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role
    };
    sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
  },

  get() {
    const data = sessionStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  isAuthenticated() {
    const user = this.get();
    return user?.isAuthenticated === true;
  },

  getRole() {
    return this.get()?.role || null;
  },

  clear() {
    sessionStorage.removeItem(USER_KEY);
  }
};

export default UserSession;
