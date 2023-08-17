import PricingPlanRepository from "repositories/PricingPlanRepository";
import IPaging from "interfaces/IPaging";
import IPricingPlan from "interfaces/IPricingPlan";
import { handleResponseError } from "utils";

const PricingPlanService = {
    get: async (keyword?: string, status?: number): Promise<IPaging<IPricingPlan>> => {
        try {
            const response = await PricingPlanRepository.get(keyword, status);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    create: async (data: Partial<IPricingPlan>): Promise<string> => {
        try {
            const response = await PricingPlanRepository.create(data);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
    update: async (id: number, data: Partial<IPricingPlan>): Promise<string> => {
        try {
            const response = await PricingPlanRepository.update(id, data);
            return response;
        } catch (error: any) {
            handleResponseError(error);
            throw error;
        }
    },
};

export default PricingPlanService;
