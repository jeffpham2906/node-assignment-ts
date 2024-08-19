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
                employeeNumber: 1,
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
                employeeNumber: 2,
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
                employeeNumber: 3,
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
                employeeNumber: 4,
                lastName: "John",
                firstName: "Tran",
                extension: "",
                email: "johntran@gmail.com",
                officeCode: "103231",
                reportsTo: null,
                jobTitle: "Staff Sales",
                role: "Staff",
            },
            {
                employeeNumber: 5,
                lastName: "Pham",
                firstName: "Luyen",
                extension: "",
                email: "phamluyeb@gmail.com",
                officeCode: "103231",
                reportsTo: null,
                jobTitle: "Staff Sales",
                role: "Staff",
            },
            {
                employeeNumber: 6,
                lastName: "Dang",
                firstName: "Khoa",
                extension: "",
                email: "dangkhoa@gmail.com",
                officeCode: "103231",
                reportsTo: null,
                jobTitle: "Leader ABC",
                role: "Leader",
            },
        ],
    });
    const user = await prisma.user.createMany({
        data: [
            {
                username: "system_admin",
                password: "Admin@123",
                employeeNumber: 1,
            },
            {
                username: "system_manager",
                password: "Admin@123",
                employeeNumber: 2,
            },
            {
                username: "system_leader1",
                password: "Admin@123",
                employeeNumber: 3,
            },
            {
                username: "system_staff1",
                password: "Admin@123",
                employeeNumber: 4,
            },

            {
                username: "system_staff2",
                password: "Admin@123",
                employeeNumber: 5,
            },
            {
                username: "system_leader2",
                password: "Admin@123",
                employeeNumber: 6,
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
