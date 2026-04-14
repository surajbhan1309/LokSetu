// Application constants

export const DEPARTMENTS = {
  ELECTRICITY: 'electricity',
  GAS: 'gas',
  WATER: 'water',
  WASTE: 'waste',
};

export const DEPARTMENT_INFO = {
  [DEPARTMENTS.ELECTRICITY]: {
    name: 'Electricity',
    nameHi: 'बिजली',
    nameAs: 'বিদ্যুৎ',
    icon: '⚡',
    color: 'electricity',
    bgColor: 'bg-electricity-light',
    textColor: 'text-electricity-dark',
    borderColor: 'border-electricity',
  },
  [DEPARTMENTS.GAS]: {
    name: 'Gas',
    nameHi: 'गैस',
    nameAs: 'গেছ',
    icon: '🔥',
    color: 'gas',
    bgColor: 'bg-gas-light',
    textColor: 'text-gas-dark',
    borderColor: 'border-gas',
  },
  [DEPARTMENTS.WATER]: {
    name: 'Water',
    nameHi: 'पानी',
    nameAs: 'পানী',
    icon: '💧',
    color: 'water',
    bgColor: 'bg-water-light',
    textColor: 'text-water-dark',
    borderColor: 'border-water',
  },
  [DEPARTMENTS.WASTE]: {
    name: 'Waste Management',
    nameHi: 'कचरा प्रबंधन',
    nameAs: 'আৱৰ্জনা ব্যৱস্থাপনা',
    icon: '♻️',
    color: 'waste',
    bgColor: 'bg-waste-light',
    textColor: 'text-waste-dark',
    borderColor: 'border-waste',
  },
};

export const SERVICE_TYPES = {
  PAY_BILL: 'pay_bill',
  REGISTER_COMPLAINT: 'register_complaint',
  SERVICE_REQUEST: 'service_request',
  TRACK_STATUS: 'track_status',
};

export const SERVICE_TYPE_INFO = {
  [SERVICE_TYPES.PAY_BILL]: {
    name: 'Pay Bill',
    nameHi: 'बिल भुगतान',
    nameAs: 'বিল পৰিশোধ',
    icon: '💳',
  },
  [SERVICE_TYPES.REGISTER_COMPLAINT]: {
    name: 'Register Complaint',
    nameHi: 'शिकायत दर्ज करें',
    nameAs: 'অভিযোগ পঞ্জীয়ন কৰক',
    icon: '📝',
  },
  [SERVICE_TYPES.SERVICE_REQUEST]: {
    name: 'Service Request',
    nameHi: 'सेवा अनुरोध',
    nameAs: 'সেৱা অনুৰোধ',
    icon: '🔧',
  },
  [SERVICE_TYPES.TRACK_STATUS]: {
    name: 'Track Status',
    nameHi: 'स्थिति ट्रैक करें',
    nameAs: 'স্থিতি ট্ৰেক কৰক',
    icon: '📊',
  },
};

export const REQUEST_STATUS = {
  SUBMITTED: 'Submitted',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  REJECTED: 'Rejected',
};

export const STATUS_INFO = {
  [REQUEST_STATUS.SUBMITTED]: {
    name: 'Submitted',
    nameHi: 'प्रस्तुत',
    nameAs: 'দাখিল কৰা হৈছে',
    color: 'bg-status-submitted',
    textColor: 'text-gray-700',
  },
  [REQUEST_STATUS.IN_PROGRESS]: {
    name: 'In Progress',
    nameHi: 'प्रगति में',
    nameAs: 'প্ৰগতিত আছে',
    color: 'bg-status-inProgress',
    textColor: 'text-white',
  },
  [REQUEST_STATUS.RESOLVED]: {
    name: 'Resolved',
    nameHi: 'हल हो गया',
    nameAs: 'সমাধান কৰা হৈছে',
    color: 'bg-status-resolved',
    textColor: 'text-white',
  },
  [REQUEST_STATUS.REJECTED]: {
    name: 'Rejected',
    nameHi: 'अस्वीकृत',
    nameAs: 'প্ৰত্যাখ্যান কৰা হৈছে',
    color: 'bg-red-500',
    textColor: 'text-white',
  },
};

export const LANGUAGES = {
  EN: 'en',
  HI: 'hi',
};

export const LANGUAGE_INFO = {
  [LANGUAGES.EN]: {
    name: 'English',
    nativeName: 'English',
  },
  [LANGUAGES.HI]: {
    name: 'Hindi',
    nativeName: 'हिंदी',
  },
};

// API endpoints (mock for now)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
  },
  REQUESTS: {
    CREATE: '/api/requests',
    GET_BY_ID: '/api/requests/:id',
    GET_BY_USER: '/api/requests/user/:userId',
    UPDATE_STATUS: '/api/requests/:id/status',
    LIST: '/api/requests',
  },
  ADMIN: {
    LOGIN: '/api/admin/login',
    REQUESTS: '/api/admin/requests',
  },
};

// Session timeout (in milliseconds)
export const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// File upload constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf'],
};

// OTP configuration
export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_TIME: 5 * 60, // 5 minutes in seconds
};

// Mobile number validation
export const MOBILE_REGEX = /^[6-9]\d{9}$/;
