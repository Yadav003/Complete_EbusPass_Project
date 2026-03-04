
// import axios, {
//   AxiosError,
//   AxiosInstance,
//   AxiosRequestConfig,
//   AxiosResponse,
//   InternalAxiosRequestConfig,
// } from "axios";
// import { BASE_URL, ENDPOINTS } from "./endpoints";

// interface ApiErrorResponse {
//   message?: string;
//   error?: string;
//   statusCode?: number;
// }

// export class ApiError extends Error {
//   public readonly statusCode: number;
//   public readonly data: unknown;

//   constructor(message: string, statusCode: number, data?: unknown) {
//     super(message);
//     this.name = "ApiError";
//     this.statusCode = statusCode;
//     this.data = data;
//   }
// }

// const TOKEN_KEY = "ebuspass_access_token";
// const REFRESH_TOKEN_KEY = "ebuspass_refresh_token";

// export const tokenStorage = {
//   getAccessToken: () => localStorage.getItem(TOKEN_KEY),
//   setAccessToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
//   getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
//   setRefreshToken: (token: string) =>
//     localStorage.setItem(REFRESH_TOKEN_KEY, token),
//   clear: () => {
//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem(REFRESH_TOKEN_KEY);
//     // Legacy key used in AuthContext — clear it too
//     localStorage.removeItem("ebuspass_user");
//   },
// };


// type QueueEntry = {
//   resolve: (token: string) => void;
//   reject: (err: unknown) => void;
// };

// let isRefreshing = false;
// const failedQueue: QueueEntry[] = [];

// function processQueue(error: unknown, token: string | null = null) {
//   failedQueue.forEach((entry) => {
//     if (error) {
//       entry.reject(error);
//     } else {
//       entry.resolve(token!);
//     }
//   });
//   failedQueue.length = 0;
// }


// const apiClient: AxiosInstance = axios.create({
//   baseURL: BASE_URL,

//   timeout: 15_000,

//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },

//   withCredentials: true,
// });

// apiClient.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     // 1. Attach access token
//     const token = tokenStorage.getAccessToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // 2. Unique request ID for distributed tracing
//     config.headers["X-Request-ID"] = crypto.randomUUID();

//     // 3. Log in development only
//     if (import.meta.env.DEV) {
//       console.debug(
//         `[API ▶] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
//         config.data ?? ""
//       );
//     }

//     return config;
//   },
//   (error: AxiosError) => Promise.reject(error)
// );


// apiClient.interceptors.response.use(
//   (response: AxiosResponse) => {
//     if (import.meta.env.DEV) {
//       console.debug(
//         `[API ◀] ${response.status} ${response.config.url}`,
//         response.data
//       );
//     }
//     return response;
//   },

//   async (error: AxiosError<ApiErrorResponse>) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     if (!error.response) {
//       if (error.code === "ECONNABORTED") {
//         return Promise.reject(
//           new ApiError("Request timed out. Please try again.", 408)
//         );
//       }
//       return Promise.reject(
//         new ApiError(
//           "Network error — please check your internet connection.",
//           0
//         )
//       );
//     }

//     const { status, data } = error.response;

//     if (status === 401 && !originalRequest._retry) {
//       const refreshToken = tokenStorage.getRefreshToken();

//       if (!refreshToken) {
//         tokenStorage.clear();
//         redirectToLogin();
//         return Promise.reject(
//           new ApiError("Session expired. Please log in again.", 401)
//         );
//       }

//       if (isRefreshing) {
//         return new Promise<string>((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((newToken) => {
//             originalRequest.headers.Authorization = `Bearer ${newToken}`;
//             return apiClient(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const { data: refreshData } = await axios.post<{
//           accessToken: string;
//           refreshToken?: string;
//         }>(
//           `${BASE_URL}${ENDPOINTS.AUTH.REFRESH_TOKEN}`,
//           { refreshToken },
//           { withCredentials: true }
//         );

//         const newAccessToken = refreshData.accessToken;
//         tokenStorage.setAccessToken(newAccessToken);
//         if (refreshData.refreshToken) {
//           tokenStorage.setRefreshToken(refreshData.refreshToken);
//         }

//         apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
//         processQueue(null, newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError, null);
//         tokenStorage.clear();
//         redirectToLogin();
//         return Promise.reject(
//           new ApiError(
//             "Session expired. Please log in again.",
//             401,
//             refreshError
//           )
//         );
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     if (status === 403) {
//       window.dispatchEvent(
//         new CustomEvent("ebuspass:forbidden", { detail: { url: error.config?.url } })
//       );
//     }

//     if (status === 503 || status === 502) {
//       return Promise.reject(
//         new ApiError("Service is temporarily unavailable. Try again shortly.", status)
//       );
//     }

//     const message =
//       data?.message ??
//       data?.error ??
//       error.message ??
//       "An unexpected error occurred.";

//     return Promise.reject(new ApiError(message, status, data));
//   }
// );


// function redirectToLogin() {
//   const isAdminPath = window.location.pathname.startsWith("/admin");
//   const target = isAdminPath ? "/admin/login" : "/login";
//   if (window.location.pathname !== target) {
//     window.location.replace(target);
//   }
// }

// export default apiClient;
