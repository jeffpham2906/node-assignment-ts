import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
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
    const officeData = [
        {
            officeCode: "FA1",
            city: "New York",
            phone: "+1 212-987-6543",
            addressLine1: "255 Bryant St",
            addressLine2: "",
            postalCode: "10012",
            country: "USA",
            state: "US",
            territory: "US",
        },
        {
            officeCode: "VN1",
            city: "Viet nam",
            phone: "0327015348",
            addressLine1: "My Dinh Ha Noi",
            addressLine2: "",
            postalCode: "10012",
            country: "VN",
            state: "VN",
            territory: "VN",
        },
    ];
    await Promise.all(
        officeData.map(async (office) =>
            prisma.office.create({
                data: {
                    ...office,
                    employees: {
                        create: {
                            lastName: "9999",
                            firstName: "Default",
                            extension: "",
                            email: "Default",
                            reportsTo: null,
                            jobTitle: "Default",
                        },
                    },
                },
            })
        )
    );
    // const offices = await prisma.office.createMany({
    //     data:
    // });
    const employee = await prisma.employee.createMany({
        data: [
            {
                lastName: "Pham",
                firstName: "Jeff",
                extension: "",
                officeCode: null,
                email: "jeffpham2906@gmail.com",
                reportsTo: null,
                jobTitle: "Leader Sales",
                role: "President",
            },
            {
                lastName: "Duc",
                firstName: "Anh",
                extension: "",
                officeCode: null,
                email: "ducanh@gmail.com",
                reportsTo: null,
                jobTitle: "Manager Sales",
                role: "Manager",
            },
            {
                lastName: "Dung",
                firstName: "Pham",
                extension: "",
                email: "dungpham@gmail.com",
                officeCode: "VN1",
                reportsTo: null,
                jobTitle: "Leader Sales",
                role: "Leader",
            },
            {
                lastName: "John",
                firstName: "Tran",
                extension: "",
                email: "johntran@gmail.com",
                officeCode: "VN1",
                reportsTo: null,
                jobTitle: "Staff Sales",
                role: "Staff",
            },
            {
                lastName: "Pham",
                firstName: "Luyen",
                extension: "",
                email: "phamluyeb@gmail.com",
                officeCode: "FA1",
                reportsTo: null,
                jobTitle: "Staff Sales",
                role: "Staff",
            },
            {
                lastName: "Dang",
                firstName: "Khoa",
                extension: "",
                email: "dangkhoa@gmail.com",
                officeCode: "FA1",
                reportsTo: null,
                jobTitle: "Leader ABC",
                role: "Leader",
            },
        ],
    });
    const defaultUsers = [
        {
            username: "system_admin",
            password: "Admin@123",
            employeeNumber: 3,
        },
        {
            username: "system_manager",
            password: "Admin@123",
            employeeNumber: 4,
        },
        {
            username: "system_leader1",
            password: "Admin@123",
            employeeNumber: 5,
        },
        {
            username: "system_staff1",
            password: "Admin@123",
            employeeNumber: 6,
        },

        {
            username: "system_staff2",
            password: "Admin@123",
            employeeNumber: 7,
        },
        {
            username: "system_leader2",
            password: "Admin@123",
            employeeNumber: 8,
        },
    ];

    const data = await Promise.all(
        defaultUsers.map(async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            return user;
        })
    );
    const user = await prisma.user.createMany({
        data,
    });
    // const customers = await prisma.customer.createMany({
    //     data: [
    //         {
    //             customerName: "Land of Toys Inc.",
    //             contactLastName: "Lee",
    //             contactFirstName: "John",
    //             phone: "555 555 5555",
    //             addressLine1: "PO Box 7895",
    //             addressLine2: "",
    //             city: "New York",
    //             state: "NY",
    //             postalCode: "10021",
    //             country: "USA",
    //             salesRepEmployeeNumber: 5,
    //             creditLimit: 100000,
    //         },
    //         {
    //             customerName: "ABCDEF",
    //             contactLastName: "Lee",
    //             contactFirstName: "John",
    //             phone: "555 555 5555",
    //             addressLine1: "PO Box 7895",
    //             addressLine2: "",
    //             city: "New York",
    //             state: "NY",
    //             postalCode: "10021",
    //             country: "USA",
    //             salesRepEmployeeNumber: 6,
    //             creditLimit: 100000,
    //         },
    //     ],
    // });
    const productLines = await prisma.productLine.createMany({
        data: [
            {
                productLine: "Classic Cars",
                textDescription: "The Classic Cars product line features vintage cars from the 1940s to the 1960s.",
                htmlDescription:
                    "<p>The Classic Cars product line features vintage cars from the 1940s to the 1960s.</p>",
                image: "classic_cars.jpg",
            },
            {
                productLine: "Motorcycles",
                textDescription:
                    "The Motorcycles product line features all sorts of motorcycles, from Harley-Davidsons to scooters.",
                htmlDescription:
                    "<p>The Motorcycles product line features all sorts of motorcycles, from Harley-Davidsons to scooters.</p>",
                image: "motorcycles.jpg",
            },
            {
                productLine: "Planes",
                textDescription:
                    "The Planes product line features model airplanes, including commercial airliners, military planes, and vintage aircraft.",
                htmlDescription:
                    "<p>The Planes product line features model airplanes, including commercial airliners, military planes, and vintage aircraft.</p>",
                image: "planes.jpg",
            },
        ],
    });

    const products = await prisma.product.createMany({
        data: [
            {
                productCode: "P000",
                productName: "Product 1",
                productLine: "Classic Cars",
                productScale: "1:10",
                productVendor: "Min Lin Diecast",
                productDescription:
                    "This replica features working kickstand, front suspension, gear-shift lever, footbrake lever, drive chain, wheels, and front wheels.",
                quantityInStock: 10,
                MSRP: 90.3,
                buyPrice: 30,
            },
            {
                productCode: "P001",
                productName: "Product 2",
                productLine: "Motorcycles",
                productScale: "1:10",
                productVendor: "Classic Metal Creations",
                productDescription:
                    "Turnable front wheels; steering function; detailed interior; detailed engine; opening hood; opening trunk; opening doors; and detailed chassis.",
                quantityInStock: 5,
                MSRP: 98.58,
                buyPrice: 19,
            },
            {
                productCode: "P002",
                productName: "Product 3",
                productLine: "Planes",
                productScale: "1:10",
                productVendor: "Highway 66 Mini Classics",
                productDescription:
                    "Officially opening for sale in North America as all-terrain wheels surround the front and rear suspension components.",
                quantityInStock: 4,
                MSRP: 68.99,
                buyPrice: 24.5,
            },
        ],
    });
    // const orders = await prisma.order.createMany({
    //     data: [
    //         {
    //             orderNumber: 1,
    //             orderDate: new Date(),
    //             requiredDate: new Date(),
    //             shippedDate: new Date(),
    //             status: "Shipped",
    //             comments: "Very good",
    //             customerNumber: 1,
    //         },
    //     ],
    // });
}
main()
    .then(() => prisma.$disconnect())
    .catch((err) => {
        console.log(err);
        prisma.$disconnect();
        process.exit(1);
    });
