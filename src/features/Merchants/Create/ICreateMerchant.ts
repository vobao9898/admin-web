interface ICreateMerchant {
    generalInfo: {
        businessName: string;
        doingBusiness: string;
        tax: string;
        email: string;
        businessPhone: string;
        contactPhone: string;
        firstName: string;
        lastName: string;
        position: string;
        dbaAddress: {
            address: string;
            city: string;
            state: number;
            zip: string;
        };
        businessAddress: {
            address: string;
            city: string;
            state: number;
            zip: string;
        };
    };
    bankInfo: {
        accountHolderName: string;
        routingNumber: number;
        accountNumber: number;
        bankName: string;
        fileId: number;
    };
    businessInfo: {
        question1: {
            isAccept: boolean;
            desc: string;
            question: string;
        };
        question2: {
            isAccept: boolean;
            desc: string;
            question: string;
        };
        question3: {
            isAccept: boolean;
            desc: string;
            question: string;
        };
        question4: {
            isAccept: boolean;
            desc: string;
            question: string;
        };
        question5: {
            isAccept: boolean;
            desc: string;
            question: string;
        };
    };
    principalInfo: IPrincipalInfo[];
    packagePricing: number;
    packageId: number;
    type: number;
    mid: string;
    notes: string;
    terminalInfo: string;
    pricingType: string;
    additionStaff: number;
    price: number;
    currentRate: {
        discountRate: number;
        transactionsFee: number;
    };
}

export interface IPrincipalInfo {
    principalId: number;
    firstName: string;
    lastName: string;
    position: string;
    ownerShip: number;
    homePhone: string;
    mobilePhone: string;
    yearAtThisAddress: string;
    ssn: string;
    dateOfBirth: string;
    driverLicense: string;
    stateIssued: number;
    fileId: number;
    email: string;
    address: string;
    city: string;
    zip: string;
    title: string;
    driverNumber: string;
    stateId: number;
    yearAddress: string;
}

export default ICreateMerchant;
