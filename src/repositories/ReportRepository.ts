import axiosClient from "api/axiosClient";
import { HTTP_STATUS_CODES } from "contants";
import dayjs from "dayjs";
import IConsumerReloadGiftCard from "interfaces/IConsumerReloadGiftCard";
import IGiftCardSold from "interfaces/IGiftCardSold";
import IGiftCardSoldDetail from "interfaces/IGiftCardSoldDetail";
import IMerchantBatchSettlement from "interfaces/IMerchantBatchSettlement";
import IMerchantTransaction from "interfaces/IMerchantTransaction";
import IPaging from "interfaces/IPaging";
import ITransaction from "interfaces/ITransaction";
import IUserActivity from "interfaces/IUserActivity";
import RangeValue from "interfaces/RangeValue";
import moment from "moment";

const ReportRepository = {
    getTransaction: async (
        page: number,
        row: number,
        timeRange: string,
        custom: RangeValue,
        status: string,
        amountRanges: [number, number],
        keyword?: string,
        sortType?: string,
        sortValue?: string
    ): Promise<IPaging<ITransaction>> => {
        let url = `PaymentTransaction/search`;
        let timeStart = null;
        let timeEnd = null;
        if (timeRange === "custom" && custom) {
            timeStart = moment(dayjs(custom[0], "DD/MM/YYYY").toString()).format("L");
            timeEnd = moment(dayjs(custom[1], "DD/MM/YYYY").toString()).format("L");
        }
        const params = {
            page,
            row,
            timeStart,
            timeEnd,
            quickFilter: timeRange,
            key: keyword || "",
            status,
            amountFrom: amountRanges[0],
            amountTo: amountRanges[1],
            sortType,
            sortValue: sortType ? sortValue : null,
        };

        try {
            const resp: any = await axiosClient.get(url, { params });
            if (resp && (resp.codeNumber === HTTP_STATUS_CODES.OK || resp.codeNumber === HTTP_STATUS_CODES.NOTFOUND)) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    transactionRefund: (id: number): Promise<void> => {
        let url = `/PaymentTransaction/refund/${id}`;
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

    getTransactionsGiftCard: async (page: number, row: number, timeRange: string, custom: RangeValue, amountRanges: [number, number], keyword?: string): Promise<IPaging<IConsumerReloadGiftCard>> => {
        let url = `P2PGiftCard/transaction`;
        let timeStart = null;
        let timeEnd = null;
        if (timeRange === "custom" && custom) {
            timeStart = moment(dayjs(custom[0], "DD/MM/YYYY").toString()).format("L");
            timeEnd = moment(dayjs(custom[1], "DD/MM/YYYY").toString()).format("L");
        }
        const params = {
            page,
            row,
            timeStart,
            timeEnd,
            quickFilter: timeRange,
            key: keyword || "",
            amountFrom: amountRanges[0],
            amountTo: amountRanges[1],
        };
        try {
            const resp: any = await axiosClient.get(url, { params });
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getMerchantBatchSettlements: async (page: number, row: number, timeRange: string, custom: any, keyword?: string, sortType?: string, sortValue?: string): Promise<IPaging<IMerchantBatchSettlement>> => {
        let url = `/Settlement`;
        let timeStart = null;
        let timeEnd = null;
        if (timeRange === "custom") {
            timeStart = moment(dayjs(custom[0], "DD/MM/YYYY").toString()).format("L");
            timeEnd = moment(dayjs(custom[1], "DD/MM/YYYY").toString()).format("L");
        }
        const params = {
            page,
            row,
            timeStart,
            timeEnd,
            quickFilter: timeRange,
            key: keyword || "",
            sortType,
            sortValue: sortType ? sortValue : null,
        };
        try {
            const resp: any = await axiosClient.get(url, { params });
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getBatchById: (page: number, row: number, id: number): Promise<IPaging<IMerchantTransaction>> => {
        let url = `/Settlement/${id}`;
        const params = {
            page,
            row,
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

    getGiftCardSold: async (page: number, row: number, timeRange: string, custom: any, keyword?: string): Promise<IPaging<IGiftCardSold>> => {
        const url = `/GiftCard/sold`;
        let timeStart = null;
        let timeEnd = null;
        if (timeRange === "custom") {
            timeStart = moment(dayjs(custom[0], "DD/MM/YYYY").toString()).format("L");
            timeEnd = moment(dayjs(custom[1], "DD/MM/YYYY").toString()).format("L");
        }
        const params = {
            page,
            row,
            timeStart,
            timeEnd,
            quickFilter: timeRange,
            key: keyword || "",
        };

        try {
            const resp: any = await axiosClient.get(url, { params });
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getGiftCardSoldById: async (page: number, row: number, id: number, date: string): Promise<IPaging<IGiftCardSoldDetail>> => {
        const url = `/GiftCard/sold/${id}`;
        const params = {
            page,
            row,
            date,
        };

        try {
            const resp: any = await axiosClient.get(url, { params });
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getGiftCardTransactions: async (page: number, row: number, timeRange: string, custom: any, type: string, keyword?: string, sortType?: string, sortValue?: string): Promise<IPaging<IGiftCardSoldDetail>> => {
        let url = `/GiftCard/giftCardTransaction`;
        let timeStart = null;
        let timeEnd = null;
        if (timeRange === "custom") {
            timeStart = moment(dayjs(custom[0], "DD/MM/YYYY").toString()).format("L");
            timeEnd = moment(dayjs(custom[1], "DD/MM/YYYY").toString()).format("L");
        }

        let sorts: any = {};
        if (sortValue) {
            sorts[sortValue] = sortType;
        }

        const params = {
            page,
            row,
            timeStart,
            timeEnd,
            quickFilter: timeRange,
            key: keyword || "",
            type,
            sorts: JSON.stringify(sorts),
        };

        try {
            const resp: any = await axiosClient.get(url, { params });
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    exportGiftCardTransactions: async (page: number, row: number, timeRange: string, custom: any, type: string, keyword?: string): Promise<string> => {
        const url = `/GiftCard/export/giftCardTransaction`;
        let timeStart = null;
        let timeEnd = null;
        if (timeRange === "custom") {
            timeStart = moment(dayjs(custom[0], "DD/MM/YYYY").toString()).format("L");
            timeEnd = moment(dayjs(custom[1], "DD/MM/YYYY").toString()).format("L");
        }
        const params = {
            page,
            row,
            timeStart,
            timeEnd,
            quickFilter: timeRange,
            key: keyword || "",
            type,
        };

        try {
            const resp: any = await axiosClient.get(url, { params });
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getBasic: (): Promise<void> => {
        let url = `/Merchant/basicList`;
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

    getDeviceMerchant: (id: string): Promise<void> => {
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

    getSsnByDevice: (merchantId: string, deviceId: string): Promise<void> => {
        const param = {
            merchantId,
            deviceId,
        };
        let url = `/Settlement/ssnByDevice`;
        return new Promise((resolve, reject) => {
            axiosClient.get(url, { params: param }).then(
                (resp: any) => {
                    resolve(resp.data);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    getSettlementWaiting: async (merchantId: string, deviceId: string, sn: string | null | undefined): Promise<void> => {
        const param = {
            merchantId,
            deviceId,
            sn: sn || null,
        };
        let url = `/Settlement/getdatawaiting`;
        return new Promise((resolve, reject) => {
            axiosClient.get(url, { params: param }).then(
                (resp: any) => {
                    resolve(resp);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    closeSettlement: async (settlement: IMerchantBatchSettlement, terminal: string, note: string, currentObj: any): Promise<void> => {
        const param = {
            ...settlement,
            note,
            TerminalId: terminal,
            chekout: settlement?.checkout,
            discount: settlement?.discount,
            isConnectPax: settlement?.isConnectPax,
            merchantId: currentObj?.merchant,
            otherPayment: settlement?.otherPayment,
            otherPaymentStatistic: settlement?.otherPaymentStatistic,
            paymentByCash: settlement?.paymentByCash,
            paymentByCashStatistic: settlement?.paymentByCashStatistic,
            paymentByCreditCard: settlement?.paymentByCreditCard,
            paymentByHarmony: settlement?.paymentByHarmony,
            paymentTerminal: settlement?.paymentTerminal,
            total: settlement?.total,
        };
        let url = `/Settlement`;
        return new Promise((resolve, reject) => {
            axiosClient.post(url, param).then(
                (resp: any) => {
                    resolve(resp);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    },

    getTransactionByUser: (page: number, row: number, timeRange: string, custom: RangeValue, id: number, keyword?: string): Promise<IPaging<ITransaction>> => {
        let url = `/PaymentTransaction/${id}`;
        var timeStart = null;
        var timeEnd = null;
        if (timeRange === "custom" && custom) {
            timeStart = moment(dayjs(custom[0], "DD/MM/YYYY").toString()).format("L");
            timeEnd = moment(dayjs(custom[1], "DD/MM/YYYY").toString()).format("L");
        }
        const params = {
            page,
            row,
            timeStart,
            timeEnd,
            quickFilter: timeRange,
            key: keyword || "",
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

    getUserActivity: (page: number, row: number, custom: any, id: number, keyword?: string): Promise<IPaging<IUserActivity>> => {
        let url = `/UserActivity/${id}`;
        var timeStart = null;
        var timeEnd = null;
        if (custom[0] && custom[1]) {
            timeStart = moment(dayjs(custom[0], "DD/MM/YYYY").toString()).format("L");
            timeEnd = moment(dayjs(custom[1], "DD/MM/YYYY").toString()).format("L");
        }
        const params = {
            page,
            row,
            from: timeStart,
            to: timeEnd,
            key: keyword || "",
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
};

export default ReportRepository;
