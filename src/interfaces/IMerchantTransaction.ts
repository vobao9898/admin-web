import IPaymentData from "./IPaymentData";

interface IMerchantTransaction {
    transactionId: number;
    status: string;
    paymentData: IPaymentData;
    amount: string;
    createdDate: string;
    checkoutId: string;
}

export default IMerchantTransaction;
