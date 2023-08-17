interface IPackage {
    packageId: number;
    packageName: string;
    staffLimit: number;
    createdDate: string;
    isDisabled: number;
    pos: number;
    signinApp: number;
    staffApp: number;
    marketing: number;
    report: number;
    pricing: string;
    interactiveScheduling: number;
    additionStaff: boolean;
    additionStaffPrice: string;
    annually: string;
}

export default IPackage;
