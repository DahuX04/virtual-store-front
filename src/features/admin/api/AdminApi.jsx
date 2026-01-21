import { httpClient } from "../../../shared/api/HttpClient";

const adminApi = {
    fetchAdminData: async (id) => {
        try {
            const { data } = await httpClient.get(`/api/v1/virtualStore/accounts/${id}`);
            return data;
        } catch (error) {
            console.error("Error fetching admin data:", error);
            throw error;
        }
    }
}

export default adminApi;