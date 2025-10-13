/**
 * Created by Ryan Balieiro on 03.01.2025
 */
const MAP = {
    "about": "About",
    "all_categories": "All",
    "contact_thank_you": "*Thank you* for getting in touch!",
    "contact_thank_you_description": "Your message has been received, and our team will be in touch with you shortly.",
    "contact_thank_you_reply": "Our reply will be sent to your email address *{email}*.",
    "copyright_message": "Copyright ©{year} <a href='{url}' target='_blank'>{holder}</a> – {license}",
    "email": "E-mail",
    "error_fill_all_fields": "Please fill all the fields.",
    "error_invalid_email": "Please enter a valid e-mail address.",
    "error_sending_message": "There was an error sending the message.",
    "error_login_failed": "Invalid email or password. Please try again.",
    "latest_release": "Latest Release",
    "loading": "Loading...",
    "message": "Message",
    "name": "Name",
    "project_available_here": "<strong>@{title}</strong> is available on the following platforms or services:",
    "send": "Send Message",
    "sending_message": "Sending Message...",
    "subject": "Subject",
    "tags": "Tags:",
    "where_to_find": "Where To Find",
    "login_title": "Welcome Back",
    "login_subtitle": "Sign in to your account",
    "login_description": "Enter your credentials to access your dashboard",
    "email_label": "Email Address",
    "email_placeholder": "Enter your email address",
    "password_label": "Password",
    "password_placeholder": "Enter your password",
    "remember_me": "Remember me",
    "forgot_password": "Forgot password?",
    "login_button": "Sign In",
    "logging_in": "Signing in...",
    "demo_credentials": "Demo Credentials",
    "no_account": "Don't have an account?",
    "register_link": "Sign up here",
    "login_success_title": "Login Successful!",
    "login_success_message": "Welcome back, {name}! You have successfully signed in.",
    "login_time": "Login Time",
    "go_to_dashboard": "Go to Dashboard",
    "logout": "Sign Out"
}

export function useStrings() {
    /**
     * @param {String} key
     * @param {{key:String, replacement:String}[]} [replacements=null]
     * @return {*|string}
     */
    const get = (key, replacements) => {
        let string = MAP[key] || 'strings.' + key

        if(replacements) {
            replacements.forEach(({key, replacement}) => {
                string = string.replaceAll('@{'+key+'}', replacement)
            })
        }

        return string
    }

    /**
     * @param {String|Number} year
     * @param {String} holder
     * @param {String} url
     * @return {string}
     */
    const getCopyrightMessage = (year, holder, url, license) => {
        return get("copyright_message").replaceAll("{year}", year.toString())
            .replaceAll("{url}", url)
            .replaceAll("{holder}", holder)
            .replaceAll("{license}", license)
    }

    return {
        get,
        getCopyrightMessage
    }
}