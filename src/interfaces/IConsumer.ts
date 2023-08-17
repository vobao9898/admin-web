interface IConsumer {
    userId: number;
    accountId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phone: string;
    email: string;
    credit: string;
    totalAmount: string;
    isVerified: number;
    lastActivity: Date;
    limitAmount: string;
    isDisabled: number;
}

export default IConsumer;
