import IPaymentData from "./IPaymentData";

interface IPaymentTransaction {
    transactionId: number;
    checkoutId: number;
    paymentData: IPaymentData;
    amount: string;
    status: string;
}

export default IPaymentTransaction;
