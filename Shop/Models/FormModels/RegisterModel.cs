using System.ComponentModel.DataAnnotations;

namespace Shop.Models.FormModels
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "Email can`t be empty")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password can`t be empty")]
        [DataType(DataType.Password)]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long")]
        public string? Password { get; set; }

        [Required(ErrorMessage = "Confirm Password can`t be Empty")]
        [DataType(DataType.Password)]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long")]
        [Compare("Password", ErrorMessage = "Passwords can`t be not same")]
        public string? ConfirmPassword { get; set; }
    }
}
