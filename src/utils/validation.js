// Form validation utilities

import { MOBILE_REGEX, OTP_CONFIG, FILE_UPLOAD } from './constants';

/**
 * Validate Indian mobile number
 * @param {string} mobile - Mobile number to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateMobile = (mobile) => {
  if (!mobile) {
    return { valid: false, error: 'Mobile number is required' };
  }
  
  if (!MOBILE_REGEX.test(mobile)) {
    return { valid: false, error: 'Please enter a valid 10-digit mobile number' };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate OTP
 * @param {string} otp - OTP to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateOTP = (otp) => {
  if (!otp) {
    return { valid: false, error: 'OTP is required' };
  }
  
  if (otp.length !== OTP_CONFIG.LENGTH) {
    return { valid: false, error: `OTP must be ${OTP_CONFIG.LENGTH} digits` };
  }
  
  if (!/^\d+$/.test(otp)) {
    return { valid: false, error: 'OTP must contain only numbers' };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  return { valid: true, error: null };
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }

  return { valid: true, error: null };
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateFile = (file) => {
  if (!file) {
    return { valid: true, error: null }; // File is optional
  }
  
  // Check file size
  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    return { 
      valid: false, 
      error: `File size must be less than ${FILE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB` 
    };
  }
  
  // Check file type
  if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Only JPG, PNG, and PDF files are allowed' 
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  return { valid: true, error: null };
};

/**
 * Validate text length
 * @param {string} text - Text to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Name of the field
 * @returns {object} - { valid: boolean, error: string }
 */
export const validateLength = (text, minLength, maxLength, fieldName = 'Text') => {
  if (!text) {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  if (text.length < minLength) {
    return { 
      valid: false, 
      error: `${fieldName} must be at least ${minLength} characters` 
    };
  }
  
  if (text.length > maxLength) {
    return { 
      valid: false, 
      error: `${fieldName} must not exceed ${maxLength} characters` 
    };
  }
  
  return { valid: true, error: null };
};
