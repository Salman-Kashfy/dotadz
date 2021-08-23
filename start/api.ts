import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    // Guest API Routes
    Route.group(() => {

        // Login | Register | Verify email
        Route.post('signup', 'API/AuthController.signup')
        Route.post('resend-signup-otp', 'API/AuthController.resend_signup_otp')
        Route.post('verify-email', 'API/AuthController.verify_email')
        Route.post('login', 'API/AuthController.login')

        // Reset Password
        Route.post('send-reset-password-otp', 'API/AuthController.send_reset_password_otp')
        Route.post('reset-password', 'API/AuthController.reset_password')

    }).middleware('guest')

    Route.post('/logout', async ({ auth }) => {
        await auth.use('api').revoke()
        return {
            revoked: true
        }
    })

    // Auth API Routes
    Route.group(() => {



        Route.get('test', 'API/AuthController.test')
    }).middleware('auth')


}).prefix('/api')