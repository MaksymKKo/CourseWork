﻿using Shop.Models.Tabels;
using System.ComponentModel.DataAnnotations;

namespace Shop.Models.FormModels
{
    public class UserModel
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Role can`t be Empty")]
        public string Role { get; set; }

        [Required(ErrorMessage = "Email can`t be Empty")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password can`t be Empty")]
        [DataType(DataType.Password)]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long")]
        public string? Password { get; set; }
    }
}
