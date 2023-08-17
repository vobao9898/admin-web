import { Modal } from "antd";
import { useForm } from "react-hook-form";
import { RHFCheckBox, RHFSelect } from "components/Form";
import { WORKING_TIME_OPTIONS } from "contants";
import { useEffect } from "react";
import { cleanSSN } from "utils";
import IStaff from "interfaces/IStaff";
import MerchantService from "services/MerchantService";
import Message from "components/Message";
import ModalButton from "components/ModalButton";

interface IProps {
    staff: IStaff;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface IDay {
    isCheck: boolean;
    timeStart: string;
    timeEnd: string;
}

type FormInputs = {
    Monday: IDay;
    Tuesday: IDay;
    Wednesday: IDay;
    Thursday: IDay;
    Friday: IDay;
    Saturday: IDay;
    Sunday: IDay;
};

const WorkingTimeEdit: React.FC<IProps> = ({ staff, open, onClose, onSuccess }) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isDirty },
    } = useForm<FormInputs>({
        mode: "onBlur",
        defaultValues: {
            Monday: staff.workingTimes.Monday,
            Tuesday: staff.workingTimes.Tuesday,
            Wednesday: staff.workingTimes.Wednesday,
            Thursday: staff.workingTimes.Thursday,
            Friday: staff.workingTimes.Friday,
            Saturday: staff.workingTimes.Saturday,
            Sunday: staff.workingTimes.Sunday,
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                Monday: staff.workingTimes.Monday,
                Tuesday: staff.workingTimes.Tuesday,
                Wednesday: staff.workingTimes.Wednesday,
                Thursday: staff.workingTimes.Thursday,
                Friday: staff.workingTimes.Friday,
                Saturday: staff.workingTimes.Saturday,
                Sunday: staff.workingTimes.Sunday,
            });
        }
    }, [reset, open, staff]);

    const onSubmit = async (data: FormInputs) => {
        if (staff) {
            const payload = {
                firstName: staff.firstName,
                lastName: staff.lastName,
                displayName: staff.displayName,
                address: {
                    street: staff.address,
                    city: staff.city,
                    zip: staff.zip,
                    state: staff.stateId,
                    stateId: staff.stateId,
                },
                cellphone: staff.phone,
                email: staff.email,
                pin: staff.pin,
                isActive: staff.isActive,
                roles: {
                    nameRole: staff.roleName,
                    statusRole: "",
                },
                isDisabled: staff.isDisabled,
                fileId: staff.fileId,
                driverLicense: staff.driverLicense,
                socialSecurityNumber: cleanSSN(staff.socialSecurityNumber),
                professionalLicense: staff.professionalLicense,
                workingTime: data,
                salary: {
                    commission: {
                        isCheck: staff?.salaries?.commission?.isCheck,
                        value:
                            staff?.salaries?.commission?.value && staff?.salaries?.commission?.value?.length
                                ? staff?.salaries?.commission?.value
                                : [{ from: 0, to: 0, salaryPercent: 0, commission: 0 }],
                    },
                    perHour: staff?.salaries.perHour,
                },
                productSalary: staff?.productSalaries,
                cashPercent: staff?.cashPercent,
                tipFee: staff?.tipFees,
                categories: staff?.categories,
            };
            try {
                const message = await MerchantService.editGeneralStaff(payload, staff?.staffId);
                Message.success({ text: message });
                onSuccess();
            } catch (error) {
                reset(data);
            }
        }
    };

    const afterClose = () => {
        reset();
    };

    return (
        <Modal
            centered={true}
            width={900}
            maskClosable={false}
            destroyOnClose={true}
            open={open}
            title={<p className="font-bold text-lg">Edit</p>}
            afterClose={afterClose}
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
                    <div className="col-span-4">
                        <div>
                            <div className="mb-2">Monday</div>
                            <RHFCheckBox<FormInputs> control={control} name={`Monday.isCheck`} />
                        </div>
                    </div>
                    <div className="col-span-4">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"Monday.timeStart"}
                            options={WORKING_TIME_OPTIONS}
                            placeholder="Shift Start"
                            label="Shift Start"
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-4">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"Monday.timeEnd"}
                            options={WORKING_TIME_OPTIONS}
                            placeholder="Shift End"
                            label="Shift End"
                            labelRequired={false}
                        />
                    </div>

                    <div className="col-span-4">
                        <div>
                            <div className="mb-2">Tuesday</div>
                            <RHFCheckBox<FormInputs> control={control} name={`Tuesday.isCheck`} />
                        </div>
                    </div>
                    <div className="col-span-4">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"Tuesday.timeStart"}
                            options={WORKING_TIME_OPTIONS}
                            placeholder="Shift Start"
                            label="Shift Start"
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-4">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"Tuesday.timeEnd"}
                            options={WORKING_TIME_OPTIONS}
                            placeholder="Shift End"
                            label="Shift End"
                            labelRequired={false}
                        />
                    </div>

                    <div className="col-span-4">
                        <div>
                            <div className="mb-2">Wednesday</div>
                            <RHFCheckBox<FormInputs> control={control} name={`Wednesday.isCheck`} />
                        </div>
                    </div>
                    <div className="col-span-4">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"Wednesday.timeStart"}
                            options={WORKING_TIME_OPTIONS}
                            placeholder="Shift Start"
                            label="Shift Start"
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-4">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"Wednesday.timeEnd"}
                            options={WORKING_TIME_OPTIONS}
                            placeholder="Shift End"
                            label="Shift End"
                            labelRequired={false}
                        />
                    </div>

                    <div className="col-span-4">
                        <div>
                            <div className="mb-2">Thursday</div>
                            <RHFCheckBox<FormInputs> control={control} name={`Thursday.isCheck`} />
                        </div>
                    </div>
                    <div className="col-span-4">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"Thursday.timeStart"}
                            options={WORKING_TIME_OPTIONS}
                            placeholder="Shift Start"
                            label="Shift Start"
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-4">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"Thursday.timeEnd"}
                            options={WORKING_TIME_OPTIONS}
                            placeholder="Shift End"
                            label="Shift End"
                            labelRequired={false}
                        />
                    </div>

                    <div className="col-span-4">
                        <div>
                            <div className="mb-2">Friday</div>
                            <RHFCheckBox<FormInputs> control={control} name={`Friday.isCheck`} />
                        </div>
                    </div>
                    <div className="col-span-4">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"Friday.timeStart"}
                            options={WORKING_TIME_OPTIONS}
                            placeholder="Shift Start"
                            label="Shift Start"
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-4">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"Friday.timeEnd"}
                            options={WORKING_TIME_OPTIONS}
                            placeholder="Shift End"
                            label="Shift End"
                            labelRequired={false}
                        />
                    </div>

                    <div className="col-span-4">
                        <div>
                            <div className="mb-2">Saturday</div>
                            <RHFCheckBox<FormInputs> control={control} name={`Saturday.isCheck`} />
                        </div>
                    </div>
                    <div className="col-span-4">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"Saturday.timeStart"}
                            options={WORKING_TIME_OPTIONS}
                            placeholder="Shift Start"
                            label="Shift Start"
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-4">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"Saturday.timeEnd"}
                            options={WORKING_TIME_OPTIONS}
                            placeholder="Shift End"
                            label="Shift End"
                            labelRequired={false}
                        />
                    </div>

                    <div className="col-span-4">
                        <div>
                            <div className="mb-2">Sunday</div>
                            <RHFCheckBox<FormInputs> control={control} name={`Sunday.isCheck`} />
                        </div>
                    </div>
                    <div className="col-span-4">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"Sunday.timeStart"}
                            options={WORKING_TIME_OPTIONS}
                            placeholder="Shift Start"
                            label="Shift Start"
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-4">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"Sunday.timeEnd"}
                            options={WORKING_TIME_OPTIONS}
                            placeholder="Shift End"
                            label="Shift End"
                            labelRequired={false}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default WorkingTimeEdit;
