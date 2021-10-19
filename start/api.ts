import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    /*
    |--------------------------------------------------------------------------
    | Guest API Routes
    |--------------------------------------------------------------------------
    */
    Route.group(() => {

        // Login | Register | Verify email
        Route.post('signup', 'API/AuthController.signup')
        Route.post('resend-signup-otp', 'API/AuthController.resend_signup_otp')
        Route.post('verify-email', 'API/AuthController.verify_email')
        Route.post('login', 'API/AuthController.login')
        Route.post('social-login', 'Api/AuthController.socialLogin')

        // Reset Password
        Route.post('forgot-password', 'API/AuthController.forgotPassword')
        Route.post('verify-otp', 'API/AuthController.verifyOtp')
        Route.post('reset-password', 'API/AuthController.reset_password')
    }).middleware('guest')

    Route.post('logout', 'API/AuthController.logout')

    /*
    |--------------------------------------------------------------------------
    | Authenticated API Routes
    |--------------------------------------------------------------------------
    */
    Route.group(() => {

        /*
        |--------------------------------------------------------------------------
        | Profile Routes
        |--------------------------------------------------------------------------
        */
        Route.put('change-password', 'API/UserController.changePassword')
        Route.get('profile', 'API/UserController.profile')

        /*
        |--------------------------------------------------------------------------
        | Stripe API Routes
        |--------------------------------------------------------------------------
        */
        Route.get('generate-connect-account-link', 'API/StripeController.createAccountLink')
        Route.post('add-stripe-card', 'API/StripeController.addCard')
        Route.resource('user-cards', 'API/UserCardController')

        /*
        |--------------------------------------------------------------------------
        | Category Resource Route
        |--------------------------------------------------------------------------
        */
        Route.resource('categories', 'API/CategoriesController').middleware({
            '*': ['admin']
        })

    }).middleware('auth')

}).prefix('/api')