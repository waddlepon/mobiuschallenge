import axios from 'axios';
import axiosRetry from 'axios-retry';

//const api_url: string = "https://5f996efe50d84900163b8a42.mockapi.io/api/v1";
const api_url: string = "https://604314fba20ace001728dbe0.mockapi.io/api/v1";

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

axiosRetry(axios, {
    retries: 7,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => true
});

export async function getBoms() {
    try {
        const response = await axios.get(api_url + "/bom");
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function getBomItems(id: number) {
    try {
        const response = await axios.get(api_url + '/bom/' + id.toString() + '/bomitem');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function addBomItem(bomid: number, item: any) {
    try {
        await axios.post(api_url + '/bom/' + bomid.toString() + '/bomitem', item);
    } catch (error) {
        console.error(error);
    }
}

export async function deleteBomItem(bomid: number, itemid: number) {
    try {
        await axios.delete(api_url +'/bom/' + bomid.toString() + '/bomitem/' + itemid.toString());
    } catch (error) {
        console.error(error);
    }
}

export async function putBomItem(bomid: number, itemid: number, item: any) {
    const dateTime = new Date();
    item.updated_at = (Math.floor(dateTime.getTime() / 1000)).toString();
    try {
        await axios.put(api_url + '/bom/' + bomid.toString() + '/bomitem/' + itemid.toString(), item);
    } catch (error) {
        console.error(error);
    }
}