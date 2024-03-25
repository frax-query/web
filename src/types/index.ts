export interface IOrderListItem {
    label: string;
    value: string;
}

export interface IPropsComboBoxOrder {
    orderList: IOrderListItem[];
    defaultValue: string;
}
