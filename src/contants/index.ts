enum EPHONE_CODES {
    VN = 84,
    US = 1,
}

const PHONE_CODES = [
    {
        value: EPHONE_CODES.US,
        label: "+1",
    },
    {
        value: EPHONE_CODES.VN,
        label: "+84",
    },
];

const GENDER_OPTOINS = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
];

const ROLE_OPTIONS = [
    { label: "Administrator", value: "1" },
    { label: "Manager", value: "2" },
    { label: "Staff Lv1", value: "3" },
    { label: "Staff Lv2", value: "4" },
];

const STATUS_OPTIONS = [
    { label: "Active", value: 0 },
    { label: "Inactive", value: 1 },
];

const GIFT_CARD_TEMPLATE_OPTIONS = [
    { label: "Happy Anniversary", value: "Happy Anniversary" },
    { label: "Happy Birthday", value: "Happy Birthday" },
    { label: "Happy New Year", value: "Happy New Year" },
    { label: "Happy Valentine", value: "Happy Valentine" },
    { label: "Thank You", value: "Thank You" },
    { label: "I Love You", value: "I Love You" },
    { label: "Merry Christmas", value: "Merry Christmas" },
];

const MERCHANT_TYPE_OPTIONS = [
    { value: 0, label: "Salon POS" },
    { value: 1, label: "Retailer" },
    { value: 2, label: "Staff One" },
    { value: 3, label: "Restaurant" },
];

const MECHANT_BUSINESS_QUESTIONS = [
    {
        question: "Has Merchant been previously identified by Visa/Mastercard Risk Programs?",
        answers: [
            { value: false, label: "No" },
            { value: true, label: "Yes (if yes, who was the processor)" },
        ],
    },
    {
        question: "Has Merchant or any associated principal and/or owners disclosed below filed bankruptcy or been subject to any involuntary bankruptcy?",
        answers: [
            { value: false, label: "No" },
            { value: true, label: "Yes (if yes, who was the processor)" },
        ],
    },
    {
        question: "Will product(s) or service(s) be sold outside of US?",
        answers: [
            { value: false, label: "No" },
            { value: true, label: "Yes" },
        ],
    },
    {
        question: "Has a processor ever terminated your Merchant account?",
        answers: [
            { value: false, label: "No" },
            { value: true, label: "Yes (if yes, what was program and when)" },
        ],
    },
    {
        question: "Have you ever accepted Credit/Debit cards before?",
        answers: [
            { value: false, label: "No" },
            { value: true, label: "Yes (if yes, date filed)" },
        ],
    },
];

const REGEX_EMAIL = /^(([^<>()[\]\\.,;:$%^&*\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// https://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
const REGEX_LATITUDE = /^(\+|-)?(?:90(?:(?:\.0{1,30})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,30})?))$/;
const REGEX_LONGITUDE = /^(\+|-)?(?:180(?:(?:\.0{1,30})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,30})?))$/;

const REGEX_FEDERAL_TAX_ID = /^\d{2}-?\d{7}$/;

const REVIEW_LINK_OPTIONS = [
    { label: "Automatic", value: "auto" },
    { label: "Off", value: "off" },
    { label: "Manual", value: "manual" },
];

const KEY_USER = "0a1ad85d-e4fa-41cb-ba51-c70f78749cb1";

const KEY_TOKEN = "5be1b30f-70ba-4397-8f39-1bf1f29ca164";

const KEY_REFRESH_TOKEN = "61c5bdc9-29a7-40fc-a1a7-4d6465b1478f";

const API_BASE_URL = process.env.REACT_APP_URL_API;

const TIME_RANGE_OPTIONS = [
    { value: "yesterday", label: "Yesterday" },
    { value: "today", label: "Today" },
    { value: "thisWeek", label: "This Week" },
    { value: "lastWeek", label: "Last Week" },
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "custom", label: "Custom" },
];

const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NOTFOUND: 404,
};

const WORKING_TIME_OPTIONS = [
    {
        label: "12:00 AM",
        value: "12:00 AM",
    },
    {
        label: "12:30 AM",
        value: "12:30 AM",
    },
    {
        label: "01:00 AM",
        value: "01:00 AM",
    },
    {
        label: "01:30 AM",
        value: "01:30 AM",
    },
    {
        label: "02:00 AM",
        value: "02:00 AM",
    },
    {
        label: "02:30 AM",
        value: "02:30 AM",
    },
    {
        label: "03:00 AM",
        value: "03:00 AM",
    },
    {
        label: "03:30 AM",
        value: "03:30 AM",
    },
    {
        label: "04:00 AM",
        value: "04:00 AM",
    },
    {
        label: "04:30 AM",
        value: "04:30 AM",
    },
    {
        label: "05:00 AM",
        value: "05:00 AM",
    },
    {
        label: "05:30 AM",
        value: "05:30 AM",
    },
    {
        label: "06:00 AM",
        value: "06:00 AM",
    },
    {
        label: "06:30 AM",
        value: "06:30 AM",
    },
    {
        label: "07:00 AM",
        value: "07:00 AM",
    },
    {
        label: "07:30 AM",
        value: "07:30 AM",
    },
    {
        label: "08:00 AM",
        value: "08:00 AM",
    },
    {
        label: "08:30 AM",
        value: "08:30 AM",
    },
    {
        label: "09:00 AM",
        value: "09:00 AM",
    },
    {
        label: "09:30 AM",
        value: "09:30 AM",
    },
    {
        label: "10:00 AM",
        value: "10:00 AM",
    },
    {
        label: "10:30 AM",
        value: "10:30 AM",
    },
    {
        label: "11:00 AM",
        value: "11:00 AM",
    },
    {
        label: "11:30 AM",
        value: "11:30 AM",
    },
    {
        label: "12:00 PM",
        value: "12:00 PM",
    },
    {
        label: "12:30 PM",
        value: "12:30 PM",
    },
    {
        label: "01:00 PM",
        value: "01:00 PM",
    },
    {
        label: "01:30 PM",
        value: "01:30 PM",
    },
    {
        label: "02:00 PM",
        value: "02:00 PM",
    },
    {
        label: "02:30 PM",
        value: "02:30 PM",
    },
    {
        label: "03:00 PM",
        value: "03:00 PM",
    },
    {
        label: "03:30 PM",
        value: "03:30 PM",
    },
    {
        label: "04:00 PM",
        value: "04:00 PM",
    },
    {
        label: "04:30 PM",
        value: "04:30 PM",
    },
    {
        label: "05:00 PM",
        value: "05:00 PM",
    },
    {
        label: "05:30 PM",
        value: "05:30 PM",
    },
    {
        label: "06:00 PM",
        value: "06:00 PM",
    },
    {
        label: "06:30 PM",
        value: "06:30 PM",
    },
    {
        label: "07:00 PM",
        value: "07:00 PM",
    },
    {
        label: "07:30 PM",
        value: "07:30 PM",
    },
    {
        label: "08:00 PM",
        value: "08:00 PM",
    },
    {
        label: "08:30 PM",
        value: "08:30 PM",
    },
    {
        label: "09:00 PM",
        value: "09:00 PM",
    },
    {
        label: "09:30 PM",
        value: "09:30 PM",
    },
    {
        label: "10:00 PM",
        value: "10:00 PM",
    },
    {
        label: "10:30 PM",
        value: "10:30 PM",
    },
    {
        label: "11:00 PM",
        value: "11:00 PM",
    },
    {
        label: "11:30 PM",
        value: "11:30 PM",
    },
];

const MASK_PHONE_NUMER = "999 999-9999";
const MASK_SOCIAL_SECURITY_NUMBER = "999-99-9999";
const MASK_FEDERAL_TAX_ID = "99-9999999";

const ID_PACKAGE_ALLOW_ADD_MORE_STAFF = 3;

export {
    PHONE_CODES,
    GENDER_OPTOINS,
    ROLE_OPTIONS,
    STATUS_OPTIONS,
    GIFT_CARD_TEMPLATE_OPTIONS,
    MERCHANT_TYPE_OPTIONS,
    MECHANT_BUSINESS_QUESTIONS,
    REGEX_EMAIL,
    REVIEW_LINK_OPTIONS,
    KEY_USER,
    KEY_TOKEN,
    KEY_REFRESH_TOKEN,
    API_BASE_URL,
    TIME_RANGE_OPTIONS,
    HTTP_STATUS_CODES,
    WORKING_TIME_OPTIONS,
    MASK_PHONE_NUMER,
    MASK_SOCIAL_SECURITY_NUMBER,
    EPHONE_CODES,
    REGEX_LATITUDE,
    REGEX_LONGITUDE,
    MASK_FEDERAL_TAX_ID,
    REGEX_FEDERAL_TAX_ID,
    ID_PACKAGE_ALLOW_ADD_MORE_STAFF,
};
