import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    // Guest API Routes
    Route.group(() => {
        Route.post('signup', 'API/AuthController.signup')
        Route.post('resend-signup-otp', 'API/AuthController.resend_signup_otp')
        Route.post('verify-email', 'API/AuthController.verify_email')
        Route.post('login', 'API/AuthController.login')
    }).middleware('guest')

    // Auth API Routes
    Route.group(() => {
        //Route.post('login', 'API/AuthController.login')
    }).middleware('auth')

}).prefix('/api')