import { httpClient } from "../../../shared/api/HttpClient";

export async function getProductsPaged(params = {}) {
    const response = await httpClient.get(
        "/api/v1/virtualStore/products/paged",
        { params }
    );

    return response.data?.data || null;
}

export async function getProductByCategory(categoryId, params = {}) {
    const response = await httpClient.get(
        `/api/v1/virtualStore/products/category/${categoryId}`,
        { params }
    );
    return response.data?.data || null;
}

export async function getProductById(id) {
    const response = await httpClient.get(
        `/api/v1/virtualStore/products/id/${id}`
    );
    return response.data?.data || null;
}

export async function getProductImageByProductId(id) {
    const response = await httpClient.get(
        `/api/v1/virtualStore/product-images/product/${id}`
    );

    return response.data?.data || null;
}