
import "../cssfiles/login.css"

export function LoginPage(){
    return (
        <div class="login">
        <html>
            <head> 
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;600&display=swap" rel="stylesheet"/>
            </head>
            <body> 
                <div class="background">
                    <div class="shape"></div>
                    <div class="shape"></div>
                </div>
                <form class="form" action="{{ url_for('login') }}" method="post">
                    <h3>Login Here</h3>

                    <label class="label" for="email">Email</label>
                    <input class="input" type="text" name="email" placeholder="Email" id="email" maxlength="40" required />

                    <label class="label" for="password">Password</label>
                    <input class="input" type="password" name="password" placeholder="Password" id="password" maxlength="40" required/>

                    <button class="button" type="submit" value="Login">Log In</button>
                </form>
            </body>
        </html>
        </div>
    )
}