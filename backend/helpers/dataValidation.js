// Custom email validation
exports.validateEmail = (email) => {
  const regEx = /^[a-zA-Z\d_-]+@[a-zA-Z\d_-]+\.[a-zA-Z\d\.]{2,}$/
  return regEx.test(email)
};

// Custom name validation
exports.validateName = (name) => {
  const regEx = /^[a-zA-Z\s]+$/
  return regEx.test(name)
};

// Custom phone validation
exports.validatePhone = (phone) => {
  const regEx = /^[0-9]{10}$/
  return regEx.test(phone)
}
