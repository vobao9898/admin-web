import { yupResolver } from "@hookform/resolvers/yup";
import { Modal, Spin } from "antd";
import { RHFCurrencyInput, RHFInputNumber, RHFSelect, RHFTextField } from "components/Form";
import { STATUS_OPTIONS } from "contants";
import { useForm } from "react-hook-form";
import ModalButton from "components/ModalButton";
import IPricingPlan from "interfaces/IPricingPlan";
import PricingPlanService from "services/PricingPlanService";
import React from "react";
import * as yup from "yup";
import Message from "components/Message";

interface IProps {
    onClose: (isReload: boolean) => void;
    pricingPlan: IPricingPlan | null;
}

type FormInputs = {
    packageName: string;
    pricing: number;
    isDisabled: number;
    staffLimit: number;
};

const schema = yup.object({
    packageName: yup.string().required("This is a required field!"),
    pricing: yup.number().required("This is a required field!").typeError("Please enter only number"),
    isDisabled: yup.number().required("This is a required field!"),
    staffLimit: yup.number().required("This is a required field!").typeError("Please enter only number"),
});

const PlanModal: React.FC<IProps> = ({ onClose, pricingPlan }) => {
    const {
        control,
        reset,
        handleSubmit,
        formState: { isSubmitting, isDirty },
    } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            packageName: pricingPlan?.packageName || "",
            pricing: pricingPlan?.pricing ? parseFloat(pricingPlan.pricing) : undefined,
            isDisabled: pricingPlan?.isDisabled || 0,
            staffLimit: pricingPlan?.staffLimit || undefined,
        },
    });

    const onSubmit = (data: FormInputs) => {
        const body: Partial<IPricingPlan> = {
            packageName: data.packageName,
            pricing: data.pricing.toString(),
            isDisabled: data.isDisabled,
            staffLimit: data.staffLimit,
        };

        return new Promise<void>((resolve, reject) => {
            if (pricingPlan) {
                onUpdate(pricingPlan.packageId, body, data);
            } else {
                onCreate(body, data);
            }
        });
    };

    const handleReset = (data: FormInputs) => {
        reset({
            packageName: data.packageName,
            pricing: data.pricing,
            isDisabled: data.isDisabled,
            staffLimit: data.staffLimit,
        });
    };

    const onCreate = (body: Partial<IPricingPlan>, data: FormInputs) => {
        return new Promise<void>((resolve, reject) => {
            PricingPlanService.create(body).then(
                (resp) => {
                    resolve();
                    onClose(true);
                    Message.success({ text: resp });
                },
                (err) => {
                    handleReset(data);
                }
            );
        });
    };

    const onUpdate = (id: number, body: Partial<IPricingPlan>, data: FormInputs) => {
        return new Promise<void>((resolve, reject) => {
            PricingPlanService.update(id, body).then(
                (resp) => {
                    resolve();
                    onClose(true);
                    Message.success({ text: resp });
                },
                (err) => {
                    handleReset(data);
                }
            );
        });
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose(false);
        }
    };

    return (
        <Spin spinning={isSubmitting}>
            <Modal
                centered={true}
                maskClosable={false}
                destroyOnClose={true}
                open={true}
                width={700}
                title={<p className="font-bold text-lg">{pricingPlan ? "Edit" : "Add"}</p>}
                onCancel={handleClose}
                footer={
                    <div className="flex justify-end gap-x-2">
                        <ModalButton
                            disabled={isSubmitting}
                            title="Cancel"
                            type={"button"}
                            btnType="cancel"
                            onClick={handleClose}
                        />
                        <ModalButton
                            loading={isSubmitting}
                            disabled={isSubmitting || !isDirty}
                            title="Save"
                            type={"submit"}
                            btnType="save"
                            onClick={handleSubmit(onSubmit)}
                        />
                    </div>
                }
            >
                <form>
                    <div className="grid grid-cols-12 gap-x-4 gap-y-4">
                        <div className="col-span-12">
                            <RHFTextField<FormInputs>
                                control={control}
                                name={"packageName"}
                                label="Subtitle"
                                placeholder="Enter subtitle"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFCurrencyInput<FormInputs>
                                control={control}
                                name={"pricing"}
                                label="Pricing"
                                thousandSeparator=","
                                decimalScale={2}
                                placeholder="0.00"
                                fixedDecimalScale
                                allowNegative={false}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFSelect<FormInputs>
                                className="w-full"
                                control={control}
                                options={STATUS_OPTIONS}
                                name={"isDisabled"}
                                label="Status"
                                placeholder="Select status"
                            />
                        </div>
                        <div className="col-span-12">
                            <RHFInputNumber<FormInputs>
                                max={10000000}
                                min={0}
                                control={control}
                                thousandSeparator=","
                                decimalScale={0}
                                name={"staffLimit"}
                                label="Number of staff"
                                allowNegative={false}
                            />
                        </div>
                    </div>
                </form>
            </Modal>
        </Spin>
    );
};

export default PlanModal;
