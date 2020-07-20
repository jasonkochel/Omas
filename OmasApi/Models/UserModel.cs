namespace OmasApi.Models
{
    public class UserModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string ImpersonatingName { get; set; }
        public string ImpersonatingEmail { get; set; }
        public bool IsAdmin { get; set; }
    }
}