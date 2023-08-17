import IValueTransactionDashboard from "./IValueTransactionDashboard";

interface ITransactionDashBoard {
    total: string;
    label: string[];
    data: IValueTransactionDashboard[];
}

export default ITransactionDashBoard;
