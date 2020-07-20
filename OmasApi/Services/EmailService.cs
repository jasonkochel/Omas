using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Amazon;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using OmasApi.Controllers.Middleware;

namespace OmasApi.Services
{
    public class EmailService
    {
        public async Task SendEmail(string mailFrom, string mailTo, string subject, string htmlBody, string textBody = "")
        {
            using (var client = new AmazonSimpleEmailServiceClient(RegionEndpoint.USEast1))
            {
                var sendRequest = new SendEmailRequest
                {
                    Source = mailFrom,
                    Destination = new Destination
                    {
                        ToAddresses = new List<string> {mailTo}
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
                    await client.SendEmailAsync(sendRequest);
                }
                catch (Exception ex)
                {
                    throw new InternalException(ex.Message);
                }
            }
        }
    }
}