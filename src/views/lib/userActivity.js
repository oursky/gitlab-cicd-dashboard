const userActivity = {
  userIsActive: true,
  resetTimeout: function () {
    clearTimeout(
      setTimeout(setTimeout(() => (this.userIsActive = false), 30000))
    );
    this.userIsActive = true;
  },
  getUserActivity: function () {
    return this.userIsActive;
  },
};
