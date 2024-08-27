import catchAsync from "../utils/catchAsync";

import { StatusCodes } from "http-status-codes";
import { IProductService } from "../interfaces/product/IProductService";
import { APIResponse } from "../utils/api.state";
import { STATUS_MESSAGES } from "../constants";
import { QueryParams } from "../interfaces";
import { buildQueryParams } from "../utils";

export class ProductController {
    constructor(private service: IProductService) {
    }

    getProducts = catchAsync(async (req, res) => {
        const { page, limit, sort, filter } = req.query as QueryParams;
        const data = await this.service.onGetProducts(buildQueryParams({ ...req.query }));
        const total = data.length;

        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, {
            items: data,
            total,
            page, limit, sort, filter
        }).send(res);
    });
}
