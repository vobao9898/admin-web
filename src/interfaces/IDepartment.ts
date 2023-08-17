import IAdminUser from "./IAdminUser";

interface IDepartment {
    departmentId: number;
    departmentName: string;
    createdDate: string;
    isDisabled: number;
    modifiedDate: String;
    members: IAdminUser[];
    noOfMembers: number;
}

export default IDepartment;
