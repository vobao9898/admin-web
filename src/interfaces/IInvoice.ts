import IBasket from "./IBasket";
import IHistory from "./IHistory";
import IUser from "./IUser";

interface IInvoice {
    checkoutId: number;
    invoiceNo: string;
    userId: number;
    merchantId: number;
    status: string;
    appointmentId: number;
    total: string;
    createdDate: string;
    isSettlement: number;
    createdById: number;
    modifiedById: number;
    modifiedDate: string;
    deviceId: string;
    user: IUser;
    createdBy: string;
    modifiedBy: string;
    discount: string;
    tax: string;
    taxProductPercent: string;
    taxProductAmount: string;
    taxServicePercent: string;
    taxServiceAmount: string;
    giftCard: string;
    subTotal: string;
    tipAmount: string;
    code: string;
    refundAmount: string;
    shippingFee: string;
    settlementId: number;
    promotionNotes: string;
    checkoutPaymentFeeSum: string;
    checkoutPaymentCashDiscountSum: string;
    staff: string;
    paymentMethod: string;
    responses: any;
    depositAmount: string;
    payByStar: string;
    rewardStarRate: string;
    basket: IBasket;
    history: IHistory[];
}

export default IInvoice;
