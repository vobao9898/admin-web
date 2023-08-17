interface IUserActivity {
    userActivityId: number;
    userId: number;
    action: string;
    createDate: string;
    isDisabled: number;
}

export default IUserActivity;
