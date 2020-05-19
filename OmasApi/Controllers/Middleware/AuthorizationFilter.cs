using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using OmasApi.Data;

namespace OmasApi.Controllers.Middleware
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AdminOnlyAttribute : Attribute { }

    public class AuthorizationFilter : IActionFilter
    {
        private readonly JsonWebKeySet _jwks;

        public AuthorizationFilter(IOptions<AppSettings> appSettings)
        {
            _jwks = new JsonWebKeySet(appSettings.Value.Jwks);
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var jwt = GetJwt(context);
            var token = ValidateJwt(jwt);

            var userIdentity = (UserIdentity)context.HttpContext.RequestServices.GetService(typeof(UserIdentity));
            userIdentity.CognitoId = Guid.Parse(token.Payload.Sub);
            userIdentity.Email = token.Claims.SingleOrDefault(c => c.Type == "email")?.Value;
            userIdentity.Name = token.Claims.SingleOrDefault(c => c.Type == "name")?.Value ?? "";
            userIdentity.Phone = token.Claims.SingleOrDefault(c => c.Type == "phone_number")?.Value ?? "";
            userIdentity.Admin = token.Claims.Any(c => c.Type == "cognito:groups" && c.Value == "administrators");

            if (RequiresAdmin(context) && !userIdentity.Admin)
            {
                throw new UnauthorizedException("This method requires administrator access");
            }
        }

        private static string GetJwt(ActionContext context)
        {
            var authHeader = context.HttpContext.Request.Headers["Authorization"].ToString();
            if (!authHeader.StartsWith("Bearer"))
            {
                throw new UnauthorizedException("Invalid Authorization Header");
            }

            var jwt = authHeader.Substring(7);
            return jwt;
        }

        private JwtSecurityToken ValidateJwt(string jwt)
        {
            var isValid = _jwks.Keys
                .Select(key => new TokenValidationParameters
                    {IssuerSigningKey = key, ValidateAudience = false, ValidateIssuer = false})
                .Any(validationParameters => ValidateToken(jwt, validationParameters));

            if (!isValid)
            {
                throw new UnauthorizedException("Invalid JWT");
            }

            return new JwtSecurityToken(jwt);
        }

        private static bool ValidateToken(string token, TokenValidationParameters validationParameters)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
                return validatedToken != null;
            }
            catch (Exception)
            {
                return false;
            }
        }

        private static bool RequiresAdmin(ActionContext context)
        {
            if (context.ActionDescriptor is ControllerActionDescriptor actionDescriptor)
            {
                var controllerAttributes = actionDescriptor.ControllerTypeInfo.GetCustomAttributes(inherit: true);
                var actionAttributes = actionDescriptor.MethodInfo.GetCustomAttributes(inherit: true);

                if (actionAttributes.Any(a => a.GetType() == typeof(AdminOnlyAttribute)) ||
                    controllerAttributes.Any(a => a.GetType() == typeof(AdminOnlyAttribute)))
                {
                    return true;
                }
            }

            return false;
        }
    }
}
