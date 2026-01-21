import { httpClient } from "../../../shared/api/HttpClient";

const authApi = {
    login: async ({ email, password }) => {
        try{
            const { data } = await httpClient.post("/api/v1/auth/login", { email, password });
            return data;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }
};

export default authApi;