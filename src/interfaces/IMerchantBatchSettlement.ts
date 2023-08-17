import IPaymentTransaction from "./IPaymentTransaction";

interface IMerchantBatchSettlement {
    settlementId: number;
    paymentByHarmony: string;
    paymentByCreditCard: string;
    paymentByCash: string;
    otherPayment: string;
    total: string;
    note: string;
    settlementDate: string;
    checkouts: string;
    merchantId: number;
    intive300Customer: number;
    discount: string;
    paymentByCashStatistic: string;
    otherPaymentStatistic: string;
    isConnectPax: false;
    isDeposited: number;
    depositedDate: string;
    depositedAmount: string;
    paymentByGiftcard: string;
    serialNumber: any;
    paymentTerminal: any;
    redeemStar: string;
    checkout: any;
    businessName: string;
    doBusinessName: string;
    inviteAmount: string;
    terminalId: any;
    returnAmount: string;
    refundAmount: string;
    paymentTransaction: IPaymentTransaction[];
}

export default IMerchantBatchSettlement;
