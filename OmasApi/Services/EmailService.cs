using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using Microsoft.Extensions.Options;
using OmasApi.Controllers.Middleware;
using OmasApi.Data.Repositories;

namespace OmasApi.Services
{
    public class EmailService
    {
        private readonly IAmazonSimpleEmailService _sesClient;

        private readonly OrderRepository _orderRepo;
        private readonly OrderLineRepository _lineRepo;
        private readonly UserRepository _userRepo;
        private readonly ViewRenderService _viewRenderService;
        private readonly EmailSettings _emailSettings;

        public EmailService(IAmazonSimpleEmailService sesClient, OrderRepository orderRepo, OrderLineRepository lineRepo, UserRepository userRepo, ViewRenderService viewRenderService, IOptions<AppSettings> appSettings)
        {
            _sesClient = sesClient;
            _orderRepo = orderRepo;
            _lineRepo = lineRepo;
            _userRepo = userRepo;
            _viewRenderService = viewRenderService;
            _emailSettings = appSettings.Value.EmailSettings;
        }

        public async Task EmailOrderForUser(string batchId, string userId)
        {
            var order = await _orderRepo.Get(batchId, userId, includeNavigationProperties: true, includeLineItems: true);
            var orderLines = await _lineRepo.GetByOrder(batchId, userId);

            if (orderLines != null)
            {
                order.LineItems = order.LineItems.OrderBy(l => l.Sequence).ToList();
            }

            order.User = await _userRepo.Get(userId);

            var orderHtml = await _viewRenderService.RenderViewToStringAsync("~/Views/OrderHtml.cshtml", order);
            await SendEmail(_emailSettings.MailFrom, order.User.Email, _emailSettings.Subject, orderHtml);
        }

        public async Task SendEmail(string mailFrom, string mailTo, string subject, string htmlBody, string textBody = "")
        {
            var sendRequest = new SendEmailRequest
            {
                Source = mailFrom,
                Destination = new Destination
                {
                    ToAddresses = new List<string> { mailTo }
                },
                Message = new Message
                {
                    Subject = new Content(subject),
                    Body = new Body
                    {
                        Html = new Content
                        {
                            Charset = "UTF-8",
                            Data = htmlBody
                        },
                        Text = textBody.IsNullOrEmpty() ? null : new Content
                        {
                            Charset = "UTF-8",
                            Data = textBody
                        }
                    }
                },
            };

            try
            {
                await _sesClient.SendEmailAsync(sendRequest);
            }
            catch (Exception ex)
            {
                throw new InternalException(ex.Message);
            }
        }
    }
}