export * from "./employee/IEmployeeRepository";
export * from "./employee/IEmployeeService";
export * from "./customer/ICustomerRepository";
export * from "./customer/ICustomerService";
export * from "./user/IUserRepository";
export * from "./user/IUserService";

export interface QueryParams {
    page?: number;
    limit?: number;
    sort?: Record<string, "asc" | "desc">;
    filter?: Record<string, string>;
}

export interface GetResponseData {
    total?: number;
    totalPage?: number;
}

