interface IGiftCard {
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
    imageUrl: string;
    name: string;
    quantity: number;
}

export default IGiftCard;
