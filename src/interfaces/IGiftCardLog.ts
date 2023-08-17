interface IGiftCardLog {
    giftCardLogId: number;
    giftCardId: number;
    message: string;
    payMerchantId: number;
    type: string;
    amount: string;
    balance: string;
    createdDate: string;
}

export default IGiftCardLog;
