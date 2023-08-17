import { RHFCheckBox, RHFSelect } from "components/Form";
import { WORKING_TIME_OPTIONS } from "contants";
import { useForm } from "react-hook-form";
import { IWorkingTimes } from "./index";
import Button from "components/Button";

interface IProps {
    workingTimes?: IWorkingTimes;
    onSubmitData: (data: IWorkingTimes) => void;
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

const WorkingTime: React.FC<IProps> = ({ workingTimes, onSubmitData }) => {
    const { control, handleSubmit } = useForm<FormInputs>({
        mode: "onBlur",
        defaultValues: {
            Monday: {
                isCheck: workingTimes ? workingTimes.Monday?.isCheck : true,
                timeStart: workingTimes?.Monday?.timeStart || "10:00 AM",
                timeEnd: workingTimes?.Monday?.timeEnd || "8:00 PM",
            },
            Tuesday: {
                isCheck: workingTimes ? workingTimes.Tuesday?.isCheck : true,
                timeStart: workingTimes?.Tuesday?.timeStart || "10:00 AM",
                timeEnd: workingTimes?.Tuesday?.timeEnd || "8:00 PM",
            },
            Wednesday: {
                isCheck: workingTimes ? workingTimes.Wednesday?.isCheck : true,
                timeStart: workingTimes?.Wednesday?.timeStart || "10:00 AM",
                timeEnd: workingTimes?.Wednesday?.timeEnd || "8:00 PM",
            },
            Thursday: {
                isCheck: workingTimes ? workingTimes.Thursday?.isCheck : true,
                timeStart: workingTimes?.Thursday?.timeStart || "10:00 AM",
                timeEnd: workingTimes?.Thursday?.timeEnd || "8:00 PM",
            },
            Friday: {
                isCheck: workingTimes ? workingTimes.Friday?.isCheck : true,
                timeStart: workingTimes?.Friday?.timeStart || "10:00 AM",
                timeEnd: workingTimes?.Friday?.timeEnd || "8:00 PM",
            },
            Saturday: {
                isCheck: workingTimes ? workingTimes.Saturday?.isCheck : true,
                timeStart: workingTimes?.Saturday?.timeStart || "10:00 AM",
                timeEnd: workingTimes?.Saturday?.timeEnd || "8:00 PM",
            },
            Sunday: {
                isCheck: workingTimes ? workingTimes.Sunday?.isCheck : true,
                timeStart: workingTimes?.Sunday?.timeStart || "10:00 AM",
                timeEnd: workingTimes?.Sunday?.timeEnd || "8:00 PM",
            },
        },
    });

    const onSubmit = (data: FormInputs) => {
        const workingTimes: IWorkingTimes = {
            Monday: {
                isCheck: data.Monday.isCheck,
                timeStart: data.Monday.timeStart,
                timeEnd: data.Monday.timeEnd,
            },
            Tuesday: {
                isCheck: data.Tuesday.isCheck,
                timeStart: data.Tuesday.timeStart,
                timeEnd: data.Tuesday.timeEnd,
            },
            Wednesday: {
                isCheck: data.Wednesday.isCheck,
                timeStart: data.Wednesday.timeStart,
                timeEnd: data.Wednesday.timeEnd,
            },
            Thursday: {
                isCheck: data.Thursday.isCheck,
                timeStart: data.Thursday.timeStart,
                timeEnd: data.Thursday.timeEnd,
            },
            Friday: {
                isCheck: data.Friday.isCheck,
                timeStart: data.Friday.timeStart,
                timeEnd: data.Friday.timeEnd,
            },
            Saturday: {
                isCheck: data.Saturday.isCheck,
                timeStart: data.Saturday.timeStart,
                timeEnd: data.Saturday.timeEnd,
            },
            Sunday: {
                isCheck: data.Sunday.isCheck,
                timeStart: data.Sunday.timeStart,
                timeEnd: data.Sunday.timeEnd,
            },
        };
        onSubmitData(workingTimes);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                <div className="col-span-4">
                    <div>
                        <div className="mb-2 text-sm">Monday</div>
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
                        <div className="mb-2 text-sm">Tuesday</div>
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
                        <div className="mb-2 text-sm">Wednesday</div>
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
                        <div className="mb-2 text-sm">Thursday</div>
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
                        <div className="mb-2 text-sm">Friday</div>
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
                        <div className="mb-2 text-sm">Saturday</div>
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
                        <div className="mb-2 text-sm">Sunday</div>
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
                <div className="col-span-12">
                    <Button type="submit" title="Next" btnType="ok" />
                </div>
            </div>
        </form>
    );
};

export default WorkingTime;
