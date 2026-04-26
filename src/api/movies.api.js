import api from "./axios";

export const getMovies = async (params) => {
  const response = await api.get("/movies", { params });
  return response.data;
};

export const getMovieById = async (id) => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

export const createMovie = async (payload) => {
  const response = await api.post("/admin/movies", payload);
  return response.data;
};

export const updateMovie = async (id, payload) => {
  const response = await api.put(`/admin/movies/${id}`, payload);
  return response.data;
};

export const deleteMovie = async (id) => {
  const response = await api.delete(`/admin/movies/${id}`);
  return response.data;
};

export const uploadThumbnail = async (file) => {
  const formData = new FormData();
  formData.append("thumbnail", file);

  const response = await api.post("/upload/thumbnail", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
};
