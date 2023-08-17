import IMerchantBatchSettlement from "./IMerchantBatchSettlement";
import IStaffSale from "./IStaffSale";

interface ISettlementAwait {
    settlement: IMerchantBatchSettlement;
    staffSales: IStaffSale[];
    giftcardSales: [];
    depositAmount: string;
    depositNotRefund: string;
}

export default ISettlementAwait;
