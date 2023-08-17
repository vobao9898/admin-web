interface IDevice {
    id: number;
    merchantId: number;
    terminalId: string;
    deviceId: string;
    ip: string;
    createdDate: string;
    isDeleted: number;
}

export default IDevice;
