interface IBusinessBank {
    businessBankId: number;
    routingNumber: string;
    accountNumber: string;
    fileId: number;
    name: string;
    accountHolderName: string;
    merchantId: number;
    imageUrl: string;
}

export default IBusinessBank;
