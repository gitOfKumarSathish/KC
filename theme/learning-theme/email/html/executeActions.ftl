<html>
<body style="font-family: Arial, sans-serif; color: #333;">
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
        <h2 style="color: #0984e3;">Welcome to Learning App!</h2>
    </div>
    <div style="padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: 20px auto;">
        <p>Hello ${user.firstName!user.username},</p>
        
        <p>Your account has been created successfully. To get started, please set your password by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" style="background-color: #0984e3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Set My Password</a>
        </div>
        
        <p>This link will expire in <span style="font-weight: bold;">${linkExpiration}</span>.</p>
        
        <p>If you did not request this account, please ignore this email.</p>
    </div>
    <div style="text-align: center; font-size: 12px; color: #999;">
        <p>&copy; 2026 Learning App Inc.</p>
    </div>
</body>
</html>
