import { Modal } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { RHFInputNumber, RHFSelect, RHFTextField } from "components/Form";
import * as yup from "yup";
import ModalButton from "components/ModalButton";
import MerchantService from "services/MerchantService";
import Message from "components/Message";

interface ISelect {
    value: number;
    label: string;
}

interface IProps {
    merchantId: number;
    modalEdit: boolean;
    dataSelect: ISelect[];
    onClose: () => void;
    onSuccess: () => void;
}

type FormInputs = {
    amount: string;
    merchants: string[] | undefined | null;
    name: string;
    quantity: string;
};

const schema = yup.object({
    amount: yup.string().required("This is a required field!"),
    name: yup.string().required("This is a required field!"),
    quantity: yup.string().required("This is a required field!"),
    merchants: yup.array().notRequired(),
});

const ModalForm: React.FC<IProps> = ({ merchantId, modalEdit, dataSelect, onClose, onSuccess }) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            amount: "",
            quantity: "",
            merchants: [],
        },
    });

    const onSubmit = async (data: FormInputs) => {
        const payload = {
            name: data.name,
            amount: data.amount,
            quantity: data.quantity,
            merchants: data.merchants ? data.merchants.toString() : "",
            merchantId: merchantId.toString(),
        };

        try {
            const message = await MerchantService.postGiftCardGeneral(payload);
            Message.success({ text: message });
            reset();
            onSuccess();
        } catch (error) {
            reset(data);
        }
    };

    return (
        <Modal
            centered={true}
            maskClosable={false}
            destroyOnClose={true}
            open={modalEdit}
            title={<p className="font-bold text-lg">Edit</p>}
            onCancel={onClose}
            footer={
                <div className="flex justify-end space-x-2">
                    <ModalButton
                        type={"button"}
                        btnType="cancel"
                        title="Cancel"
                        disabled={isSubmitting}
                        className="bg-blue-100 px-4 py-2.5 rounded-xl hover:bg-blue-500 hover:text-white mr-2 btn-cancel"
                        onClick={onClose}
                    />
                    <ModalButton
                        type={"submit"}
                        btnType="save"
                        title="Save"
                        onClick={handleSubmit(onSubmit)}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        className="px-4 py-2.5 rounded-xl inline-flex items-center btn-save text-white bg-blue-500 hover:bg-blue-400"
                    />
                </div>
            }
        >
            <form>
                <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                    <div className="col-span-12">
                        <RHFTextField<FormInputs>
                            control={control}
                            name={"name"}
                            placeholder="Enter gift card label"
                            label="Gift Card Label"
                        />
                    </div>
                    <div className="col-span-12">
                        <RHFInputNumber<FormInputs>
                            control={control}
                            name={"amount"}
                            label="Value"
                            thousandSeparator=","
                            decimalScale={2}
                            allowNegative={false}
                            fixedDecimalScale
                            placeholder="0.00"
                        />
                    </div>
                    <div className="col-span-12">
                        <RHFInputNumber<FormInputs>
                            control={control}
                            name={"quantity"}
                            label="Qty"
                            placeholder="Enter qty"
                            thousandSeparator=","
                            decimalScale={0}
                            min={1}
                            allowNegative={false}
                        />
                    </div>
                    <div className="col-span-12">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"merchants"}
                            options={dataSelect}
                            placeholder="Enter merchants can be apply"
                            label="Merchants can be apply"
                            mode="multiple"
                            labelRequired={false}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ModalForm;
