import IPaymentData from "./IPaymentData";

interface ITransaction {
    paymentTransactionId: number;
    status: string;
    paymentToken: string;
    paymentData: IPaymentData;
    userId: number;
    createDate: string;
    merchantId: number;
    ip: string;
    amount: string;
    title: string;
    settlementId: number;
    isRefund: boolean;
    checkoutPaymentId: number;
    receiver: {
        name: string;
    };
    user: any;
    merchantCode: string;
    invoiceNumber: string;
}

export default ITransaction;
