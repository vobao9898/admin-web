import axiosClient from "api/axiosClient";
import IAppointmentDashboard from "interfaces/IAppointmentDashboard";
import dayjs from "dayjs";
import IConsumerDashBoard from "interfaces/IConsumerDashBoard";
import IGiftCardDashBoard from "interfaces/IGiftCardDashBoard";
import ITransactionDashBoard from "interfaces/ITransactionDashBoard";
import { HTTP_STATUS_CODES } from "contants";
import { RangeValue } from "features/Dashboard/Appointment";

const DashBoardRepository = {
    getAppointments: async (merchantType: number, quickFilter: string, custom?: RangeValue): Promise<IAppointmentDashboard> => {
        try {
            let url = `/AdminDashboard/appointment?merchantType=${merchantType}&quickFilter=${quickFilter}`;
            if (quickFilter === "custom" && custom) {
                const timeStart = dayjs(custom[0]).format("MM/DD/YYYY");
                const timeEnd = dayjs(custom[1]).format("MM/DD/YYYY");
                url += `&timeStart=${timeStart}&timeEnd=${timeEnd}`;
            }
            const resp: any = await axiosClient.get(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },

    getMerchants: async (quickFilter: string, custom?: RangeValue): Promise<IAppointmentDashboard> => {
        try {
            let url = `/AdminDashboard/merchant?quickFilter=${quickFilter}`;
            if (quickFilter === "custom" && custom) {
                const timeStart = dayjs(custom[0]).format("MM/DD/YYYY");
                const timeEnd = dayjs(custom[1]).format("MM/DD/YYYY");
                url += `&timeStart=${timeStart}&timeEnd=${timeEnd}`;
            }
            const resp: any = await axiosClient.get(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    
    getConsumer: async (quickFilter: string, custom?: RangeValue): Promise<IConsumerDashBoard> => {
        try {
            let url = `AdminDashboard/consumer?quickFilter=${quickFilter}`;

            if (quickFilter === "custom" && custom) {
                const timeStart = dayjs(custom[0]).format("MM/DD/YYYY");
                const timeEnd = dayjs(custom[1]).format("MM/DD/YYYY");
                url += `&timeStart=${timeStart}&timeEnd=${timeEnd}`;
            }
            const resp: any = await axiosClient.get(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    getGifCard: async (quickFilter: string, custom?: RangeValue): Promise<IGiftCardDashBoard> => {
        try {
            let url = `/AdminDashboard/giftCard?quickFilter=${quickFilter}`;

            if (quickFilter === "custom" && custom) {
                const timeStart = dayjs(custom[0]).format("MM/DD/YYYY");
                const timeEnd = dayjs(custom[1]).format("MM/DD/YYYY");
                url += `&timeStart=${timeStart}&timeEnd=${timeEnd}`;
            }

            const resp: any = await axiosClient.get(url);

            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;

            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    getTransactions: async (quickFilter: string, custom?: RangeValue): Promise<ITransactionDashBoard> => {
        try {
            let url = `/AdminDashboard/paymentTransaction?quickFilter=${quickFilter}`;

            if (quickFilter === "custom" && custom) {
                const timeStart = dayjs(custom[0]).format("MM/DD/YYYY");
                const timeEnd = dayjs(custom[1]).format("MM/DD/YYYY");
                url += `&timeStart=${timeStart}&timeEnd=${timeEnd}`;
            }

            const resp: any = await axiosClient.get(url);

            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;

            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    exportAppointments: async (merchantType: number, quickFilter: string, custom?: RangeValue): Promise<string> => {
        try {
            let url = `/AdminDashboard/appointment/export?merchantType=${merchantType}&quickFilter=${quickFilter}&type=csv`;
            if (quickFilter === "custom" && custom) {
                const timeStart = dayjs(custom[0]).format("MM/DD/YYYY");
                const timeEnd = dayjs(custom[1]).format("MM/DD/YYYY");
                url += `&timeStart=${timeStart}&timeEnd=${timeEnd}`;
            }
            const resp: any = await axiosClient.get(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    exportMerchants: async (quickFilter: string, custom?: RangeValue): Promise<string> => {
        try {
            let url = `/AdminDashboard/merchant/export?quickFilter=${quickFilter}&type=csv`;
            if (quickFilter === "custom" && custom) {
                const timeStart = dayjs(custom[0]).format("MM/DD/YYYY");
                const timeEnd = dayjs(custom[1]).format("MM/DD/YYYY");
                url += `&timeStart=${timeStart}&timeEnd=${timeEnd}`;
            }
            const resp: any = await axiosClient.get(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    exportConsumer: async (quickFilter: string, custom?: RangeValue): Promise<string> => {
        try {
            let url = `AdminDashboard/consumer/export?quickFilter=${quickFilter}&type=csv`;
            if (quickFilter === "custom" && custom) {
                const timeStart = dayjs(custom[0]).format("MM/DD/YYYY");
                const timeEnd = dayjs(custom[1]).format("MM/DD/YYYY");
                url += `&timeStart=${timeStart}&timeEnd=${timeEnd}`;
            }
            const resp: any = await axiosClient.get(url)
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    exportGifCard: async (quickFilter: string, custom?: RangeValue): Promise<string> => {
        try {
            let url = `/AdminDashboard/giftCard/export?quickFilter=${quickFilter}&type=csv`;
            if (quickFilter === "custom" && custom) {
                const timeStart = dayjs(custom[0]).format("MM/DD/YYYY");
                const timeEnd = dayjs(custom[1]).format("MM/DD/YYYY");
                url += `&timeStart=${timeStart}&timeEnd=${timeEnd}`;
            }
            const resp: any = await axiosClient.get(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    exportTransactions: async (quickFilter: string, custom?: RangeValue): Promise<string> => {
        try {
            let url = `/AdminDashboard/paymentTransaction/export?quickFilter=${quickFilter}&type=csv`;

            if (quickFilter === "custom" && custom) {
                const timeStart = dayjs(custom[0]).format("MM/DD/YYYY");
                const timeEnd = dayjs(custom[1]).format("MM/DD/YYYY");
                url += `&timeStart=${timeStart}&timeEnd=${timeEnd}`;
            }
            const resp: any = await axiosClient.get(url);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.data;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
};

export default DashBoardRepository;
