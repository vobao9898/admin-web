import IConsumerReloadGiftCard from "interfaces/IConsumerReloadGiftCard";
import IGiftCardSold from "interfaces/IGiftCardSold";
import IGiftCardSoldDetail from "interfaces/IGiftCardSoldDetail";
import IMerchantBatchSettlement from "interfaces/IMerchantBatchSettlement";
import IMerchantTransaction from "interfaces/IMerchantTransaction";
import IPaging from "interfaces/IPaging";
import ITransaction from "interfaces/ITransaction";
import IUserActivity from "interfaces/IUserActivity";
import ReportRepository from "repositories/ReportRepository";
import RangeValue from "interfaces/RangeValue";
import { handleResponseError } from "utils";

const ReportService = {
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
        try {
            const response = await ReportRepository.getTransaction(page, row, timeRange, custom, status, amountRanges, keyword, sortType, sortValue);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    transactionRefund: async (id: number): Promise<void> => {
        try {
            const response = await ReportRepository.transactionRefund(id);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getTransactionsGiftCard: async (page: number, row: number, timeRange: string, custom: any, amountRanges: [number, number], keyword?: string): Promise<IPaging<IConsumerReloadGiftCard>> => {
        try {
            const response = await ReportRepository.getTransactionsGiftCard(page, row, timeRange, custom, amountRanges, keyword);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getMerchantBatchSettlements: async (page: number, row: number, timeRange: string, custom: any, keyword?: string, sortType?: string, sortValue?: string): Promise<IPaging<IMerchantBatchSettlement>> => {
        try {
            const response = await ReportRepository.getMerchantBatchSettlements(page, row, timeRange, custom, keyword, sortType, sortValue);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getBatchById: async (page: number, row: number, id: number): Promise<IPaging<IMerchantTransaction>> => {
        try {
            const response = await ReportRepository.getBatchById(page, row, id);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getGiftCardSold: async (page: number, row: number, timeRange: string, custom: any, keyword?: string): Promise<IPaging<IGiftCardSold>> => {
        try {
            const response = await ReportRepository.getGiftCardSold(page, row, timeRange, custom, keyword);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getGiftCardSoldById: async (page: number, row: number, id: number, date: string): Promise<IPaging<IGiftCardSoldDetail>> => {
        try {
            const response = await ReportRepository.getGiftCardSoldById(page, row, id, date);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getGiftCardTransactions: async (page: number, row: number, timeRange: string, custom: any, type: string, keyword?: string, sortType?: string, sortValue?: string): Promise<IPaging<IGiftCardSoldDetail>> => {
        try {
            const response = await ReportRepository.getGiftCardTransactions(page, row, timeRange, custom, type, keyword, sortType, sortValue);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    exportGiftCardTransactions: async (page: number, row: number, timeRange: string, custom: any, type: string, keyword?: string): Promise<string> => {
        try {
            const response = await ReportRepository.exportGiftCardTransactions(page, row, timeRange, custom, type, keyword);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },

    getBasic: async (): Promise<void> => {
        try {
            const response = await ReportRepository.getBasic();
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getDeviceMerchant: async (id: string): Promise<void> => {
        try {
            const response = await ReportRepository.getDeviceMerchant(id);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getSsnByDevice: async (merchantId: string, deviceId: string): Promise<void> => {
        try {
            const response = await ReportRepository.getSsnByDevice(merchantId, deviceId);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getSettlementWaiting: async (merchantId: string, deviceId: string, sn: string | null | undefined): Promise<void> => {
        try {
            const response = await ReportRepository.getSettlementWaiting(merchantId, deviceId, sn);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    closeSettlement: async (settlement: IMerchantBatchSettlement, terminal: string, note: string, currentObj: any): Promise<void> => {
        try {
            const response = await ReportRepository.closeSettlement(settlement, terminal, note, currentObj);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getTransactionByUser: async (page: number, row: number, timeRange: string, custom: any, id: number, keyword?: string): Promise<IPaging<ITransaction>> => {
        try {
            const response = await ReportRepository.getTransactionByUser(page, row, timeRange, custom, id, keyword);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    getUserActivity: async (page: number, row: number, custom: any, id: number, keyword?: string): Promise<IPaging<IUserActivity>> => {
        try {
            const response = await ReportRepository.getUserActivity(page, row, custom, id, keyword);
            return response;
        } catch (error: any) {
            throw error;
        }
    },
};

export default ReportService;
