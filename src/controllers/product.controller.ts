import { StatusCodes } from "http-status-codes";
import { IProductService } from "../interfaces/product/IProductService";
import { logger } from "../lib/logger";
import mgLogger from "../services/logger.service";
import { APIResponse } from "../utils/api.state";
import { STATUS_MESSAGES } from "../constants";
import catchAsync from "../utils/catchAsync";

export class ProductController {
    constructor(private service: IProductService) { }

    getProducts = catchAsync(async (req, res) => {
        const data = await this.service.onGetProducts();
        logger.response(req, res, data);
        mgLogger.info((req as any).user, req, res, { ...data });
        return new APIResponse(StatusCodes.OK, STATUS_MESSAGES.SUCCESS, data).send(res);
    });
}
