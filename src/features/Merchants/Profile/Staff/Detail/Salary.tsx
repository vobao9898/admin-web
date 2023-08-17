import React, { useState } from "react";
import Button from "components/Button";
import IStaff from "interfaces/IStaff";
import SalaryEdit from "../Edit/SalaryEdit";

interface IProps {
    staff: IStaff;
    closeDetail: () => void;
    handleChange: () => void;
}

const Salary: React.FC<IProps> = ({ staff, closeDetail, handleChange }) => {
    const salary = {
        id: staff?.staffId,
        salaryPerHour: staff?.salaries?.perHour?.value,
        salaryCommission: staff?.salaries?.commission?.value,
        productCommission: staff?.productSalaries?.commission?.value,
        tipPercent: staff?.tipFees?.percent?.value,
        tipFixed: staff?.tipFees?.fixedAmount?.value,
        cashPercent: staff?.cashPercent,
        isSalaryPerHour: staff?.salaries?.perHour?.isCheck,
        isSalaryCommission: staff?.salaries?.commission?.isCheck,
        isProductCommission: staff?.productSalaries?.commission?.isCheck,
        isTipPercent: staff?.tipFees?.percent?.isCheck,
        isTipFixed: staff?.tipFees?.fixedAmount?.isCheck,
    };

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
            <SalaryEdit onSuccess={handleSuccess} open={openModal} onClose={toggleModal} staff={staff} />
            <h4 className="text-xl font-semibold text-blue-500 pb-2">Salary</h4>
            {salary && salary?.isSalaryPerHour && (
                <>
                    <p className="text-sm text-black font-medium mb-1">Salary Per Hour</p>
                    <p className="w-1/3 border-b mb-5">$ {staff?.salaries?.perHour?.value}</p>
                </>
            )}

            {salary && salary?.isSalaryCommission && (
                <p className="text-sm text-black font-medium mb-1">Salary Commission</p>
            )}
            {salary &&
                salary?.salaryCommission?.map((item, index) => (
                    <div className="grid grid-cols-3 gap-5 mb-5" key={index}>
                        <div className="border-b">
                            <p>From</p>
                            <p>$ {item?.from}</p>
                        </div>
                        <div className="border-b">
                            <p>To</p>
                            <p>$ {item?.to}</p>
                        </div>
                        <div className="border-b">
                            <p>Salary percented (%)</p>
                            <p>$ {item?.commission}</p>
                        </div>
                    </div>
                ))}

            <h4 className="mt-5 text-xl font-semibold text-blue-500 pb-2">Product Salary</h4>
            <p className="w-1/3 border-b">% {staff?.productSalaries?.commission?.value}</p>

            <h4 className="mt-5 text-xl font-semibold text-blue-500 pb-2">Tip Fee</h4>
            <div className="grid grid-cols-2 gap-5">
                <div className="border-b">
                    <p>Percent</p>
                    <p>% {staff?.tipFees?.percent?.value}</p>
                </div>
                <div className="border-b">
                    <p>Amount</p>
                    <p>% {staff?.tipFees?.fixedAmount?.value}</p>
                </div>
            </div>

            <h4 className="mt-5 text-xl font-semibold text-blue-500 pb-2">Payout by Cash</h4>
            <p>Percent</p>
            <p className="w-1/3 border-b">% {staff?.cashPercent}</p>
            <div className="flex items-center mt-5 gap-x-2">
                <Button title="EDIT" btnType="ok" onClick={toggleModal} />
                <Button title="BACK" btnType="cancel" onClick={closeDetail} />
            </div>
        </div>
    );
};

export default Salary;
