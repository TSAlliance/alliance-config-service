import { HttpException } from "@nestjs/common";
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("errors")
class ApiErrorDTO {

    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ nullable: false, default: new Date() })
    public timestamp: Date;

    @Column({ nullable: true })
    public path: string;

    @Column()
    public errorId: string;

    @Column({ type: "text", nullable: false })
    public message: string;

    @Column({ type: "text"})
    public stack?: string;

    @Column()
    public statusCode?: number;

    @Column({ default: false })
    public isCritical: boolean;

    public toResponse(): Record<string, unknown> {
        return {
            statusCode: this.statusCode || 500,
            message: this.isCritical ? "An internal server error occured. Please report to administrator" : this.message,
            timestamp: this.timestamp,
            errorId: this.errorId,
            path: this.path
        }
    }

}

export class ApiError extends HttpException {

    protected errorDto: ApiErrorDTO;

    constructor(message?: string, statusCode?: number, errorId?: string, isCritical?: boolean, host?: ArgumentsHost) {    
        super(message || "Internal Server Error", statusCode || HttpStatus.INTERNAL_SERVER_ERROR);

        this.errorDto = new ApiErrorDTO();
        this.errorDto.message = message || "Internal Server Error";
        this.errorDto.errorId = errorId || "INTERNAL_ERROR";
        this.errorDto.statusCode = statusCode;
        this.errorDto.stack = this.stack;
        this.errorDto.timestamp = new Date();
        this.errorDto.path = host?.switchToHttp()?.getRequest()?.path
        this.errorDto.isCritical = isCritical;
    }

    public getResponse(): Record<string, unknown> {
        return this.errorDto.toResponse();
    }
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
            error = new ApiError(exception.message, exception.getStatus(), exception.name.toUpperCase(), false, host);
        } else {
            error = new ApiError(exception.message, HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", true, host);
            console.error(exception)
            // TODO: Save error to db
        }

        response.status(error.getStatus()).json({
            ...error.getResponse(),
            path: request.path
        });
    }

}