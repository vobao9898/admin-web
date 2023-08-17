import { Spin, Modal } from "antd";
import { useState, useEffect } from "react";
import { useDebounce } from "usehooks-ts";
import Page from "components/Page";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import SearchInput from "components/SeachInput";
import Table from "components/Table";
import IGiftCardTemplate from "interfaces/IGiftCardTemplate";
import GiftCardService from "services/GiftCardService";
import TemplateModal from "./TemplateModal";
import Message from "components/Message";
import Columns from "./Columns";

const BREAD_CRUMBS = [
    {
        name: "Giftcard",
        path: "/gift-card/template",
    },
    {
        name: "Template",
        path: "/gift-card/template",
    },
];

const PAGE_SIZE_DEFAULT = 10;

const GiftCardTemplate = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const [data, setData] = useState<IGiftCardTemplate[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [open, setOpen] = useState<boolean>(false);
    const [giftcard, setGiftCard] = useState<IGiftCardTemplate | null>(null);
    const [isArchive, setIsArchive] = useState<boolean>(false);
    const [isRestore, setIsRestore] = useState<boolean>(false);
    const [id, setId] = useState<number | undefined>();
    const debouncedValue = useDebounce<string>(keyword, 300);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, count } = await GiftCardService.get(page, page_size, debouncedValue);
                setData(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading) fetchData();
    }, [loading, page, page_size, debouncedValue]);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    const archiveHandle = (isDisabled: number, templateId: number) => {
        if (isDisabled === 0) {
            setIsArchive(true);
        }
        if (isDisabled === 1) {
            setIsRestore(true);
        }
        setId(templateId);
    };

    const handleEdit = (item: IGiftCardTemplate) => {
        setGiftCard(item);
        setOpen(true);
    };

    const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setKeyword(value);
    };

    const handleClearKeyword = () => {
        setKeyword("");
        setPage(1);
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
    };

    const handlePageChange = (page: number) => {
        setPage(page);
        setLoading(true);
    };

    const handleClose = (isReload: boolean) => {
        setOpen(false);
        if (isReload) setLoading(true);
    };

    const handleOpen = () => {
        setOpen(true);
        setGiftCard(null);
    };

    const handleUpdate = async () => {
        try {
            if (id) {
                const type = isArchive ? "disabled" : "restore";
                const message = await GiftCardService.updateStatus(type, id);
                setLoading(true);
                setIsArchive(false);
                setIsRestore(false);
                Message.success({ text: message });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Page title="Template">
            <div>
                <Modal
                    title={isArchive ? "ARCHIVE TEMPLATE" : "Restore this Template ?"}
                    open={isArchive || isRestore}
                    onCancel={() => {
                        setIsArchive(false);
                        setIsRestore(false);
                        setId(undefined);
                    }}
                    onOk={handleUpdate}
                >
                    {isArchive ? (
                        <p>Are you sure you want to ARCHIVE this Template</p>
                    ) : (
                        <p>Are you sure you want to RESTORE this template?</p>
                    )}
                </Modal>
                <Breadcrumb title="Gift Card Template" breadcrumbs={BREAD_CRUMBS} />
                {open ? <TemplateModal onClose={handleClose} giftcard={giftcard} /> : null}
                <div className="p-4 bg-gray-50 shadow rounded-xl">
                    <Spin spinning={loading}>
                        <div className="flex justify-between mb-2.5">
                            <SearchInput
                                value={keyword}
                                placeholder="Search by name, group"
                                onChange={handleChangeKeyword}
                                onClear={handleClearKeyword}
                            />
                            <Button onClick={handleOpen} title="New Template" btnType="ok" />
                        </div>
                        <Table
                            rowKey="giftCardTemplateId"
                            data={data}
                            columns={Columns({ archiveHandle, handleEdit })}
                            count={count}
                            loading={loading}
                            page={page - 1}
                            rowPerPage={page_size}
                            onPageChange={handlePageChange}
                            onPerPageChange={handlePerPageChange}
                        />
                    </Spin>
                </div>
            </div>
        </Page>
    );
};

export default GiftCardTemplate;
