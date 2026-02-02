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
    },
    fetchProducts: async (page, size, q = "") => {
        try {
            const query = q?.trim() ? `&q=${encodeURIComponent(q.trim())}` : "";
            const { data } = await httpClient.get(
                `/api/v1/virtualStore/products/paged?page=${page}&size=${size}&sortBy=id&sortDir=desc${query}`
            );
            return data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },
    getCategoriesPaged: async (page, size, q = "") => {
        try {
            const query = q?.trim() ? `&q=${encodeURIComponent(q.trim())}` : "";
            const { data } = await httpClient.get(
                `/api/v1/virtualStore/categories/paged?page=${page}&size=${size}&sortBy=id&sortDir=desc${query}`
            );
            return data;
        }
        catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    },
    fetchBrands: async () => {
        try {
            const { data } = await httpClient.get(`/api/v1/virtualStore/brands/all`);
            return data;
        } catch (error) {
            console.error("Error fetching brands:", error);
            throw error;
        }
    },
    fetchCategories: async () => {
        try {
            const { data } = await httpClient.get(`/api/v1/virtualStore/categories/all`);
            return data;
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    },
    createProduct: async (productData) => {
        try {
            const { data } = await httpClient.post(`/api/v1/virtualStore/products/create`, productData);
            return data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },
    createProductImages: async (formData) => {
        try {
            const { data } = await httpClient.post(
                `/api/v1/virtualStore/product-images/product-images`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return data;
        } catch (error) {
            console.error("Error uploading product images:", error);
            throw error;
        }
    },
    getProductById: async (productId) => {
        try {
            const { data } = await httpClient.get(
                `/api/v1/virtualStore/products/${productId}`
            );
            return data;
        } catch (error) {
            console.error("Error fetching product by ID:", error);
            throw error;
        }
    },
    getProductImagesUrlByProductId: async (productId) => {
        try {
            const { data } = await httpClient.get(
                `${httpClient.defaults.baseURL}/api/v1/virtualStore/product-images/product/${productId}`
            );
            return data;
        } catch (error) {
            console.error("Error getting product images URL:", error);
            throw error;
        }
    },
    deleteProductById: async (productId) => {
        try {
            const { data } = await httpClient.delete(
                `/api/v1/virtualStore/products/delete/${productId}`
            );
            return data;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    },
    deleteImagesUrlByProductId: async (productId) => {
        try {
            const { data } = await httpClient.delete(
                `/api/v1/virtualStore/product-images/delete/product/${productId}`
            );
            return data;
        } catch (error) {
            console.error("Error deleting product images by product ID:", error);
            throw error;
        }
    },
    deleteImageById: async (imageId) => {
        try {
            const { data } = await httpClient.delete(
                `/api/v1/virtualStore/product-images/delete/${imageId}`
            );
            return data;
        } catch (error) {
            console.error("Error deleting image by ID:", error);
            throw error;
        }
    },
    updateProductById: async (productId, productData) => {
        try {
            const { data } = await httpClient.put(
                `/api/v1/virtualStore/products/update/${productId}`,
                productData
            );
            return data;
        } catch (error) {
            console.error("Error updating product by ID:", error);
            throw error;
        }
    },
    getCategoryById: async (categoryId) => {
        try {
            const { data } = await httpClient.get(
                `/api/v1/virtualStore/categories/${categoryId}`
            );
            return data;
        } catch (error) {
            console.error("Error fetching category by ID:", error);
            throw error;
        }
    },
    getCategoryImageUrlByCategoryId: async (categoryId) => {
        try {
            const { data } = await httpClient.get(
                `${httpClient.defaults.baseURL}/api/v1/virtualStore/category-images/category/${categoryId}`
            );
            return data;
        } catch (error) {
            console.error("Error getting category image URL:", error);
            throw error;
        }
    },
    createCategory: async (categoryData) => {
        try {
            const { data } = await httpClient.post(
                `/api/v1/virtualStore/categories/create`,
                categoryData
            );
            return data;
        } catch (error) {
            console.error("Error creating category:", error);
            throw error;
        }
    },
    createCategoryImage: async (formData) => {
        try {
            const { data } = await httpClient.post(
                `/api/v1/virtualStore/category-images/category-image`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return data;
        }
        catch (error) {
            console.error("Error uploading category image:", error);
            throw error;
        }
    },
    updateCategoryById: async (categoryId, categoryData) => {
        try {
            const { data } = await httpClient.put(
                `/api/v1/virtualStore/categories/update/${categoryId}`,
                categoryData
            );
            return data;
        } catch (error) {
            console.error("Error updating category by ID:", error);
            throw error;
        }
    },
    deleteCategoryImageById: async (imageId) => {
        try {
            const { data } = await httpClient.delete(
                `/api/v1/virtualStore/category-images/${imageId}`
            );
            return data;
        }
        catch (error) {
            console.error("Error deleting category image by ID:", error);
            throw error;
        }
    },
    deleteCategoryImageByCategoryId: async (categoryId) => {
        try {
            const { data } = await httpClient.delete(
                `/api/v1/virtualStore/category-images/delete/category/${categoryId}`
            );
            return data;
        } catch (error) {
            console.error("Error deleting category image by category ID:", error);
            throw error;
        }
    },
    deleteCategoryById: async (categoryId) => {
        try {
            const { data } = await httpClient.delete(
                `/api/v1/virtualStore/categories/delete/${categoryId}`
            );
        } catch (error) {
            console.error("Error deleting category by ID:", error);
            throw error;
        }
    },
    getBrandsPaged: async (page, size, q = "") => {
        try {
            const query = q?.trim() ? `&q=${encodeURIComponent(q.trim())}` : "";
            const { data } = await httpClient.get(
                `/api/v1/virtualStore/brands/paged?page=${page}&size=${size}&sortBy=id&sortDir=desc${query}`
            );
            return data;
        }
        catch (error) {
            console.error("Error fetching brands:", error);
            throw error;
        }
    },
    deleteBrandById: async (brandId) => {
        try {
            const { data } = await httpClient.delete(
                `/api/v1/virtualStore/brands/delete/${brandId}`
            );
            return data;
        } catch (error) {
            console.error("Error deleting brand:", error);
            throw error;
        }
    },
    createBrand: async (brandData) => {
        try {
            const { data } = await httpClient.post(
                `/api/v1/virtualStore/brands/create`,
                brandData
            );
            return data;
        } catch (error) {
            console.error("Error creating brand:", error);
            throw error;
        }
    },
    getBrandById: async (brandId) => {
        try {
            const { data } = await httpClient.get(
                `/api/v1/virtualStore/brands/${brandId}`
            );
            return data;
        } catch (error) {
            console.error("Error fetching brand by ID:", error);
            throw error;
        }
    },
    updateBrandById: async (brandId, payload) => {
        try {
            const { data } = await httpClient.put(
                `/api/v1/virtualStore/brands/update/${brandId}`,
                payload
            );
            return data;
        } catch (error) {
            console.error("Error updating brand by ID:", error);
            throw error;
        }
    }
}

export default adminApi;