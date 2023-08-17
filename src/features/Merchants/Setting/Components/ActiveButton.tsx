import React, { useState } from "react";
import { Popover } from "antd";
import Button from "components/Button";

interface IProps {
    disabledReason?: string;
    onActive: () => void;
}

const ActiveButton: React.FC<IProps> = ({ disabledReason, onActive }) => {
    const [open, setOpen] = useState<boolean>(false);

    const toggleOpen = () => {
        setOpen((preVal) => !preVal);
    };

    const handleActive = () => {
        onActive();
    };

    return (
        <Popover
            title={"Confirmation"}
            placement="topLeft"
            content={
                <div className="max-w-[400px]">
                    <p className="w-full font-semibold mb-2">Are you sure you want to enable this Merchant?</p>
                    <p>
                        <span className="font-semibold">Why disabled: </span>
                        {disabledReason}
                    </p>
                    <div className="flex items-center justify-end mt-5 gap-x-2">
                        <Button onClick={handleActive} title="Confirm" btnType={"ok"} />
                        <Button onClick={toggleOpen} title="Cancel" btnType={"cancel"} />
                    </div>
                </div>
            }
            trigger="click"
            onOpenChange={toggleOpen}
            open={open}
        >
            <Button title="Active" btnType="ok" moreClass="mr-2 m-2" />
        </Popover>
    );
};

export default ActiveButton;
