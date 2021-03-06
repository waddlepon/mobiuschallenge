import axios from 'axios';

const api_url: string = "https://5f996efe50d84900163b8a42.mockapi.io/api/v1";

export interface BomItem {
    id: string;
    bomId: string;
    model: string;
    uuid: string;
    created_at: number;
    updated_at: number;
    quantity: number;
    item_unit_cost: number;
    specific_part: number;
}

export async function getBoms() {
    try {
        const response = await axios.get(api_url + "/bom");
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function getBomItems(id) {
    try {
        const response = await axios.get(api_url + "/bom/" + id.toString() + "/bomitem");
        return response.data;
    } catch (error) {
        console.error(error);
    }
}