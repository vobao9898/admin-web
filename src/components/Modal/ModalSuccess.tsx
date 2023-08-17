import React from "react";
import { Modal } from "antd";
import Check from "assets/images/check.png";
import close_black from "assets/images/close_black.png";

interface IProps {
    isExport: boolean;
    onClose: () => void;
    linkExport: string;
    isError?: boolean;
}

const ModalSuccess: React.FC<IProps> = ({ isExport, onClose, linkExport, isError }) => {
    return (
        <Modal
            open={isExport}
            onCancel={() => onClose()}
            footer={null}
            width={700}
            title={<div className="text-5 text-black-primary font-semibold">Click below link to download</div>}
        >
            <div className="flex justify-center flex-wrap">
                <img src={!isError ? Check : close_black} alt="img" />
                {linkExport && linkExport !== "" && (
                    <a href={linkExport} className="w-full text-center text-[red] mt-2">
                        Download link
                    </a>
                )}
            </div>
        </Modal>
    );
};

export default ModalSuccess;
