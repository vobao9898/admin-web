import * as yup from "yup";
import { Modal } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { RHFInputNumber, RHFSelect, RHFTextField, RHFUpload } from "components/Form";
import { API_BASE_URL } from "contants";
import MerchantService from "services/MerchantService";
import Message from "components/Message";
import RHFTextAreaField from "components/Form/RHFTextAreaField";
import IExtra from "interfaces/IExtra";
import ModalButton from "components/ModalButton";
import { useEffect } from "react";

interface IProps {
    open: boolean;
    merchantId: number;
    extra: IExtra;
    onClose: () => void;
    onSuccess: () => void;
}

type FormInputs = {
    description: string | undefined | null;
    duration: string;
    fileId: number | undefined | null;
    imageUrl: string | undefined | null;
    isDisabled: number;
    price: string;
    supplyFee: string;
    name: string;
};

const schema = yup.object({
    duration: yup.string().required("This is a required field!"),
    price: yup.string().required("This is a required field!"),
    supplyFee: yup.string().required("This is a required field!"),
    name: yup.string().required("This is a required field!"),
    isDisabled: yup.number().required("This is a required field!"),
    description: yup.string().notRequired(),
    fileId: yup.number().notRequired(),
    imageUrl: yup.string().notRequired(),
});

const ModalForm: React.FC<IProps> = ({ open, merchantId, extra, onClose, onSuccess }) => {
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { isSubmitting, isDirty },
    } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            description: extra.description,
            duration: extra.duration,
            fileId: extra.fileId,
            isDisabled: extra.isDisabled,
            name: extra.name,
            price: extra.price,
            supplyFee: extra.supplyFee,
            imageUrl: extra.imageUrl,
        },
    });

    useEffect(() => {
        reset({
            description: extra.description,
            duration: extra.duration,
            fileId: extra.fileId,
            isDisabled: extra.isDisabled,
            name: extra.name,
            price: extra.price,
            supplyFee: extra.supplyFee,
            imageUrl: extra.imageUrl,
        });
    }, [extra, reset]);

    const onSubmit = async (data: FormInputs) => {
        if (extra && merchantId) {
            const payload = {
                fileId: data.fileId,
                description: data.description,
                isDisabled: data.isDisabled,
                name: data.name,
                supplyFee: data.supplyFee,
                price: data.price,
                duration: data.duration,
                merchantId: merchantId,
            };

            try {
                const message = await MerchantService.editExtra(payload, extra.extraId);
                Message.success({ text: message });
                onSuccess();
            } catch (error) {
                reset(data);
            }
        }
    };

    return (
        <Modal
            centered={true}
            width={600}
            maskClosable={false}
            destroyOnClose={true}
            open={open}
            title={<p className="font-bold text-lg">{"Edit"}</p>}
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
            <form>
                <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                    <div className="col-span-12">
                        <RHFTextField<FormInputs>
                            control={control}
                            name={"name"}
                            placeholder="Enter extra name"
                            label="Extra Name"
                        />
                    </div>
                    <div className="col-span-12">
                        <RHFTextAreaField<FormInputs>
                            control={control}
                            name={"description"}
                            placeholder="Enter description"
                            label="Description"
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-12 lg:col-span-6">
                        <RHFInputNumber<FormInputs>
                            control={control}
                            name={"price"}
                            label="Price"
                            thousandSeparator=","
                            decimalScale={2}
                            fixedDecimalScale
                            placeholder="0.00"
                            allowNegative={false}
                        />
                    </div>
                    <div className="col-span-12 lg:col-span-6">
                        <RHFInputNumber<FormInputs>
                            control={control}
                            name={"supplyFee"}
                            label="Surcharged"
                            thousandSeparator=","
                            decimalScale={2}
                            fixedDecimalScale
                            placeholder="0.00"
                            allowNegative={false}
                        />
                    </div>
                    <div className="col-span-12 lg:col-span-6">
                        <RHFInputNumber<FormInputs>
                            control={control}
                            name={"duration"}
                            label="Duration (mins)"
                            thousandSeparator=","
                            decimalScale={0}
                            placeholder="Enter Duration"
                            allowNegative={false}
                        />
                    </div>
                    <div className="col-span-12 lg:col-span-6">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"isDisabled"}
                            options={[
                                { value: 0, label: "Active" },
                                { value: 1, label: "Inactive" },
                            ]}
                            label="Status"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                        <RHFUpload<FormInputs>
                            rules={{
                                required: "This is a required field!",
                            }}
                            control={control}
                            name={`imageUrl`}
                            accept="image/*"
                            action={`${API_BASE_URL}File`}
                            label="Image"
                            onUploaded={function (fileId: number, path: string): void {
                                setValue("fileId", fileId, { shouldValidate: true });
                                setValue("imageUrl", path, { shouldValidate: true });
                            }}
                            labelRequired={false}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ModalForm;
