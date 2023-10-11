import axios from "axios";
import {APP_ID, APP_SECRET, CHAOS_BASE_URL} from "./constants.ts";


export const getAccessToken = async (organization_id: string, app_id: string, user_id: string) => {

    const response = await axios.get<{accessToken: string}>(`${CHAOS_BASE_URL}/organizations/${organization_id}/apps/${app_id}/authorize/${user_id}`,{
        headers: {
            "x-app-id": APP_ID,
            "x-app-secret": APP_SECRET
        }
    })

    return response.data.accessToken as string

}