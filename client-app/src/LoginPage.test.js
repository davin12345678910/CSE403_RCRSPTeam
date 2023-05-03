import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
    it('renders login form with email and password inputs and a submit button', () => {
        render(<LoginPage />);

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByText('Login');

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    it('validates and submits the form with correct email and password', () => {
        const handleSubmit = jest.fn();
        render(<LoginPage onSubmit={handleSubmit} />);

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByText('Login');

        // Enter valid email and password
        userEvent.type(emailInput, 'john.doe@uw.edu');
        userEvent.type(passwordInput, 'securepassword');

        // Click the submit button
        fireEvent.click(submitButton);

        // Check if the form has been submitted with correct email and password
        expect(handleSubmit).toHaveBeenCalledWith({
            email: 'john.doe@uw.edu',
            password: 'securepassword',
        });
    });
});
