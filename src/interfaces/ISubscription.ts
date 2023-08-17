interface ISubscription {
    subscriptionId: number;
    subscripitonHistoryId: number;
    merchantId: number;
    packageId: number;
    createdDate: string;
    isDisabled: number;
    pricingType: string;
    staffLimit: number;
    price: string;
    expiredDate: Date;
    additionStaff: number;
    additionStaffPrice: string;
    modifiedDate: string;
    modifiedBy: number;
    totalStaffLimit: number;
    totalPrice: string;
    history: any;
    merchantCode: string;
    businessName: string;
    paymentMethod: string;
    accountNumber: string;
    planName: string;
}

export default ISubscription;
