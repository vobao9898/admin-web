import IActions from "./IActions";

interface IPermission {
    permissionId: number;
    waRoleId: number;
    modulePageId: number;
    modulePage: any;
    actions: IActions[];
    createdDate: string;
    createdBy: number;
    modifiedDate: string;
    modifiedBy: number;
    isDisabled: number;
    dashboard?: IActions[];
    requestManagement?: IActions[];
    merchant?: IActions[];
    consumer?: IActions[];
    giftCard?: IActions[];
    pricingPlan?: IActions[];
    account?: IActions[];
    report?: IActions[];
}

export default IPermission;
