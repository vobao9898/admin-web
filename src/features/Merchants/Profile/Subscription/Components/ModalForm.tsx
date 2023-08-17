import { Modal } from "antd";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { getPackageOptions } from "utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { RHFDatePicker, RHFInputNumber, RHFRadioGroup } from "components/Form";
import { ID_PACKAGE_ALLOW_ADD_MORE_STAFF } from "contants";
import * as yup from "yup";
import MerchantService from "services/MerchantService";
import Message from "components/Message";
import ISubscription from "interfaces/ISubscription";
import IPricingPlan from "interfaces/IPricingPlan";
import moment from "moment";
import ModalButton from "components/ModalButton";

interface IProps {
    packages: IPricingPlan[];
    subscription: ISubscription;
    onSuccess: () => void;
    onClose: () => void;
}

type FormInputs = {
    packageId: number;
    pricingType: string;
    expiredDate: Date;
    additionStaff: string | undefined;
};

const schema = yup.object({
    packageId: yup.number().required("This is a required field!"),
    pricingType: yup.string().required("This is a required field!"),
    expiredDate: yup.date().required("This is a required field!"),
    additionStaff: yup.string().when("packageId", {
        is: (packageId: number) => packageId === ID_PACKAGE_ALLOW_ADD_MORE_STAFF,
        then: (schema) =>
            schema.required("This is a required field!").matches(new RegExp("^[0-9]+$"), "Please enter only number!"),
    }),
});

const ModalForm: React.FC<IProps> = ({ subscription, packages, onClose, onSuccess }) => {
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { isSubmitting, isDirty },
    } = useForm<FormInputs>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            expiredDate: subscription.expiredDate,
            packageId: subscription.packageId,
            pricingType: subscription.pricingType,
            additionStaff: subscription.additionStaff ? subscription.additionStaff.toString() : "",
        },
    });

    const packagePricingWatch = watch("packageId");

    useEffect(() => {
        if (packagePricingWatch !== ID_PACKAGE_ALLOW_ADD_MORE_STAFF) {
            setValue("additionStaff", "", { shouldValidate: true });
        }
    }, [packagePricingWatch, setValue, subscription.additionStaff]);

    const onSubmit = async (data: FormInputs) => {
        const payload = {
            subscriptionId: subscription?.subscriptionId,
            packageId: data.packageId,
            expiredDate: moment.utc(data.expiredDate).format(),
            pricingType: data.pricingType,
            additionStaff: data.additionStaff ? parseInt(data.additionStaff) : 0,
        };

        try {
            const message = await MerchantService.editSubscription(payload, subscription.subscriptionId);
            Message.success({ text: message });
            onSuccess();
        } catch (error) {
            reset(data);
        }
    };

    const optionPricing = [
        {
            value: "monthly",
            label: "Paid Monthly",
        },
        {
            value: "annually",
            label: "Paid Annually",
        },
    ];

    return (
        <Modal
            centered={true}
            width={600}
            maskClosable={false}
            destroyOnClose={true}
            open={true}
            title={<p className="font-bold text-lg">Edit</p>}
            onCancel={onClose}
            footer={
                <div className="flex justify-end gap-x-2">
                    <ModalButton
                        disabled={isSubmitting}
                        title="Cancel"
                        type={"button"}
                        btnType="cancel"
                        onClick={onClose}
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                    <div className="col-span-12">
                        <RHFRadioGroup<FormInputs>
                            control={control}
                            name={"packageId"}
                            label="Subscription Plan"
                            options={getPackageOptions(packages)}
                        />
                    </div>
                    <div className="col-span-12">
                        <RHFRadioGroup<FormInputs>
                            showError={false}
                            control={control}
                            name={"pricingType"}
                            options={optionPricing}
                            label="Pricing Model"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6">
                        <RHFDatePicker<FormInputs>
                            className="w-full text-sm"
                            control={control}
                            name={"expiredDate"}
                            placeholder="Select date"
                            label="Next Payment Date"
                            disabledDate={true}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6">
                        <RHFInputNumber<FormInputs>
                            control={control}
                            name={"additionStaff"}
                            label="Addition staff"
                            allowNegative={false}
                            disabled={
                                packagePricingWatch === undefined ||
                                (packagePricingWatch && packagePricingWatch !== ID_PACKAGE_ALLOW_ADD_MORE_STAFF)
                                    ? true
                                    : false
                            }
                            placeholder="Enter addition staff"
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ModalForm;
