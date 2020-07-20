using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json.Converters;
using OmasApi.Controllers.Middleware;
using OmasApi.Data;
using OmasApi.Services;

//using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace OmasApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

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
            
            services.AddScoped<UserIdentity, UserIdentity>();
            services.AddScoped<OrderBatchService, OrderBatchService>();
            services.AddScoped<UserService, UserService>();
            services.AddScoped<EmailService, EmailService>();
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

            services.AddDbContextPool<OmasDbContext>(
                options => options.UseSqlServer(Configuration.GetConnectionString("Default")));

            /*
            services.AddDbContextPool<OmasDbContext>(
                options => options
                    .UseMySql(Configuration.GetConnectionString("MySql"), mySqlOptions => mySqlOptions
                        // replace with your Server Version and Type
                        .ServerVersion(new Version(5, 6), ServerType.MySql)));
                        */
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
        }
    }
}
