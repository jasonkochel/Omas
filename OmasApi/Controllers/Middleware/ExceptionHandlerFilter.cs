using System;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;

namespace OmasApi.Controllers.Middleware
{
    public class ExceptionHandlerFilter : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            context.Result = new ContentResult
            {
                Content = JsonConvert.SerializeObject(new { context.Exception.Message }),
                ContentType = "application/json; charset=UTF-8",
                StatusCode = context.Exception is ApiException e
                    ? (int)e.StatusCode
                    : (int)HttpStatusCode.InternalServerError
            };
        }
    }

    public class ApiException : Exception
    {
        public ApiException(string message) : base(message) { }

        public HttpStatusCode StatusCode { get; set; }
    }

    public class UnauthorizedException : ApiException
    {
        public UnauthorizedException(string message) : base(message)
        {
            StatusCode = HttpStatusCode.Unauthorized;
        }
    }

    public class BadRequestException : ApiException
    {
        public BadRequestException(string message) : base(message)
        {
            StatusCode = HttpStatusCode.BadRequest;
        }
    }

    public class NotFoundException : ApiException
    {
        public NotFoundException(string message) : base(message)
        {
            StatusCode = HttpStatusCode.NotFound;
        }
    }

    public class ReferentialIntegrityException : ApiException
    {
        public ReferentialIntegrityException(string message) : base(message)
        {
            StatusCode = HttpStatusCode.BadRequest;
        }
    }

}
