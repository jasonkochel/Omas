using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;

namespace OmasApi.Controllers.Middleware
{
    public class AuthorizationFilter : IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            // Check for [AllowAnonymous]
            if (context.ActionDescriptor is ControllerActionDescriptor actionDescriptor)
            {
                var controllerAttributes = actionDescriptor.ControllerTypeInfo.GetCustomAttributes(inherit: true);
                var actionAttributes = actionDescriptor.MethodInfo.GetCustomAttributes(inherit: true);
                if (actionAttributes.Any(a => a.GetType() == typeof(AllowAnonymousAttribute)) || 
                    controllerAttributes.Any(a => a.GetType() == typeof(AllowAnonymousAttribute)))
                {
                    return;
                }
            }

            throw new UnauthorizedException("Anonymous access prohibited");

            /*
            bool auth = PerformAuthCheck();
            if (!auth)
            {
                throw new UnauthorizedException("Invalid Authorization");
            }

            ((BaseController) context.Controller).UserId = userId;
            */
        }
    }
}
