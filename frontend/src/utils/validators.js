// Email validation
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Password strength validation
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Phone validation (Indian)
export const isValidPhone = (phone) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
};

// Pincode validation
export const isValidPincode = (pincode) => {
  const regex = /^[1-9][0-9]{5}$/;
  return regex.test(pincode);
};

// Required field validation
export const isRequired = (value) => {
  return value !== undefined && value !== null && value.toString().trim() !== '';
};
