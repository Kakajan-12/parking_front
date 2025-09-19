export interface DashboardAPIDatatype {
    camera: number;
    operator: number;
    totalCars: number;
    totalUsers: number;
}

interface ReportItem {
    park: string;
    money: number | string;
}

export interface DashboardAPIReportDataType {
    data: Array<ReportItem>;
}
