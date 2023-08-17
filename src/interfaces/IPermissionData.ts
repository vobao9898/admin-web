import IActions from "./IActions";

interface IPermissionData {
    dashboard?: IActions[];
    requestManagement?: IActions[];
    merchant?: IActions[];
    consumer?: IActions[];
    giftCard?: IActions[];
    pricingPlan?: IActions[];
    account?: IActions[];
    report?: IActions[];
}

export default IPermissionData;
