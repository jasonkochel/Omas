﻿using System;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using Amazon.Lambda.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using OmasApi.Models;

namespace OmasApi.Controllers.Middleware
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AdminOnlyAttribute : Attribute { }

    public class AuthorizationFilter : IAuthorizationFilter
    {
        private readonly JsonWebKeySet _jwks;

        public AuthorizationFilter(IOptions<AppSettings> appSettings)
        {
            _jwks = new JsonWebKeySet(JsonConvert.SerializeObject(appSettings.Value.Jwks));
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var requestContext = (RequestContext)context.HttpContext.RequestServices.GetService(typeof(RequestContext));

            var referrer = context.HttpContext.Request.Headers["Referer"].FirstOrDefault() ?? "";
            var referrerUrl = new UriBuilder(referrer);

            requestContext.HostHeader = referrerUrl.Host;

            LambdaLogger.Log($"Host Header: {requestContext.HostHeader}; Path: {context.HttpContext.Request.Path.Value}");

            var accessLevel = GetControllerAccessLevel(context);

            if (accessLevel == AccessLevel.Anonymous) return;

            var jwt = GetJwt(context);
            var token = ValidateJwt(jwt);

            var userIdentity = (UserIdentity)context.HttpContext.RequestServices.GetService(typeof(UserIdentity));
            userIdentity.CognitoId = token.Payload.Sub;
            userIdentity.Email = token.Claims.SingleOrDefault(c => c.Type == "email")?.Value;
            userIdentity.Name = token.Claims.SingleOrDefault(c => c.Type == "name")?.Value ?? "";
            userIdentity.Phone = token.Claims.SingleOrDefault(c => c.Type == "phone_number")?.Value ?? "";
            userIdentity.Admin = token.Claims.Any(c => c.Type == "cognito:groups" && c.Value == "administrators");

            if (accessLevel == AccessLevel.Admin && !userIdentity.Admin)
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

            var jwt = authHeader[7..];
            return jwt;
        }

        private JwtSecurityToken ValidateJwt(string jwt)
        {
            var isValid = _jwks.Keys
                .Select(key => new TokenValidationParameters
                { IssuerSigningKey = key, ValidateAudience = false, ValidateIssuer = false })
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

        private static AccessLevel GetControllerAccessLevel(ActionContext context)
        {
            if (context.ActionDescriptor is ControllerActionDescriptor actionDescriptor)
            {
                var controllerAttributes = actionDescriptor.ControllerTypeInfo.GetCustomAttributes(inherit: true);
                var methodAttributes = actionDescriptor.MethodInfo.GetCustomAttributes(inherit: true);

                if (methodAttributes.Any(a => a.GetType() == typeof(AdminOnlyAttribute)) ||
                    controllerAttributes.Any(a => a.GetType() == typeof(AdminOnlyAttribute)))
                {
                    return AccessLevel.Admin;
                }

                if (methodAttributes.Any(a => a.GetType() == typeof(AllowAnonymousAttribute)) ||
                    controllerAttributes.Any(a => a.GetType() == typeof(AllowAnonymousAttribute)))
                {
                    return AccessLevel.Anonymous;
                }

            }

            return AccessLevel.User;
        }

        private enum AccessLevel
        {
            Anonymous,
            User,
            Admin
        }

    }
}
