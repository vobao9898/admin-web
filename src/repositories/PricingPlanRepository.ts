import axiosClient from "api/axiosClient";
import IPricingPlan from "interfaces/IPricingPlan";
import IPaging from "interfaces/IPaging";
import { HTTP_STATUS_CODES } from "contants";

const PricingPlanRepository = {
    get: async (keyword?: string, status?: number): Promise<IPaging<IPricingPlan>> => {
        try {
            let url = `package?`;

            if (status === 0 || status === 1) {
                url += `&isDisabled=${status}`;
            }

            if (keyword) {
                url += `&key=${keyword}`;
            }

            const resp: any = await axiosClient.get(url);

            if (resp && resp?.codeNumber === HTTP_STATUS_CODES.OK) return resp;

            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    create: async (data: Partial<IPricingPlan>): Promise<string> => {
        try {
            const resp: any = await axiosClient.post("/Package", data);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
    update: async (id: number, data: Partial<IPricingPlan>): Promise<string> => {
        try {
            const resp: any = await axiosClient.put(`/Package/${id}`, data);
            if (resp && resp.codeNumber === HTTP_STATUS_CODES.OK) return resp?.message;
            throw new Error(resp?.message);
        } catch (error) {
            throw error;
        }
    },
};

export default PricingPlanRepository;
