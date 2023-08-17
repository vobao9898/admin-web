export interface ICreateMerchant {
    generalInfo: GeneralInfo;
    bankInfo: BankInfo;
    principalInfo: PrincipalInfo[];
    businessInfo: BusinessInfo;
    packagePricing: number;
    type: number;
    mid: string;
    notes: string;
    terminalInfo: string;
    pricingType: string;
    additionStaff: number;
    price: number;
    currentRate: CurrentRate;
}

export interface GeneralInfo {
    businessName: string;
    doingBusiness: string;
    tax: string;
    businessAddress: BusinessAddress;
    dbaAddress: DbaAddress;
    email: string;
    // businessPhone: string;
    // contactPhone: string;
    businessCodePhone: number;
    businessPhoneNumber: string;
    contactCodePhone: number;
    contactPhoneNumber: string;
    firstName: string;
    lastName: string;
    position: string;
    type: number;
    sameAs: boolean;
}

export interface BusinessAddress {
    address: string;
    city: string;
    state: number;
    zip: string;
}

export interface DbaAddress {
    address: string;
    city: string;
    state: number;
    zip: string;
}

export interface BankInfo {
    accountHolderName: string;
    routingNumber: string;
    accountNumber: string;
    bankName: string;
    fileId: number;
    fileUrl?: string;
}

export interface PrincipalInfo {
    firstName: string;
    lastName: string;
    title: string;
    ownerShip: number;
    homePhone: string;
    mobilePhone: string;
    yearAddress: string;
    ssn: string;
    birthDate: Date;
    driverNumber: string;
    fileId: number;
    city: string;
    stateId: number;
    address: string;
    zip: string;
    oldData: string;
    email: string;
    stateIssued: number;
}

export interface AddressPrincipal {
    address: string;
    city: string;
    state: number;
    zip: string;
}

export interface BusinessInfo {
    question1: Question;
    question2: Question;
    question3: Question;
    question4: Question;
    question5: Question;
}

export interface Question {
    isAccept: boolean;
    desc: string;
    question: string;
}

export interface CurrentRate {
    discountRate: number;
    transactionsFee: number;
}
