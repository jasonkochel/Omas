using OmasOrders.Models;

namespace OmasOrders.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<OmasOrders.Models.OmasOrdersContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(OmasOrders.Models.OmasOrdersContext context)
        {
            context.Users.AddOrUpdate(new User[]
            {
                new User()
                {
                    Id = 1,
                    FirstName = "Jason",
                    LastName = "Kochel",
                    Email = "jason@kochel.name",
                    Password = "sophiesasha",
                    PhoneNumber = "732-686-9397"
                },
                new User()
                {
                    Id = 2,
                    FirstName = "Diane",
                    LastName = "Mellon",
                    Email = "goldiggers@comcast.net",
                    Password = "goldiggers"
                }
            });
        }
    }
}
