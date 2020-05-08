using System;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace OmasConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            IConfiguration config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", true, true)
                .Build();

            const string token = "eyJraWQiOiJSbnlLZFM2SHFTWE4rdXk1YnVYMkhPZkF5UDQ5TnQrbnpFa2NcL0J2NGRCTT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI4ZGYxYzQzZS03NGQwLTQ1Y2ItOGNlYi1jYzE2Zjc0MGZkZDkiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbmlzdHJhdG9ycyJdLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfV3VyY2hzc29SIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY29nbml0bzp1c2VybmFtZSI6IjhkZjFjNDNlLTc0ZDAtNDVjYi04Y2ViLWNjMTZmNzQwZmRkOSIsImF1ZCI6IjIwazZnMmMzOWFuZGc4Z2lsMGUxMm1mbm4wIiwiZXZlbnRfaWQiOiJlZDVjZWM5Zi02NWY4LTRjZmQtOGI0Ny02NmNkYjI1Y2ZjZTUiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTU4ODg5OTI4MSwicGhvbmVfbnVtYmVyIjoiKzE3MzI5OTE3MjA0IiwiZXhwIjoxNTg4OTAyODgxLCJpYXQiOjE1ODg4OTkyODEsImVtYWlsIjoiamFzb24rb21hc0Brb2NoZWwubmFtZSJ9.dLtmgkcV_iDOpJKVxwMFBNLz4D_b0v-8Nw2Tj62R0FhpHtodHREX1bVehX-wq_dSzgTigO7z5wyHUfoCHH1qlzP4L0s-uoHvg3t5Ac6O1VmqKmojhxmZgCjTw0M2OxUsavDx2f5xqcoT867ag3ZqkwmpYpoOW99a0u14b2xjCN_vIZheUS-xgwdG6CPemXW1P5I4a0rgnf3_s7Gfh3W37rvWC9Fs4Cmq0ADfFoBDbFblkzmCCTCZZhH67LV2HSlRJvsSqII3ohDRE9aMlMMRWBFreLGwh8JFjBZc2xTfPg_F7biXh3nDVne7r9lnKV0eUQo_dAfWfYFBL1ugx6lIIA";

            var jwks = new JsonWebKeySet(config["Jwks"]);

            var isValid = jwks.Keys
                .Select(key => new TokenValidationParameters
                    {IssuerSigningKey = key, ValidateAudience = false, ValidateIssuer = false})
                .Any(validationParameters => ValidateToken(token, validationParameters));

            Debug.Print(isValid.ToString());
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
    }
}
