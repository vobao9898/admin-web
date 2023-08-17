import axiosClient from "api/axiosClient";
import IAdminUser from "interfaces/IAdminUser";
import IDepartment from "interfaces/IDepartment";
import ILogs from "interfaces/ILogs";
import IPaging from "interfaces/IPaging";
import IPermission from "interfaces/IPermission";
import IUser from "interfaces/IUser";
import IValueDepartment from "interfaces/IValueDepartment";
import moment from "moment";
import axios from "axios";
import dayjs from "dayjs";
import INotification from "interfaces/INotification";
import { IGlobalUser } from "context/Reducer";
import { HTTP_STATUS_CODES } from "contants";

const UserRepository = {
    login: async (email: string, password: string): Promise<number> => {
        try {
            const url = `${process.env.REACT_APP_URL_API}AdminUser/Login`;
            const body = { email, password };
            const resp: any = await axios.post(url, body);
            if (resp?.data?.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data?.data?.verifyCodeId;
            throw new Error(resp?.data?.message);
        } catch (error) {
            throw error;
        }
    },
    verify: async (verifyCodeId: number, code: string): Promise<IGlobalUser> => {
        try {
            const url = `${process.env.REACT_APP_URL_API}AdminUser/verifycode/${verifyCodeId}`;
            const body = { code };
            const resp: any = await axios.post(url, body);
            if (resp?.data?.codeNumber === HTTP_STATUS_CODES.OK && resp?.data?.data) {
                return resp?.data?.data;
            } else {
                throw new Error(resp?.data?.message);
            }
        } catch (error) {
            throw error;
        }
    },
    get: async (page: number, row: number, status?: string, keyword?: string, isGetBrief?: boolean): Promise<IPaging<IUser>> => {
        let url = `/AdminUser?page=${page}&row=${row}`;

        if (keyword) url = `${url}&key=${keyword}`;

        if (isGetBrief) url = `${url}&isGetBrief=${isGetBrief}`;

        if (status !== "-1" && status !== undefined) url = `${url}&isDisabled=${status}`;
        //TODO: Check status code
        return new Promise((resolve, reject) => {
            axiosClient.get(url).then(
                (resp: any) => {
                    resolve(resp);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    getPermission: async (): Promise<IPermission[]> => {
        try {
            const resp: any = await axiosClient.get(`/permission`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    putPermission: async (value: IPermission[]): Promise<string> => {
        try {
            value[0].actions.map((i) => {
                delete i?.adminstrator;
                delete i?.manager;
                delete i?.staff1;
                delete i?.staff2;
                return i;
            });
            const resp: any = await axiosClient.post(`/permission`, value);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getDepartment: (): Promise<IDepartment[]> => {
        let url = `/Department`;
        return new Promise((resolve, reject) => {
            axiosClient.get(url).then(
                (resp: any) => {
                    resolve(resp.data);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    getUser: (page: number, row: number, keyword?: string, isGetBrief?: boolean): Promise<IPaging<IAdminUser>> => {
        let url = `/AdminUser?page=${page}&row=${row}`;

        if (keyword) url = `${url}&key=${keyword}`;

        if (isGetBrief) url = `${url}&isGetBrief=${isGetBrief}`;

        return new Promise((resolve, reject) => {
            axiosClient.get(url).then(
                (resp: any) => {
                    resolve(resp);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    editDepartment: async (value: IValueDepartment, id: number): Promise<string> => {
        try {
            const param = {
                departmentName: value?.departmentName,
                memberIds: value?.members,
            };
            const resp: any = await axiosClient.put(`/Department/${id}`, param);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    createDepartment: async (value: IValueDepartment): Promise<string> => {
        try {
            const param = {
                departmentName: value?.departmentName,
                memberIds: value?.members,
            };
            const resp: any = await axiosClient.post(`/Department`, param);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    editDepartmentArchive: (id: number): Promise<void> => {
        let url = `/Department/archive/${id}`;
        return new Promise((resolve, reject) => {
            axiosClient.put(url).then(
                (resp: any) => {
                    resolve(resp);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    editDepartmentRestore: (id: number): Promise<void> => {
        let url = `/Department/restore/${id}`;
        return new Promise((resolve, reject) => {
            axiosClient.put(url).then(
                (resp: any) => {
                    resolve(resp);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    getMerchantLog: async (page: number, row: number, userId: number, custom: any): Promise<IPaging<ILogs>> => {
        const url = `/MerchantApprovalLog`;

        let timeStart = null;
        let timeEnd = null;

        if (custom && custom[0] && custom[1]) {
            timeStart = moment(dayjs(custom[0], "DD/MM/YYYY").toString()).format("L");
            timeEnd = moment(dayjs(custom[1], "DD/MM/YYYY").toString()).format("L");
        }
        const params = {
            page,
            row,
            userId,
            timeStart,
            timeEnd,
        };

        return new Promise((resolve, reject) => {
            axiosClient.get(url, { params }).then(
                (resp: any) => {
                    if (resp?.codeNumber === 200) {
                        resolve(resp);
                    } else {
                        reject(resp);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    createUser: (data: Partial<IUser>): Promise<void> => {
        let url = `/AdminUser`;
        return new Promise((resolve, reject) => {
            axiosClient.post(url, data).then(
                (resp: any) => {
                    if (resp?.codeNumber === 200) {
                        resolve();
                    } else {
                        reject(resp?.message);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    getUserById: (id: string): Promise<IUser> => {
        let url = `/AdminUser/${id}`;
        return new Promise((resolve, reject) => {
            axiosClient.get(url).then(
                (resp: any) => {
                    if (resp?.codeNumber === 200) {
                        resolve(resp?.data);
                    } else {
                        reject(resp?.message);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    enableUser: (id: string): Promise<string> => {
        const url = `/AdminUser/enable/${id}`;
        return new Promise((resolve, reject) => {
            axiosClient.put(url).then(
                (resp: any) => {
                    if (resp?.codeNumber === 200) {
                        resolve(resp?.data);
                    } else {
                        reject(resp?.message);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    disableUser: (id: string): Promise<void> => {
        let url = `/AdminUser/${id}`;

        return new Promise((resolve, reject) => {
            axiosClient.delete(url).then(
                (resp: any) => {
                    resolve(resp);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    editUser: (id: number, data: Partial<IUser>): Promise<string> => {
        const url = `/AdminUser/${id}`;
        return new Promise((resolve, reject) => {
            axiosClient.put(url, data).then(
                (resp: any) => {
                    if (resp?.codeNumber === 200) {
                        resolve(resp?.message);
                    } else {
                        reject(resp?.message);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    editPasswordUser: (oldPassword: string, newPassword: string, id: string): Promise<string> => {
        const url = `/AdminUser/changepassword/${id}`;
        const params = {
            oldPassword,
            newPassword,
        };
        return new Promise((resolve, reject) => {
            axiosClient.put(url, params).then(
                (resp: any) => {
                    if (resp?.codeNumber === 200) {
                        resolve(resp?.message);
                    } else {
                        reject(resp?.message);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    getNotification: (page: number, row: number): Promise<IPaging<INotification>> => {
        let url = `/Notification?page=${page}&row=${row}`;
        return new Promise((resolve, reject) => {
            axiosClient.get(url).then(
                (resp: any) => {
                    resolve(resp);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    deleteNotification: async (id: number): Promise<string> => {
        try {
            let url = `/Notification/${id}`;
            const resp: any = await axiosClient.delete(url);
            if (resp?.codeNumber === 200) {
                return resp?.message;
            } else {
                throw new Error(resp?.message);
            }
        } catch (error) {
            throw error;
        }
    },
};

export default UserRepository;
