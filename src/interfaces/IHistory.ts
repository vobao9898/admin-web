interface IHistory {
    checkoutHistoryId: number;
    checkoutId: number;
    settlementId: number;
    createdAt: string;
    message: string;
    staffId: number;
    status: string;
    reason: string;
}

export default IHistory;
