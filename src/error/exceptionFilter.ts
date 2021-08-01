import { HttpException } from "@nestjs/common";
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";

export class ApiError extends HttpException {

    private errorId?: string;
    private timestamp: string;

    constructor(message?: string, statusCode?: number, errorId?: string) {
        super(message || "Internal Server Error", statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
        this.timestamp = new Date().toISOString();
        this.errorId = errorId;
    }

    public getResponse(): Record<string, unknown> {
        return {
            statusCode: this.getStatus(),
            message: this.message,
            timestamp: this.timestamp,
            errorId: this.errorId
        }
    }
}

export class ApiErrorImpl extends ApiError {

}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {

    public catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let error: ApiError;

        if(exception instanceof ApiError) {
            error = exception;
        } else if(exception instanceof HttpException) {
            error = new ApiError(exception.message, exception.getStatus());
        } else {
            error = new ApiError(exception.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        response.status(error.getStatus()).json({
            ...error.getResponse(),
            path: request.path
        });
    }

}