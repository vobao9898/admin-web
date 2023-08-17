import axiosClient from "api/axiosClient";
import { HTTP_STATUS_CODES } from "contants";
import IMerchant from "interfaces/IMerchant";
import IPaging from "interfaces/IPaging";
import IPrincipal from "interfaces/IPrincipal";
import IState from "interfaces/IState";

const PrincipalRepository = {
    get: (page: number, row: number, status: number, keyword?: string, sortValue?: string, sortType?: "asc" | "desc"): Promise<IPaging<IPrincipal>> => {
        let url = `/Principal?page=${page}&row=${row}`;

        if (keyword) url = `${url}&key=${keyword}`;

        if (sortType && sortValue) {
            url = `${url}&sortValue=${sortValue}&sortType=${sortType}`;
        }

        if (status !== -1) {
            const filters = {
                status: status,
            };
            url = `${url}&filters=${JSON.stringify(filters)}`;
        }

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
    getById: (id: number): Promise<IPrincipal> => {
        let url = `/Principal/${id}`;
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
    getState: (): Promise<IState[]> => {
        let url = `/State`;
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
    exportPrincipalById: async (id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.get(`/Principal/exportDetail/${id}?type=pdf`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    create: async (data: Partial<IPrincipal>): Promise<number> => {
        try {
            const resp: any = await axiosClient.post(`/Principal`, data);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    getMerchants: async (id: number, page: number, row: number, status: string, merchantType: string, isTest: string | boolean): Promise<IPaging<IMerchant>> => {
        try {
            const url = `/Principal/${id}/merchants`;
            let filters = {};

            if (status !== "-1") {
                filters = {
                    ...filters,
                    status,
                };
            }

            if (isTest !== "-1") {
                filters = {
                    ...filters,
                    isTest,
                };
            }

            if (merchantType !== "-1") {
                filters = {
                    ...filters,
                    merchantType,
                };
            }

            const params = {
                page,
                row,
                filters: JSON.stringify(filters),
            };

            const resp: any = await axiosClient.get(url, { params });
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getPrincipalByKey: async (key: "email" | "ssn", value: string): Promise<IPrincipal> => {
        try {
            const resp: any = await axiosClient.get(`/merchant/principal/getbykey?key=${key}&value=${value}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    update: async (id: number, data: Partial<IPrincipal>): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`/Principal/${id}`, data);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    briefPrincipal: async (merchantId: number, keyword: string): Promise<IPrincipal[]> => {
        try {
            const resp: any = await axiosClient.get(`/Principal/brief?key=${keyword}&merchantId=${merchantId}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
};

export default PrincipalRepository;
