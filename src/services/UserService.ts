import UserRepository from "repositories/UserRepository";
import IPaging from "interfaces/IPaging";
import IUser from "interfaces/IUser";
import IPermission from "interfaces/IPermission";
import IDepartment from "interfaces/IDepartment";
import IAdminUser from "interfaces/IAdminUser";
import IValueDepartment from "interfaces/IValueDepartment";
import ILogs from "interfaces/ILogs";
import { handleResponseError } from "utils";
import { IGlobalUser } from "context/Reducer";
import INotification from "interfaces/INotification";

const UserService = {
    login: async (email: string, password: string): Promise<number> => {
        try {
            const response = await UserRepository.login(email, password);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    verify: async (verifyCodeId: number, code: string): Promise<IGlobalUser> => {
        try {
            const response = await UserRepository.verify(verifyCodeId, code);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    get: async (page: number, row: number, status?: string, keyword?: string, isGetBrief?: boolean): Promise<IPaging<IUser>> => {
        try {
            const response = await UserRepository.get(page, row, status, keyword, isGetBrief);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getPermission: async (): Promise<IPermission[]> => {
        try {
            const response = await UserRepository.getPermission();
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    putPermission: async (value: IPermission[]): Promise<string> => {
        try {
            const response = await UserRepository.putPermission(value);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getDepartment: async (): Promise<IDepartment[]> => {
        try {
            const response = await UserRepository.getDepartment();
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getUser: async (page: number, row: number, keyword?: string, isGetBrief?: boolean): Promise<IPaging<IAdminUser>> => {
        try {
            const response = await UserRepository.getUser(page, row, keyword, isGetBrief);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    editDepartment: async (value: IValueDepartment, id: number): Promise<string> => {
        try {
            const response = await UserRepository.editDepartment(value, id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    createDepartment: async (value: IValueDepartment): Promise<string> => {
        try {
            const response = await UserRepository.createDepartment(value);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    editDepartmentArchive: async (id: number): Promise<void> => {
        try {
            const response = await UserRepository.editDepartmentArchive(id);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    editDepartmentRestore: async (id: number): Promise<void> => {
        try {
            const response = await UserRepository.editDepartmentRestore(id);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getMerchantLog: async (page: number, row: number, approvedBy: number, custom: any): Promise<IPaging<ILogs>> => {
        try {
            const response = await UserRepository.getMerchantLog(page, row, approvedBy, custom);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    createUser: async (data: Partial<IUser>): Promise<void> => {
        try {
            const response = await UserRepository.createUser(data);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getUserById: async (id: string): Promise<IUser> => {
        try {
            const response = await UserRepository.getUserById(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    enableUser: async (id: string): Promise<string> => {
        try {
            const response = await UserRepository.enableUser(id);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    disableUser: async (id: string): Promise<void> => {
        try {
            const response = await UserRepository.disableUser(id);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    editUser: async (id: number, data: Partial<IUser>): Promise<string> => {
        try {
            const response = await UserRepository.editUser(id, data);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    editPasswordUser: async (password: string, newPassword: string, id: string): Promise<string> => {
        try {
            const response = await UserRepository.editPasswordUser(password, newPassword, id);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getNotification: async (page: number, row: number): Promise<IPaging<INotification>> => {
        try {
            const response = await UserRepository.getNotification(page, row);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    deleteNotification: async (id: number): Promise<string> => {
        try {
            const response = await UserRepository.deleteNotification(id);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
};

export default UserService;
