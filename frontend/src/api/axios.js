import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: { "Content-Type": "application/json" },
});

// -----------------------------------------------------
// 1) INTERCEPTOR : Ajouter le token d'accès à chaque requête
// -----------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (!config.headers) config.headers = {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------------------------------
// 2) INTERCEPTOR : Rafraîchir automatiquement le token expiré
// -----------------------------------------------------
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 + pas encore retry → on tente le refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/users/login/") &&
      !originalRequest.url.includes("/users/signup/")
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) {
        return Promise.reject(error);
      }

      try {
        // On utilise axios classique pour éviter boucle infinie
        const res = await axios.post(
          "http://localhost:8000/api/users/token/refresh/",
          { refresh }
        );

        const newAccessToken = res.data.access;

        // On met à jour localStorage
        localStorage.setItem("access_token", newAccessToken);

        // On met à jour headers globaux
        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

        // On met à jour la requête originale
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // On relance la requête
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh error:", refreshError);
        localStorage.clear();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
