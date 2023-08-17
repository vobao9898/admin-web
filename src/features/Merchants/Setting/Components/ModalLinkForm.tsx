import { Modal } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { RHFCheckBox, RHFInputNumber } from "components/Form";
import IMerchant from "interfaces/IMerchant";
import MerchantService from "services/MerchantService";
import Message from "components/Message";
import { useEffect } from "react";
import ModalButton from "components/ModalButton";

interface IProps {
    merchant: IMerchant;
    merchantId: number;
    modalEdit: boolean;
    setModalEdit: (value: boolean) => void;
    setIsLoading: (value: boolean) => void;
    fetchData: (value: string) => void;
    onCloseEdit: () => void;
}

type FormInputs = {
    cashDiscountPercent: number;
    discountRate: number;
    isCashDiscount: boolean;
    isTest: boolean;
    isTop: boolean;
    merchantCode: string;
    pointRate: number;
    transactionsFee: number;
    turnAmount: number;
};

const schema = yup.object({
    transactionsFee: yup.number().required("This is a required field!"),
    merchantCode: yup.string().required("This is a required field!"),
    discountRate: yup.number().required("This is a required field!"),
    pointRate: yup.number().required("This is a required field!"),
    turnAmount: yup.number().required("This is a required field!"),
    isCashDiscount: yup.boolean().required("This is a required field!"),
    isTop: yup.boolean().required("This is a required field!"),
    isTest: yup.boolean().required("This is a required field!"),
    cashDiscountPercent: yup.number().required("This is a required field!"),
});

const ModalForm: React.FC<IProps> = ({
    merchant,
    merchantId,
    modalEdit,
    setIsLoading,
    setModalEdit,
    fetchData,
    onCloseEdit,
}) => {
    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { isSubmitting, isDirty },
    } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {},
    });

    useEffect(() => {
        const onValue = (merchant: IMerchant) => {
            setValue("cashDiscountPercent", parseInt(merchant.cashDiscountPercent));
            setValue("discountRate", merchant.discountRate);
            setValue("isCashDiscount", merchant.isCashDiscount);
            setValue("isTest", merchant.isTest);
            setValue("isTop", merchant.isTop);
            setValue("merchantCode", merchant.merchantCode);
            setValue("pointRate", parseInt(merchant.pointRate));
            setValue("transactionsFee", merchant.transactionsFee);
            setValue("turnAmount", parseInt(merchant.turnAmount));
        };
        if (merchant) {
            onValue(merchant);
        }
    }, [merchant, setValue]);

    const onSubmit = async (data: FormInputs) => {
        if (merchant && merchantId) {
            const values = {
                ...data,
                merchantToken: merchant?.merchantCode,
                totalAmountLimit: +merchant?.totalAmountLimit,
                cashDiscountPercent: +data?.cashDiscountPercent,
                discountRate: +data?.discountRate,
                pointRate: +data?.pointRate,
                isWareHouse: merchant?.isWareHouse || false,
                transactionsFee: +data?.transactionsFee,
                turnAmount: +data?.turnAmount,
                timezone: "",
            };
            try {
                setIsLoading(true);
                const message = await MerchantService.editSetting(values, merchantId);
                Message.success({ text: message });
                setModalEdit(false);
                fetchData(merchantId.toString());
                reset();
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        }
    };

    return (
        <Modal
            centered={true}
            maskClosable={false}
            destroyOnClose={true}
            open={modalEdit}
            width={800}
            title={<p className="font-bold text-lg">{"Edit"}</p>}
            onCancel={onCloseEdit}
            footer={
                <div className="flex justify-end gap-x-2">
                    <ModalButton
                        disabled={isSubmitting}
                        title="Cancel"
                        type={"button"}
                        btnType="cancel"
                        onClick={onCloseEdit}
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
                <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6 mb-4">
                        <RHFInputNumber<FormInputs>
                            control={control}
                            name={"transactionsFee"}
                            label="Transactions Fee"
                            thousandSeparator=","
                            decimalScale={2}
                            fixedDecimalScale
                            allowNegative={false}
                            placeholder="0.00"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6 mb-4">
                        <RHFInputNumber<FormInputs>
                            control={control}
                            name={"merchantCode"}
                            label="Merchant Code"
                            decimalScale={0}
                            fixedDecimalScale
                            allowNegative={false}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6 mb-4">
                        <RHFInputNumber<FormInputs>
                            control={control}
                            name={"discountRate"}
                            label="Discount Rate"
                            thousandSeparator=","
                            decimalScale={2}
                            placeholder="0.00"
                            fixedDecimalScale
                            allowNegative={false}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6 mb-4">
                        <RHFInputNumber<FormInputs>
                            control={control}
                            name={"pointRate"}
                            label="Point Rate"
                            thousandSeparator=","
                            decimalScale={2}
                            placeholder="0.00"
                            fixedDecimalScale
                            allowNegative={false}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6 mb-4">
                        <RHFInputNumber<FormInputs>
                            control={control}
                            name={"turnAmount"}
                            label="Turn Amount"
                            thousandSeparator=","
                            decimalScale={2}
                            placeholder="0.00"
                            fixedDecimalScale
                            allowNegative={false}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6 mb-4">
                        <RHFCheckBox<FormInputs>
                            className="w-full"
                            control={control}
                            name={"isCashDiscount"}
                            label="Apply Cash Discount Program"
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6 mb-4">
                        <RHFCheckBox<FormInputs>
                            className="w-full"
                            control={control}
                            name={"isTop"}
                            label="Top Store"
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6 mb-4">
                        <RHFCheckBox<FormInputs>
                            className="w-full"
                            control={control}
                            name={"isTest"}
                            label="Test Merchant"
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6 mb-4">
                        <RHFInputNumber<FormInputs>
                            control={control}
                            name={"cashDiscountPercent"}
                            label="Cash discount percent"
                            thousandSeparator=","
                            decimalScale={2}
                            placeholder="0.00"
                            labelRequired={false}
                            fixedDecimalScale
                            allowNegative={false}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ModalForm;
