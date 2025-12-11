const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/modules/auth/views/LoginView.vue"),
    meta: { layout: "AuthLayout", requiresAuth: false, authImage: "image-login.png" },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/modules/auth/views/RegisterView.vue"),
    meta: { layout: "AuthLayout", requiresAuth: false, authImage: "image-login.png" },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("@/modules/auth/views/ForgotPasswordView.vue"),
    meta: { layout: "AuthLayout", requiresAuth: false, authImage: "image-forgot-password.png" },
  },
  {
    path: "/otp-verification",
    name: "OtpVerification",
    component: () => import("@/modules/auth/views/OtpVerificationView.vue"),
    meta: { layout: "AuthLayout", requiresAuth: false, authImage: "image-forgot-password.png" },
  },
  {
    path: "/set-new-password",
    name: "SetNewPassword",
    component: () => import("@/modules/auth/views/SetNewPasswordView.vue"),
    meta: { layout: "AuthLayout", requiresAuth: false, authImage: "image-forgot-password.png" },
  },
  {
    path: "/password-changed",
    name: "PasswordChanged",
    component: () => import("@/modules/auth/views/PasswordChangedView.vue"),
    meta: { layout: "AuthLayout", requiresAuth: false, authImage: "image-forgot-password.png" },
  },
  {
    path: "/verify-email",
    name: "SignupVerification",
    component: () => import("@/modules/auth/views/OtpVerificationView.vue"),
    meta: { layout: "AuthLayout", requiresAuth: false, authImage: "image-login.png" },
  },
  {
    path: "/signup-success",
    name: "SignupSuccess",
    component: () => import("@/modules/auth/views/SignupSuccessView.vue"),
    meta: { layout: "AuthLayout", requiresAuth: false, authImage: "image-login.png" },
  },
];
export default routes;
