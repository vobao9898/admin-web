import { Modal } from "antd";
import { notification } from "antd";
import ICallerLink from "interfaces/ICallerLink";

interface IProps {
    modalCall: boolean;
    isLoading: boolean;
    linkCall: ICallerLink;
    onCloseCall: () => void;
    afterCloseCall: () => void;
}

const ModalLinkTow: React.FC<IProps> = ({ modalCall, isLoading, linkCall, onCloseCall, afterCloseCall }) => {
    const [api, contextHolder] = notification.useNotification();

    const handleCopyLink = (link: string) => {
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
                open={modalCall}
                width={1200}
                title={<p className="font-bold text-lg">Generate Caller ID</p>}
                onCancel={onCloseCall}
                afterClose={afterCloseCall}
                footer={null}
            >
                {linkCall && (
                    <p className="py-5 text-[15px]">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center">
                                <div className="text-sm font-[500] mr-1 min-w-[140px]">Established Call URL: </div>
                                <div className="cursor-pointer text-blue-500 underline mr-2">
                                    {linkCall?.establishedCall}
                                </div>
                            </div>
                            <button
                                onClick={() => handleCopyLink(linkCall?.establishedCall)}
                                type={"button"}
                                className="px-4 py-2.5 rounded-xl inline-flex items-center btn-save text-white bg-blue-500 hover:bg-blue-400"
                            >
                                {isLoading && <i className="las la-spinner mr-1 animate-spin" />}
                                Copy
                            </button>
                        </div>
                        <div className="flex items-center justify-center mt-5">
                            <div className="flex items-center">
                                <div className="text-sm font-[500] mr-1 min-w-[140px]">Terminated Call URL: </div>
                                <div className="cursor-pointer text-blue-500 underline mr-2">
                                    {linkCall?.terminatedCall}
                                </div>
                            </div>
                            <button
                                onClick={() => handleCopyLink(linkCall?.terminatedCall)}
                                type={"button"}
                                className="px-4 py-2.5 rounded-xl inline-flex items-center btn-save text-white bg-blue-500 hover:bg-blue-400"
                            >
                                {isLoading && <i className="las la-spinner mr-1 animate-spin" />}
                                Copy
                            </button>
                        </div>
                    </p>
                )}
            </Modal>
        </>
    );
};

export default ModalLinkTow;
