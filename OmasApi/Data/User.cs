using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OmasApi.Data
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public bool Admin { get; set; }
        public string FName { get; set; }
        public string LName { get; set; }
        public string Phone { get; set; }
    
        public virtual ICollection<Order> Orders { get; set; }
    }
}
