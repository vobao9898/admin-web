interface INotification {
    waNotificationId: number;
    title: string;
    content: string;
    createdDate: string;
    readBy: number;
    isDeleted: number;
    readDate: string;
    type: string;
    waUserId: number;
    senderId: number;
    receiverId: number;
    isDisabled: number;
}

export default INotification;
