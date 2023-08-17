import IAdminUser from "./IAdminUser";
import IMerchant from "./IMerchant";

interface ILogs {
    adminUser: IAdminUser;
    adminUserId: number;
    approvalLogId: number;
    createdDate: string;
    isApproved: number;
    isDisabled: number;
    isRejected: number;
    merchant: IMerchant;
    merchantId: number;
    reasonReject: string;
}

export default ILogs;
