import { HTTP_STATUS_CODES } from "contants";
import { ISort } from "features/Merchants/Merchants";
import axiosClient from "api/axiosClient";
import dayjs from "dayjs";
import ICreateMerchant from "features/Merchants/Create/ICreateMerchant";
import IActivities from "interfaces/IActivities";
import IBasicList from "interfaces/IBasicList";
import IBusinessBank from "interfaces/IBusinessBanks";
import ICallerLink from "interfaces/ICallerLink";
import ICategory from "interfaces/ICategory";
import IDevice from "interfaces/IDevice";
import IExtra from "interfaces/IExtra";
import IGiftCard from "interfaces/IGiftCard";
import IGiftCardGeneral from "interfaces/IGiftCardGeneral";
import IGiftCardLog from "interfaces/IGiftCardLog";
import IInvoice from "interfaces/IInvoice";
import IMerchant from "interfaces/IMerchant";
import IPaging from "interfaces/IPaging";
import IPortalLink from "interfaces/IPortalLink";
import IProduct from "interfaces/IProduct";
import IService from "interfaces/IService";
import IStaff from "interfaces/IStaff";
import ISubscription from "interfaces/ISubscription";
import moment from "moment";

const MerchantRepository = {
    get: async (page: number, row: number, sort: ISort, status: string, merchantType: string, isTest: string, keyword?: string): Promise<IPaging<IMerchant>> => {
        let url = `Merchant/search?page=${page}&row=${row}&isDisabled=${status}&merchantType=${merchantType}&isTest=${isTest}`;

        if (keyword) url = `${url}&key=${keyword}`;

        if (sort) {
            url = `${url}&sort=${JSON.stringify(sort)}`;
        }

        try {
            const resp: any = await axiosClient.get(url);
            if (resp && (resp?.codeNumber === HTTP_STATUS_CODES.OK || resp?.codeNumber === HTTP_STATUS_CODES.NOTFOUND)) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    export: async (status: string, merchantType: string, isTest: string): Promise<string> => {
        const url = `/merchant/export?isDisabled=${status}&merchantType=${merchantType}&isTest=${isTest}&exportType=excel`;

        try {
            const resp: any = await axiosClient.get(url);
            if (resp && resp?.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    create: (data: ICreateMerchant): Promise<string> => {
        return new Promise((resolve, reject) => {
            const url = `/Merchant`;
            axiosClient.post(url, data).then(
                (resp: any) => {
                    if (resp && resp.codeNumber === 200) {
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
    getActivities: async (id: number, page: number, row: number): Promise<IPaging<IActivities>> => {
        try {
            const resp: any = await axiosClient.get(`/MerchantActivity/${id}?page=${page}&row=${row}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    getMerchantById: async (id: number): Promise<IMerchant> => {
        try {
            const url = `/Merchant/${id}`;
            const resp: any = await axiosClient.get(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    generatePortalLink: async (id: number): Promise<IPortalLink> => {
        try {
            const resp: any = await axiosClient.get(`/Merchant/portalLoginLink/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    generateCallerLink: async (id: number): Promise<ICallerLink> => {
        try {
            const resp: any = await axiosClient.get(`/Merchant/callerIDLink/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    generateBookingLink: async (id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.get(`/Merchant/bookingLink/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    downloadCustomerTemplate: async (): Promise<Blob> => {
        let url = `/Customer/import/template`;
        try {
            const resp: any = await axiosClient.get(url, { responseType: "blob" });
            if (resp) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    updateBank: async (id: number, data: Partial<IBusinessBank>) => {
        try {
            const resp: any = await axiosClient.put(`Merchant/businessbank/${id}`, data);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    editSetting: async (params: any, id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`/Merchant/updatesetting/${id}`, params);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    inactiveSetting: async (reason: string, id: number): Promise<string> => {
        try {
            const params = { reason };
            const resp: any = await axiosClient.delete(`/Merchant/${id}`, { data: JSON.stringify(params) });
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    activeSetting: async (id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`/Merchant/enable/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    getDevice: async (id: number): Promise<IDevice[]> => {
        let url = `/Merchant/${id}/device-terminal`;
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
    putDevice: async (data: IDevice[], id: number): Promise<IDevice[]> => {
        let url = `/Merchant/${id}/device-terminal`;
        return new Promise((resolve, reject) => {
            axiosClient.put(url, data).then(
                (resp: any) => {
                    resolve(resp.data);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    getInvoiceById: (merchantId: number, page: number, row: number, timeRange: string, custom: any, status: string, method: string, key?: string): Promise<IPaging<IInvoice>> => {
        let url = `Checkout`;
        var timeStart = null;
        var timeEnd = null;
        if (timeRange === "custom") {
            timeStart = moment(dayjs(custom[0], "DD/MM/YYYY").toString()).format("L");
            timeEnd = moment(dayjs(custom[1], "DD/MM/YYYY").toString()).format("L");
        }
        const params = {
            merchantId,
            page,
            row,
            status,
            method,
            key,
            timeStart,
            timeEnd,
            quickFilter: timeRange,
        };
        return new Promise((resolve, reject) => {
            axiosClient.get(url, { params }).then(
                (resp: any) => {
                    resolve(resp);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    getCheckoutById: async (id: number, merchantId: number): Promise<IInvoice> => {
        try {
            const params = { merchantId };
            const resp: any = await axiosClient.get(`Checkout/${id}`, { params });
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    putRefundInvoice: (id: number): Promise<void> => {
        let url = `Checkout/paymentvoidrefundtransaction/${id}`;
        return new Promise((resolve, reject) => {
            axiosClient
                .put(url, {
                    responseData: {},
                })
                .then(
                    (resp: any) => {
                        resolve(resp);
                    },
                    (err) => {
                        reject(err);
                    }
                );
        });
    },
    getGiftCard: async (merchantId: number, page: number, row: number, sortValue?: string, sortType?: "asc" | "desc", keyword?: string): Promise<IPaging<IGiftCard>> => {
        try {
            const params = { merchantId, page, row, keySearch: keyword, sortType, sortValue: sortType ? sortValue : null };

            const resp: any = await axiosClient.get("GiftCardGeneral/admin", { params });

            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp;

            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getGiftCardGeneral: async (generalId: number, page: number, row: number, sortValue?: string, sortType?: "asc" | "desc", keyword?: string): Promise<IPaging<IGiftCardGeneral>> => {
        try {
            const params = { generalId, page, row, keySearch: keyword, sortType, sortValue: sortType ? sortValue : null };

            const resp: any = await axiosClient.get("giftcard/getByGeneral", { params });

            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp;

            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getExportGiftCard: async (generalId: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.get(`GiftCard/getByGeneral/export/excel?generalId=${generalId}`);

            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data?.path;

            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getInfoGeneralById: async (id: number): Promise<IGiftCardLog[]> => {
        try {
            const resp: any = await axiosClient.get(`giftcardlog/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    basicList: async (): Promise<IBasicList[]> => {
        try {
            const resp: any = await axiosClient.get(`merchant/basicList?businessName=`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    postGiftCardGeneral: async (value: any): Promise<string> => {
        try {
            const resp: any = await axiosClient.post(`GiftCard/general`, value);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getExtra: async (merchantId: number, page?: number, row?: number, sortValue?: string, sortType?: "asc" | "desc", keyword?: string): Promise<IPaging<IExtra>> => {
        try {
            const params = { merchantId, page, row, key: keyword, sortType, sortValue: sortType ? sortValue : null };
            const resp: any = await axiosClient.get(`extra/admin/getbymerchant/${merchantId}`, { params });
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getExportExtra: async (id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.get(`extra/export/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    archiveExtra: async (id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`extra/archive/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    restoreExtra: async (id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`extra/restore/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    deleteExtra: async (id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.delete(`extra/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    editExtra: async (payload: any, id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`extra/${id}`, payload);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getProduct: async (merchantId: number, page: number, row: number, sortValue?: string, sortType?: "asc" | "desc", keyword?: string): Promise<IPaging<IProduct>> => {
        try {
            const params = {
                merchantId,
                page,
                row,
                key: keyword,
                sortType,
                sortValue: sortType ? sortValue : null,
            };
            const resp: any = await axiosClient.get(`Product/admin/getbymerchant/${merchantId}`, { params });
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    productGetById: async (id: number, page: number, row: number): Promise<IProduct> => {
        try {
            let url = `Product/${id}`;
            const params = {
                page,
                row,
            };
            const resp: any = await axiosClient.get(url, { params });
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    archiveProduct: async (id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`product/archive/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    restoreProduct: async (id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`product/restore/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getCategory: async (
        merchantId: number,
        page: number,
        row: number,
        status?: number,
        type?: string,
        sortValue?: string,
        sortType?: "asc" | "desc",
        isGetBrief?: boolean,
        keyword?: string,
        isSubCategory?: number
    ): Promise<IPaging<ICategory>> => {
        try {
            let url = `Category/admin/getbymerchant/${merchantId}`;
            let filters = {};

            filters = {
                ...filters,
                status: status,
            };

            if (type) {
                filters = {
                    ...filters,
                    type,
                };
            }

            let sorts = "";

            if (sortType && sortValue) {
                sorts = `{"${sortValue}": "${sortType}"}`;
            }

            const params = {
                merchantId,
                page,
                row,
                key: keyword,
                sortValue: sortValue ? sortValue : null,
                sortType,
                filters: JSON.stringify(filters),
                isGetBrief,
                status,
                sorts: sorts,
                isSubCategory,
            };
            const resp: any = await axiosClient.get(url, { params });
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    editProduct: async (params: any, id: number): Promise<string> => {
        try {
            delete params.imageUrl;
            const resp: any = await axiosClient.put(`product/${id}`, params);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    createProduct: async (params: any): Promise<string> => {
        try {
            delete params.imageUrl;
            const resp: any = await axiosClient.post(`product`, params);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getService: async (merchantId: number, page: number, row: number, sortValue?: string, sortType?: "asc" | "desc", keyword?: string): Promise<IPaging<IService>> => {
        try {
            let url = `Service/admin/getbymerchant/${merchantId}`;
            const params = {
                merchantId,
                page,
                row,
                key: keyword,
                sortType,
                sortValue: sortType ? sortValue : null,
            };
            const resp: any = await axiosClient.get(url, { params });
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getExportService: async (id: number): Promise<string> => {
        try {
            let url = `Service/exportByMerchant/${id}`;
            const resp: any = await axiosClient.get(url);
            if (resp && resp.data) return resp.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    archiveService: async (id: number): Promise<string> => {
        try {
            let url = `Service/archive/${id}`;
            const resp: any = await axiosClient.put(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    restoreService: async (id: number): Promise<string> => {
        try {
            let url = `Service/restore/${id}`;
            const resp: any = await axiosClient.put(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    deleteService: async (id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.delete(`Service/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) {
                return resp?.message;
            } else {
                throw new Error(resp?.message);
            }
        } catch (error) {
            throw error;
        }
    },
    getSubscription: async (id: number): Promise<ISubscription> => {
        try {
            const url = `Subscription/getbymerchant/${id}`;
            const resp: any = await axiosClient.get(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getPackage: (id: number, page: number, row: number, sortValue?: string, sortType?: "asc" | "desc"): Promise<IPaging<ISubscription>> => {
        let url = `Subscription/getHistory/${id}`;
        const params = {
            page,
            row,
            sortType,
            sortValue: sortType ? sortValue : null,
        };
        return new Promise((resolve, reject) => {
            axiosClient.get(url, { params }).then(
                (resp: any) => {
                    if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) {
                        resolve(resp);
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

    getExportSubscription: (id: number): Promise<string> => {
        let url = `Subscription/history/export/${id}`;
        return new Promise((resolve, reject) => {
            axiosClient.get(url).then(
                (resp: any) => {
                    if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) {
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

    getExportCategory: async (id: number): Promise<string> => {
        let url = `category/export/${id}`;
        try {
            const resp: any = await axiosClient.get(url);
            if (resp && resp.data) {
                return resp?.data;
            } else {
                throw new Error(resp?.message);
            }
        } catch (error) {
            throw error;
        }
    },

    archiveCategory: async (id: number): Promise<string> => {
        try {
            let url = `category/archive/${id}`;
            const resp: any = await axiosClient.put(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) {
                return resp?.message;
            } else {
                throw new Error(resp?.message);
            }
        } catch (error) {
            throw error;
        }
    },

    restoreCategory: async (id: number): Promise<string> => {
        try {
            let url = `category/restore/${id}`;
            const resp: any = await axiosClient.put(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) {
                return resp?.message;
            } else {
                throw new Error(resp?.message);
            }
        } catch (error) {
            throw error;
        }
    },

    deleteCategory: async (id: number): Promise<string> => {
        try {
            let url = `category/${id}`;
            const resp: any = await axiosClient.delete(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) {
                return resp?.message;
            } else {
                throw new Error(resp?.message);
            }
        } catch (error) {
            throw error;
        }
    },

    getStaff: (merchantId: number, page: number, row: number, sortValue?: string, sortType?: "asc" | "desc", keyword?: string): Promise<IPaging<IStaff>> => {
        let url = `Staff/admin/getbymerchant/${merchantId}`;
        const params = {
            merchantId,
            page,
            row,
            key: keyword,
            sortType,
            sortValue: sortType ? sortValue : null,
        };
        return new Promise((resolve, reject) => {
            axiosClient.get(url, { params }).then(
                (resp: any) => {
                    resolve(resp);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    archiveStaff: async (id: number): Promise<string> => {
        try {
            let url = `Staff/archive/${id}`;
            const resp: any = await axiosClient.put(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) {
                return resp?.message;
            } else {
                throw new Error(resp?.message);
            }
        } catch (error) {
            throw error;
        }
    },

    restoreStaff: async (id: number): Promise<string> => {
        try {
            let url = `Staff/restore/${id}`;
            const resp: any = await axiosClient.put(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) {
                return resp?.message;
            } else {
                throw new Error(resp?.message);
            }
        } catch (error) {
            throw error;
        }
    },

    getStaffById: async (id: number, merchantId: number): Promise<IStaff> => {
        try {
            const resp: any = await axiosClient.get(`Staff/${id}?merchantId=${merchantId}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    changePrincipal: async (merchantId: number, newPrincipalId: number, currentPrincipalId?: number) => {
        let url = `/Merchant/${merchantId}/changePrincipal/${newPrincipalId}`;
        if (currentPrincipalId) {
            url = `${url}?currentPrincipalId=${currentPrincipalId}`;
        }

        try {
            const resp: any = await axiosClient.put(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    editCategory: async (params: any, id: number): Promise<string> => {
        try {
            let url = `category/${id}`;
            delete params.imageUrl;
            const resp: any = await axiosClient.put(url, params);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) {
                return resp?.message;
            } else {
                throw new Error(resp?.message);
            }
        } catch (error) {
            throw error;
        }
    },

    createCategory: async (params: any): Promise<string> => {
        try {
            let url = `category`;
            delete params.imageUrl;
            const resp: any = await axiosClient.post(url, params);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) {
                return resp?.message;
            } else {
                throw new Error(resp?.message);
            }
        } catch (error) {
            throw error;
        }
    },

    editSubscription: async (payload: any, id: number): Promise<string> => {
        try {
            const url = `Subscription/${id}`;
            const resp: any = await axiosClient.put(url, payload);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    editService: async (params: any, id: number): Promise<string> => {
        try {
            let url = `Service/${id}`;
            delete params.imageUrl;
            const resp: any = await axiosClient.put(url, params);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    createService: async (params: any): Promise<string> => {
        try {
            let url = `Service`;
            delete params.imageUrl;
            const resp: any = await axiosClient.post(url, params);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    updateGeneral: async (generalId: number, payload: any): Promise<string> => {
        try {
            let url = `General/${generalId}`;
            delete payload.imageUrl;
            const resp: any = await axiosClient.put(url, payload);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    editGeneralStaff: async (params: any, id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`Staff/${id}`, params);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getPin: async (merchantId: number, staffId: number, pincode: string): Promise<void> => {
        let url = `Staff/checkPincode/${merchantId}`;
        const params = {
            pincode,
            id: staffId || 0,
        };
        return new Promise((resolve, reject) => {
            axiosClient.get(url, { params }).then(
                (resp: any) => {
                    if (resp && resp?.codeNumber === HTTP_STATUS_CODES.OK) {
                        resolve(resp);
                    } else {
                        resolve(resp);
                    }
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    addNewStaff: async (params: any): Promise<string> => {
        try {
            const resp: any = await axiosClient.post(`Staff`, params);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    exportSettlement: async (id: number, params: any): Promise<string> => {
        try {
            const resp: any = await axiosClient.get(`/Settlement/export/monthly/${id}`);
            if (resp && resp?.data?.path) return resp?.data?.path;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    deleteMerchant: async (id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.delete(`/Merchant/delete/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    cloneMerchant: async (id: number): Promise<string> => {
        try {
            const resp: any = await axiosClient.post(`/Merchant/clone/${id}`);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
};

export default MerchantRepository;
