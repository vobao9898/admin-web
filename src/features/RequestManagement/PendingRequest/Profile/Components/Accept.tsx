import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "antd";
import { RHFInputNumber, RHFTextField } from "components/Form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ModalButton from "components/ModalButton";
import Message from "components/Message";
import IMerchant from "interfaces/IMerchant";
import RequestManagementService from "services/RequestManagementService";
import * as yup from "yup";

interface IProps {
    isAccept: boolean;
    merchantId: string;
    pending: IMerchant;
    handleClose: () => void;
    setIsLoading: (value: boolean) => void;
}

type FormInputs = {
    merchantCode: string;
    transactionsFee: string;
    discountRate: string;
};

const schema = yup.object({
    merchantCode: yup
        .string()
        .required("This is a required field!")
        .min(4, "Please enter at least 4 number characters!")
        .max(20, "Please enter maximum 20 number characters!"),
    transactionsFee: yup.string().required("This is a required field!"),
    discountRate: yup.string().required("This is a required field!"),
});

const Accept: React.FC<IProps> = ({ isAccept, merchantId, pending, handleClose }) => {
    const navigate = useNavigate();
    const {
        control,
        reset,
        handleSubmit,
        formState: { isDirty, isSubmitting },
    } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            merchantCode: "",
            transactionsFee: "",
            discountRate: "",
        },
    });

    const onSubmit = async (data: FormInputs) => {
        if (merchantId) {
            const payload = {
                merchantToken: "",
                timezone: "",
                totalAmountLimit: 0,
                pointRate: 0,
                turnAmount: 0,
                isTop: true,
                isTest: true,
                isCashDiscount: true,
                cashDiscountPercent: 0,
                isWareHouse: pending?.isWareHouse || false,
                merchantId: merchantId,
                path: "/app/merchants/pending",
                merchantCode: data.merchantCode,
                discountRate: data.discountRate,
                transactionsFee: data.transactionsFee,
            };
            try {
                const message = await RequestManagementService.acceptPending(payload, parseInt(merchantId));
                Message.success({ text: message });
                navigate("/request/pending-request");
            } catch (error) {
                reset(data);
            }
        }
    };

    const onClose = () => {
        if (!isSubmitting) handleClose();
    };

    return (
        <Modal
            centered={true}
            maskClosable={false}
            destroyOnClose={true}
            open={isAccept}
            title={<p className="font-bold text-lg">Confirmation</p>}
            onCancel={onClose}
            footer={
                <div className="flex justify-end space-x-2">
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 space-y-4">
                    <div className="col-span-12">
                        <RHFTextField<FormInputs>
                            control={control}
                            name={"merchantCode"}
                            placeholder="Enter merchant id"
                            label="Merchant ID"
                        />
                    </div>
                    <div className="col-span-12">
                        <RHFInputNumber<FormInputs>
                            max={1000000000}
                            min={0}
                            control={control}
                            thousandSeparator=","
                            decimalScale={2}
                            name={"transactionsFee"}
                            label="Enter Transaction Fee"
                            placeholder="0.00"
                            className="text-right"
                            fixedDecimalScale
                        />
                    </div>
                    <div className="col-span-12">
                        <RHFInputNumber<FormInputs>
                            max={1000000000}
                            min={0}
                            control={control}
                            thousandSeparator=","
                            decimalScale={2}
                            name={"discountRate"}
                            label="Discount Rate"
                            placeholder="0.00"
                            className="text-right"
                            fixedDecimalScale
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default Accept;
