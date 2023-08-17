import { Popconfirm, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import ArchiveIcon from "assets/svg/archive.js";
import EditIcon from "assets/svg/edit.js";
import RemoveIcon from "assets/svg/remove.js";
import RestoreIcon from "assets/svg/restore";
import ICategory from "interfaces/ICategory";
import IMerchant from "interfaces/IMerchant";

interface IProps {
    merchant: IMerchant;
    handleRestore: (id: number) => void;
    handleArchive: (id: number) => void;
    handleDelete: (id: number) => void;
    handleEdit: (data: ICategory) => void;
}

const Columns = ({ handleArchive, handleEdit, handleRestore, handleDelete, merchant }: IProps) => {
    const columns: ColumnsType<ICategory> =
        merchant.type === "SalonPos"
            ? [
                  {
                      title: "Category Name",
                      dataIndex: "name",
                      sorter: true,
                  },
                  {
                      title: "Type",
                      dataIndex: "categoryType",
                      sorter: true,
                      render: (text, data) => {
                          let statusName;
                          switch (data?.categoryType) {
                              case "Service":
                                  statusName = "SERVICE";
                                  break;

                              case "Product":
                                  statusName = "PRODUCT";
                                  break;

                              default:
                                  statusName = "";
                                  break;
                          }
                          return statusName;
                      },
                  },
                  {
                      title: "Status",
                      dataIndex: "isDisabled",
                      sorter: true,
                      render: (text, data) => (data?.isDisabled ? "Inactive" : "Active"),
                  },
                  {
                      title: "Action",
                      dataIndex: "",
                      width: 150,
                      render: (text, data) => (
                          <>
                              <Tooltip title={data?.isDisabled ? "Restore" : "Archive"}>
                                  <Popconfirm
                                      placement="left"
                                      title={
                                          <div>
                                              <strong>
                                                  {data?.isDisabled
                                                      ? "Restore this category?"
                                                      : "Archive this category?"}
                                              </strong>
                                              <div>
                                                  {data?.isDisabled
                                                      ? "This category will appear on the app as well as the related lists."
                                                      : "This category will not appear on the app. You can restore this category by clicking the Restore button."}
                                              </div>
                                          </div>
                                      }
                                      icon={
                                          <i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />
                                      }
                                      onConfirm={() => {
                                          if (data?.isDisabled) {
                                              handleRestore(data?.categoryId);
                                          } else {
                                              handleArchive(data?.categoryId);
                                          }
                                      }}
                                      okText={"Ok"}
                                      cancelText={"Cancel"}
                                  >
                                      <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                                          {data.isDisabled ? <RestoreIcon /> : <ArchiveIcon />}
                                      </button>
                                  </Popconfirm>
                              </Tooltip>
                              <Tooltip title={"Edit"}>
                                  <button
                                      className="embed border border-gray-300 text-xs rounded-lg mr-2"
                                      onClick={() => {
                                          handleEdit(data);
                                      }}
                                  >
                                      <EditIcon />
                                  </button>
                              </Tooltip>
                              <Tooltip title={"Delete"}>
                                  <Popconfirm
                                      placement="left"
                                      title={"Are you sure want delete ?"}
                                      icon={
                                          <i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />
                                      }
                                      onConfirm={() => handleDelete(data?.categoryId)}
                                      okText={"Ok"}
                                      cancelText={"Cancel"}
                                  >
                                      <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                                          <RemoveIcon />
                                      </button>
                                  </Popconfirm>
                              </Tooltip>
                          </>
                      ),
                  },
              ]
            : [
                  {
                      title: "Category Name",
                      dataIndex: "name",
                      sorter: true,
                  },
                  {
                      title: "Parent Name",
                      dataIndex: "parentName",
                      sorter: true,
                  },
                  {
                      title: "Type",
                      dataIndex: "categoryType",
                      sorter: true,
                      render: (text, data) => {
                          let statusName;
                          switch (data?.categoryType) {
                              case "Service":
                                  statusName = "SERVICE";
                                  break;

                              case "Product":
                                  statusName = "PRODUCT";
                                  break;

                              default:
                                  statusName = "";
                                  break;
                          }
                          return statusName;
                      },
                  },
                  {
                      title: "Status",
                      dataIndex: "isDisabled",
                      sorter: true,
                      render: (text, data) => (data?.isDisabled ? "Inactive" : "Active"),
                  },
                  {
                      title: "Action",
                      dataIndex: "",
                      width: 150,
                      render: (text, data) => (
                          <>
                              <Tooltip title={data?.isDisabled ? "Restore" : "Archive"}>
                                  <Popconfirm
                                      placement="left"
                                      title={
                                          <div>
                                              <strong>
                                                  {data?.isDisabled
                                                      ? "Restore this category?"
                                                      : "Archive this category?"}
                                              </strong>
                                              <div>
                                                  {data?.isDisabled
                                                      ? "This category will appear on the app as well as the related lists."
                                                      : "This category will not appear on the app. You can restore this category by clicking the Restore button."}
                                              </div>
                                          </div>
                                      }
                                      icon={
                                          <i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />
                                      }
                                      onConfirm={() => {
                                          if (data?.isDisabled) {
                                              handleRestore(data?.categoryId);
                                          } else {
                                              handleArchive(data?.categoryId);
                                          }
                                      }}
                                      okText={"Ok"}
                                      cancelText={"Cancel"}
                                  >
                                      <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                                          {data.isDisabled ? <RestoreIcon /> : <ArchiveIcon />}
                                      </button>
                                  </Popconfirm>
                              </Tooltip>
                              <Tooltip title={"Edit"}>
                                  <button
                                      className="embed border border-gray-300 text-xs rounded-lg mr-2"
                                      onClick={() => {
                                          handleEdit(data);
                                      }}
                                  >
                                      <EditIcon />
                                  </button>
                              </Tooltip>
                              <Tooltip title={"Delete"}>
                                  <Popconfirm
                                      placement="left"
                                      title={"Are you sure want delete ?"}
                                      icon={
                                          <i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />
                                      }
                                      onConfirm={() => handleDelete(data?.categoryId)}
                                      okText={"Ok"}
                                      cancelText={"Cancel"}
                                  >
                                      <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                                          <RemoveIcon />
                                      </button>
                                  </Popconfirm>
                              </Tooltip>
                          </>
                      ),
                  },
              ];

    return columns;
};

export default Columns;
