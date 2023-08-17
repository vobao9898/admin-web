interface IConsumerReloadGiftCard {
    giftCardId: number;
    giftCardTypeId: number;
    amount: string;
    message: string;
    isDisabled: number;
    receiverUserId: number;
    senderUserId: number;
    attachSender: number;
    status: string;
    createDate: number;
    fileId: number;
    isSpecificMerchant: number;
    merchantId: number;
    updatedDate: string;
    newPhoneInvite: any;
    senderUserName: string;
    receiveUserName: string;
    imageUrl: any;
    type: any;
    cardTokenId: number;
    isDeposited: number;
    depositedDate: string;
    depositedAmount: string;
}

export default IConsumerReloadGiftCard;
