interface IUser {
    waUserId: number;
    imageUrl: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    roleName: string;
    isDisabled: number;
    code: number;
    address: string;
    birthDate: string;
    gender: string;
    password: string;
    fileId?: number;
    city: string;
    stateId: number;
    waRoleId: number;
    userName: string;
}

export default IUser;
