import { useState, FC, useEffect } from "react";
import { Modal } from "antd";
import { useForm } from "react-hook-form";
import { RHFTextAreaField } from "components/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import ModalButton from "components/ModalButton";
import Button from "components/Button";
import MerchantService from "services/MerchantService";
import Message from "components/Message";
import * as yup from "yup";

type FormInputs = {
    reason: string;
};

const schema = yup.object({
    reason: yup.string().required("This is a required field!"),
});

interface IProps {
    merchantId: number;
    onSuccess: () => void;
}

const InactiveButton: FC<IProps> = ({ merchantId, onSuccess }) => {
    const [open, setOpen] = useState<boolean>(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            reason: "",
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                reason: "",
            });
        }
    }, [open, reset]);

    const toggleOpen = () => {
        setOpen((preVal) => !preVal);
    };

    const onSubmit = async (data: FormInputs) => {
        try {
            const message = await MerchantService.inactiveSetting(data.reason, merchantId);
            Message.success({ text: message });
            reset();
            setOpen(false);
            onSuccess();
        } catch (error) {
            reset(data);
        }
    };

    const handleClose = () => {
        if (isSubmitting) return;
        setOpen(false);
    };

    return (
        <>
            <Modal
                centered={true}
                maskClosable={false}
                destroyOnClose={true}
                open={open}
                title={<p className="font-bold text-lg">Warning!</p>}
                onCancel={handleClose}
                footer={
                    <div className="flex justify-end gap-x-2">
                        <ModalButton
                            type={"button"}
                            btnType="cancel"
                            title="Cancel"
                            disabled={isSubmitting}
                            className="bg-blue-100 px-4 py-2.5 rounded-xl hover:bg-blue-500 hover:text-white mr-2 btn-cancel"
                            onClick={toggleOpen}
                        />
                        <ModalButton
                            type={"button"}
                            btnType="save"
                            title="Save"
                            disabled={isSubmitting}
                            loading={isSubmitting}
                            className="bg-blue-100 px-4 py-2.5 rounded-xl hover:bg-blue-500 hover:text-white mr-2 btn-cancel"
                            onClick={handleSubmit(onSubmit)}
                        />
                    </div>
                }
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-span-12">
                        <RHFTextAreaField<FormInputs>
                            control={control}
                            name={"reason"}
                            placeholder="Please enter reason"
                            label="Are you sure you want to Archive this Merchant?"
                        />
                    </div>
                </form>
            </Modal>
            <Button title="Inactive" btnType="cancel" onClick={toggleOpen} moreClass="mr-2 m-2" />
        </>
    );
};

export default InactiveButton;
