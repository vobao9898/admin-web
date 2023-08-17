import IAppointmentDashboard from "interfaces/IAppointmentDashboard";
import DashboardRepository from "repositories/DashBoardRepository";
import IConsumerDashBoard from "interfaces/IConsumerDashBoard";
import IGiftCardDashBoard from "interfaces/IGiftCardDashBoard";
import ITransactionDashBoard from "interfaces/ITransactionDashBoard";
import { RangeValue } from "features/Dashboard/Appointment";
import { handleResponseError } from "utils";

const DashBoardService = {
    getAppointments: async (merchantType: number, quickFilter: string, custom?: RangeValue): Promise<IAppointmentDashboard> => {
        try {
            const response = await DashboardRepository.getAppointments(merchantType, quickFilter, custom);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    getMerchants: async (quickFilter: string, custom?: RangeValue): Promise<IAppointmentDashboard> => {
        try {
            const response = await DashboardRepository.getMerchants(quickFilter, custom);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    getConsumers: async (quickFilter: string, custom?: RangeValue): Promise<IConsumerDashBoard> => {
        try {
            const response = await DashboardRepository.getConsumer(quickFilter, custom);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    getGifCard: async (quickFilter: string, custom?: RangeValue): Promise<IGiftCardDashBoard> => {
        try {
            const response = await DashboardRepository.getGifCard(quickFilter, custom);
            return response;
        } catch (error: any) {
            throw error;
        }
    },
    getTransactions: async (quickFilter: string, custom?: RangeValue): Promise<ITransactionDashBoard> => {
        try {
            const response = await DashboardRepository.getTransactions(quickFilter, custom);
            return response;
        } catch (error: any) {
            throw error;
        }
    },

    exportAppointments: async (merchantType: number, quickFilter: string, custom?: RangeValue): Promise<string> => {
        try {
            const response = await DashboardRepository.exportAppointments(merchantType, quickFilter, custom);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    exportMerchants: async (quickFilter: string, custom?: RangeValue): Promise<string> => {
        try {
            const response = await DashboardRepository.exportMerchants(quickFilter, custom);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    exportConsumers: async (quickFilter: string, custom?: RangeValue): Promise<string> => {
        try {
            const response = await DashboardRepository.exportConsumer(quickFilter, custom);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    exportGifCard: async (quickFilter: string, custom?: RangeValue): Promise<string> => {
        try {
            const response = await DashboardRepository.exportGifCard(quickFilter, custom);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    exportTransactions: async (quickFilter: string, custom?: RangeValue): Promise<string> => {
        try {
            const response = await DashboardRepository.exportTransactions(quickFilter, custom);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
};

export default DashBoardService;
