<html>
<body style="font-family: Arial, sans-serif; color: #333;">
    <div style="background-color: #fff0f0; padding: 20px; text-align: center; border-bottom: 3px solid #d63031;">
        <h2 style="color: #d63031;">Password Reset Request</h2>
    </div>
    <div style="padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: 20px auto;">
        <p>Hello ${user.firstName!user.username},</p>
        
        <p>We received a request to reset the password for your account.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" style="background-color: #d63031; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        
        <p>This link expires in ${linkExpiration}.</p>
        
        <p style="color: #666; font-size: 0.9em;">If you did not request a password reset, you can safely ignore this email. Your password will not change.</p>
    </div>
</body>
</html>
