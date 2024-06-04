package com.example.wattmok

import android.os.Bundle
import android.util.Patterns
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.wattmok.databinding.FragmentLoginBinding

class LoginFragment : Fragment() {

    private var _binding: FragmentLoginBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentLoginBinding.inflate(inflater, container, false)

        binding.signInButton.setOnClickListener {
            if (validateInputs()) {
                findNavController().navigate(R.id.action_loginFragment_to_homeScreen)
            }
        }

        return binding.root
    }

    override fun onDestroy() {
        super.onDestroy()
        _binding = null
    }

    private fun validateInputs(): Boolean {
        val email = binding.emailInputLayout.editText?.text.toString().trim()
        val password = binding.passwordInputLayout.editText?.text.toString().trim()

        if (email.isEmpty()) {
            binding.emailInputLayout.error = "Email cannot be empty"
            return false
        } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.emailInputLayout.error = "Invalid email format"
            return false
        } else {
            binding.emailInputLayout.error = null
        }

        if (password.isEmpty()) {
            binding.passwordInputLayout.error = "Password cannot be empty"
            return false
        } else if (!isPasswordStrong(password)) {
            binding.passwordInputLayout.error = "Password must be at least 8 characters long, contain a number, and a special character"
            return false
        } else {
            binding.passwordInputLayout.error = null
        }

        return true
    }

    private fun isPasswordStrong(password: String): Boolean {
        val passwordPattern = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&+=]).{8,}$"
        val passwordMatcher = Regex(passwordPattern)
        return passwordMatcher.matches(password)
    }
}
