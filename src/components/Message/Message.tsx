import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MessageSwal = withReactContent(Swal);

export default class Message {
    static success({
        text = "",
        title = "Success",
        cancelButtonText = "Close",
        showCloseButton = false,
        showCancelButton = true,
        showConfirmButton = false,
        padding = 0,
        timer = 3000,
    }) {
        MessageSwal.fire({
            icon: "success",
            timer,
            title,
            text,
            cancelButtonText,
            showCloseButton,
            showCancelButton,
            showConfirmButton,
            padding,
        });
    }

    static warning({
        text = "",
        title = "Warning",
        cancelButtonText = "Close",
        confirmButtonText = "Ok",
        showCloseButton = true,
        showCancelButton = true,
        showConfirmButton = true,
        padding = 0,
    }) {
        MessageSwal.fire({
            icon: "warning",
            title,
            text,
            cancelButtonText,
            confirmButtonText,
            showCloseButton,
            showCancelButton,
            showConfirmButton,
            padding,
        });
    }

    static error({
        text = "",
        title = "Fail",
        cancelButtonText = "Close",
        showCloseButton = true,
        showCancelButton = true,
        showConfirmButton = false,
        padding = 0,
    }) {
        MessageSwal.fire({
            icon: "error",
            title,
            text,
            cancelButtonText,
            showCloseButton,
            showCancelButton,
            showConfirmButton,
            padding,
            focusCancel: showCancelButton,
        });
    }

    static confirm({
        text = "",
        title = "confirm",
        cancelButtonText = "Close",
        confirmButtonText = "Ok",
        onConfirm = () => null,
        onDenied = () => null,
        confirmButtonColor = "#3b82f6",
        cancelButtonColor = "#ef4444",
        showCloseButton = true,
        showCancelButton = true,
        showConfirmButton = true,
        padding = 0,
    }) {
        MessageSwal.fire({
            icon: "warning",
            text,
            title,
            cancelButtonText,
            confirmButtonText,
            confirmButtonColor,
            cancelButtonColor,
            showCancelButton,
            showConfirmButton,
            showCloseButton,
            padding,
        }).then((result) => {
            if (result.isConfirmed) {
                onConfirm();
            } else if (result.isDismissed) {
                onDenied();
            }
        });
    }
}
