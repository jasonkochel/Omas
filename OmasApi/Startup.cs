using System;
using Amazon.DynamoDBv2;
using Amazon.SimpleEmail;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json.Converters;
using OmasApi.Controllers.Middleware;
using OmasApi.Data;
using OmasApi.Data.Repositories;
using OmasApi.Services;

namespace OmasApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public static IConfiguration Configuration { get; private set; }

        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddMvc(options =>
                {
                    options.Filters.Add(typeof(AuthorizationFilter));
                    options.Filters.Add(typeof(ExceptionHandlerFilter));
                })
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.Converters.Add(new StringEnumConverter());
                    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                });

            services.Configure<AppSettings>(Configuration);

            services.AddDefaultAWSOptions(Configuration.GetAWSOptions());
            services.AddAWSService<IAmazonSimpleEmailService>();
            AddDynamoDb(services);

            services.AddSingleton<Migration, Migration>();

            services.AddScoped<UserIdentity, UserIdentity>();
            services.AddScoped<OrderBatchService, OrderBatchService>();
            services.AddScoped<UserService, UserService>();
            services.AddScoped<EmailService, EmailService>();

            services.AddScoped<CategoryRepository, CategoryRepository>();
            services.AddScoped<CatalogItemRepository, CatalogItemRepository>();
            services.AddScoped<UserRepository, UserRepository>();
            services.AddScoped<OrderRepository, OrderRepository>();
            services.AddScoped<OrderLineRepository, OrderLineRepository>();
            services.AddScoped<OrderBatchRepository, OrderBatchRepository>();

            services.AddTransient<ViewRenderService, ViewRenderService>();

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    builder =>
                    {
                        builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                    });
            });

            services.AddControllersWithViews();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            var migrator = app.ApplicationServices.GetService<Migration>();
            if (!migrator.Migrate().Result)
            {
                throw new Exception("Migration failed. See log for details.");
            }
        }

        private static void AddDynamoDb(IServiceCollection services)
        {
            var dynamoDbConfig = Configuration.GetSection("DynamoDb");
            var runLocalDynamoDb = dynamoDbConfig.GetValue<bool>("LocalMode");

            if (runLocalDynamoDb)
            {
                services.AddSingleton<IAmazonDynamoDB>(sp =>
                {
                    var clientConfig = new AmazonDynamoDBConfig
                    {
                        ServiceURL = dynamoDbConfig.GetValue<string>("LocalServiceUrl")
                    };

                    return new AmazonDynamoDBClient(clientConfig);
                });
            }
            else
            {
                services.AddAWSService<IAmazonDynamoDB>();
            }
        }

    }
}
