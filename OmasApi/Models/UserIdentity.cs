namespace OmasApi.Models
{
    public class UserIdentity
    {
        public string CognitoId { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public bool Admin { get; set; }
    }
}