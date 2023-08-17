import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import HelperText from "components/HelperText/HelperText";
import Label from "components/Label/Label";
import ModalButton from "components/ModalButton";
import TextArea from "components/TextArea";
import IMerchant from "interfaces/IMerchant";
import RequestManagementService from "services/RequestManagementService";
import * as yup from "yup";

interface IProps {
    isReject: boolean;
    merchantId: string;
    pending: IMerchant;
    handleClose: () => void;
}

type FormInputs = {
    reasons: string;
};

const schema = yup.object({
    reasons: yup.string().required("This is a required field!"),
});

const Reject: React.FC<IProps> = ({ isReject, merchantId, handleClose }) => {
    const navigate = useNavigate();
    const {
        control,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            reasons: "",
        },
    });

    const onSubmit = async (data: FormInputs) => {
        if (merchantId) {
            try {
                await RequestManagementService.rejectPending(data.reasons, parseInt(merchantId));
                navigate("/request/pending-request");
            } catch (error) {
                reset(data);
            }
        }
    };

    const onClose = () => {
        if (!isSubmitting) {
            handleClose();
        }
    };

    return (
        <Modal
            centered={true}
            maskClosable={false}
            destroyOnClose={true}
            open={isReject}
            title={<p className="font-bold text-lg">Confirmation</p>}
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
                        disabled={isSubmitting}
                        title="Save"
                        type={"button"}
                        btnType="save"
                        onClick={handleSubmit(onSubmit)}
                    />
                </div>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 space-y-4">
                    <div className="col-span-12">
                        <Label title="REASONS FOR REJECTION" htmlFor="reasons" required />
                        <Controller
                            name="reasons"
                            control={control}
                            render={({ field: { onChange, onBlur, value, name } }) => (
                                <TextArea
                                    name={name}
                                    id="reasonss"
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    placeholder="Enter reasons for rejection"
                                    rows={4}
                                />
                            )}
                        />
                        <HelperText message={errors.reasons?.message || ""} />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default Reject;
