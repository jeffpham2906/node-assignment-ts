import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const roles = await prisma.role.createMany({
        data: [
            {
                name: "President",
                permissions: [
                    {
                        key: "employees",
                        actions: [
                            {
                                method: "full",
                            },
                        ],
                    },
                    {
                        key: "customers",
                        actions: [
                            {
                                method: "full",
                            },
                        ],
                    },
                    {
                        key: "roles",
                        actions: [
                            {
                                method: "full",
                            },
                        ],
                    },
                ],
            },
            {
                name: "Manager",
                permissions: [
                    {
                        key: "employees",
                        actions: [
                            {
                                method: "read",
                            },
                            {
                                method: "update",
                            },
                            {
                                method: "create",
                            },
                        ],
                    },
                    {
                        key: "customers",
                        actions: [
                            {
                                method: "full",
                            },
                        ],
                    },
                ],
            },
            {
                name: "Leader",
                permissions: [
                    {
                        key: "employees",
                        actions: [
                            {
                                method: "read",
                            },
                        ],
                    },
                    {
                        key: "customers",
                        actions: [
                            {
                                method: "full",
                                conditions: ["sameOffice"],
                            },
                        ],
                    },
                ],
            },
            {
                name: "Staff",
                permissions: [
                    {
                        key: "customers",
                        actions: [
                            {
                                method: "read",
                                conditions: ["theirOwnCustomer"],
                            },
                            {
                                method: "create",
                                conditions: ["belongToThem"],
                            },
                        ],
                    },
                ],
            },
        ],
    });
    const employee = await prisma.employee.createMany({
        data: [
            {
                employeeNumber: 123,
                lastName: "Pham",
                firstName: "Jeff",
                extension: "",
                email: "jeffpham2906@gmail.com",
                officeCode: "103231",
                reportsTo: null,
                jobTitle: "Leader Sales",
                role: "President",
            },
            {
                employeeNumber: 124,
                lastName: "Duc",
                firstName: "Anh",
                extension: "",
                email: "ducanh@gmail.com",
                officeCode: "103239",
                reportsTo: null,
                jobTitle: "Manager Sales",
                role: "Manager",
            },
            {
                employeeNumber: 125,
                lastName: "Dung",
                firstName: "Pham",
                extension: "",
                email: "dungpham@gmail.com",
                officeCode: "103231",
                reportsTo: null,
                jobTitle: "Leader Sales",
                role: "Leader",
            },
            {
                employeeNumber: 126,
                lastName: "John",
                firstName: "Tran",
                extension: "",
                email: "johntran@gmail.com",
                officeCode: "103231",
                reportsTo: null,
                jobTitle: "Staff Sales",
                role: "Staff",
            },
        ],
    });
    const user = await prisma.user.createMany({
        data: [
            {
                username: "system_admin",
                password: "Admin@123",
                employeeNumber: 123,
            },
            {
                username: "system_manager",
                password: "Admin@123",
                employeeNumber: 124,
            },
            {
                username: "system_leader",
                password: "Admin@123",
                employeeNumber: 125,
            },
            {
                username: "system_staff",
                password: "Admin@123",
                employeeNumber: 126,
            },
        ],
    });
}
main()
    .then(() => prisma.$disconnect())
    .catch((err) => {
        prisma.$disconnect();
        process.exit(1);
    });
