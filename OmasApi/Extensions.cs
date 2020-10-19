namespace OmasApi
{
    public static class Extensions
    {
        public static bool IsNullOrEmpty(this string s)
        {
            return string.IsNullOrEmpty(s);
        }

        public static string NullIfEmpty(this string s)
        {
            return s.IsNullOrEmpty() ? null : s;
        }
    }
}
