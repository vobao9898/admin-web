import { Modal } from "antd";
import { notification } from "antd";

interface IProps {
    open: boolean;
    modalBooking: boolean;
    link: string;
    onClose: () => void;
    afterClose: () => void;
}

const ModalLink: React.FC<IProps> = ({ open, modalBooking, link, onClose, afterClose }) => {
    const [api, contextHolder] = notification.useNotification();

    const handleCopy = () => {
        if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText(link);
            api.success({
                message: "Copied!",
                duration: 2,
            });
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                centered={true}
                maskClosable={false}
                destroyOnClose={true}
                open={open}
                width={1200}
                title={<p className="font-bold text-lg">{modalBooking ? "Online Booking Link" : "Portal Link"}</p>}
                onCancel={onClose}
                afterClose={afterClose}
                footer={
                    <div className="flex justify-end">
                        <button
                            className="bg-blue-100 px-4 py-2.5 rounded-xl hover:bg-blue-500 hover:text-white mr-2 btn-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCopy}
                            className="px-4 py-2.5 rounded-xl inline-flex items-center btn-save text-white bg-blue-500 hover:bg-blue-400"
                        >
                            Copy
                        </button>
                    </div>
                }
            >
                <p className="text-blue-500 underline cursor-pointer" onClick={() => window.open(link)}>
                    {link}
                </p>
            </Modal>
        </>
    );
};

export default ModalLink;
