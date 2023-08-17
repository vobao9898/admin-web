import React, { useState } from "react";
import Button from "components/Button";
import IStaff from "interfaces/IStaff";
import { Checkbox, Select } from "antd";
import WorkingTimeEdit from "../Edit/WorkingTimeEdit";

interface IProps {
    staff: IStaff;
    closeDetail: () => void;
    handleChange: () => void;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const WorkingTime: React.FC<IProps> = ({ staff, closeDetail, handleChange }) => {
    const [openModal, setOpenModal] = useState<boolean>(false);

    const toggleModal = () => {
        setOpenModal((preVal) => !preVal);
    };

    const handleSuccess = () => {
        setOpenModal(false);
        handleChange();
    };

    return (
        <div>
            <WorkingTimeEdit open={openModal} staff={staff} onSuccess={handleSuccess} onClose={toggleModal} />
            <div className="grid grid-cols-3">
                <p className="text-blue-500 text-lg font-semibold mb-2 col-span-1">Date</p>
                <p className="text-blue-500 text-lg font-semibold mb-2 col-span-1">Shift Start</p>
                <p className="text-blue-500 text-lg font-semibold mb-2 col-span-1">Shift End</p>
            </div>
            {DAYS_OF_WEEK.map((day) => {
                let value = staff?.workingTimes.Monday;
                if (day === "Tuesday") {
                    value = staff?.workingTimes.Tuesday;
                }
                if (day === "Wednesday") {
                    value = staff?.workingTimes.Wednesday;
                }
                if (day === "Thursday") {
                    value = staff?.workingTimes.Thursday;
                }
                if (day === "Friday") {
                    value = staff?.workingTimes.Friday;
                }
                if (day === "Saturday") {
                    value = staff?.workingTimes.Saturday;
                }
                if (day === "Sunday") {
                    value = staff?.workingTimes.Sunday;
                }
                return (
                    <div className="py-5 flex items-center border-b" key={day}>
                        <Checkbox className="w-1/3" checked={value?.isCheck}>
                            {day}
                        </Checkbox>
                        <div className="w-1/3 pr-10">
                            <Select size="large" className="w-full" value={value?.timeStart} disabled />
                        </div>
                        <div className="w-1/3 pr-10">
                            <Select size="large" className="w-full" value={value?.timeEnd} disabled />
                        </div>
                    </div>
                );
            })}
            <div className="flex items-center mt-5 gap-x-2">
                <Button title="EDIT" btnType="ok" onClick={toggleModal} />
                <Button title="BACK" btnType="cancel" onClick={closeDetail} />
            </div>
        </div>
    );
};

export default WorkingTime;
