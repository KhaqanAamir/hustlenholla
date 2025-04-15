# 📦 Auth Documentation

## ✅ Sign Up Flow

<p>As per the current status there was no need to create the sign up route as there are already users in the system db. 
The reason I created to create some test users and start working on the flow of other modules</p>

1. User sends request to `/auth/sign-up`
2. Backend validates the sign-up payload using DTO (UserSignUpDto)
3. Request is sent to the auth service which sends back a custom response.
4. From auth service it is going to the DB sign up function
5. DB is an instance of supabase service which is using supabase built in function of signup

## 🔍 UserSignUpDto

- email (string)
- password (string)
- first_name (string)
- last_name (string)
- role (which is an enum that is created by supabase dashboard)

## ⚠️ Improvements with Sign Up Flow:

- Will analyze their existing DB structure of User model and add more fields
- Will create Test cases for sign up

---

## ✅ Sign In Flow

1. User sends request to `/auth/sign-in`
2. Backend validates the sign-in payload using DTO (AuthBaseDto)
3. Request is sent to the auth service (signInWithPassword function) which sends back a custom response.
4. From auth service it is going to the DB signInWithPassword function
5. DB is an instance of supabase service which is using supabase built in function (signInWithPassword).

## 🔍 AuthBaseDto

- email (string)
- password (string)

---

## ✅ Forgot Password Flow

<p> For this route I am using google smtp as there is no option provided by the supabase to send otps. We need to send otp
as a verification step before we give access to the user to reset password </p>

1. User sends request to `/auth/forgot-password`
2. Backend validates the sign-in payload using email in the body only.
3. Request is sent to the auth service (forgotPassword function) which sends back a custom response.
4. In auth service an otp would be generated and that otp would be send to the user's email.
5. Another route would be triggered as part of this function "confirm-otp" which would come in use to check if user is adding a valid otp.
6. After the successful response from confirm-otp a new route will help user to reset password "reset-password".

## 🔍 ResetPasswordDto

- oldPassword (string)
- newPassword (string)

## ⚠️ Improvements with Reset Password Flow:

- Instead of using supabase updateUser method, we can also do this by directly writing a db level function which would be helpful because it would not refresh the user's token.

---
