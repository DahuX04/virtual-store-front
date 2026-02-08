import { httpClient } from "../../../shared/api/HttpClient";

export async function getCategoriesPaged(params = {}) {
    const response = await httpClient.get(
        "/api/v1/virtualStore/categories/paged",
        { params }
    );

    return response.data?.data || null;
}

export async function getCategoryImageByCategoryId(id) {
    const response = await httpClient.get(
        `/api/v1/virtualStore/category-images/category/${id}`
    );

    return response.data?.data || null;
}