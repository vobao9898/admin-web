interface IGiftCardGeneral {
    giftCardId: number;
    serialNumber: string;
    pincode: string;
    isUsed: number;
    fileId: number;
    amount: string;
    isActive: number;
    isBooking: number;
    createdDate: string;
    isPhysical: number;
    giftCardGeneralId: number;
    isDisabled: number;
    usedDate: string;
    settlementId: number;
    merchantId: number;
    merchants: any;
    imageUrl: string;
    name: string;
}

export default IGiftCardGeneral;
