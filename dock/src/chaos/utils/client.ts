import axios, { Axios } from 'axios'
import {APP_ID, APP_SECRET, CHAOS_BASE_URL, ORGANIZATION_ID} from "./constants";
import {isNull} from "lodash";

const getUserId = () => {
    return localStorage.getItem("userID") ?? "usr_744afe56b9482e83d6470cb39277779a"
}

export const getAccessToken = async () => {
    const user_id = getUserId()
    const response = await axios.get<{accessToken: string}>(`${CHAOS_BASE_URL}/organizations/${ORGANIZATION_ID}/apps/${APP_ID}/authorize/${user_id}`,{
        headers: {
            "x-app-id": APP_ID,
            "x-app-secret": APP_SECRET
        }
    })

    return response.data.accessToken as string ?? null

}

const getTokenFromStorage = () =>{
    return localStorage.getItem("accessToken")
}

const axiosClient = axios.create({
    baseURL: `${CHAOS_BASE_URL}/organizations/${ORGANIZATION_ID}/apps/${APP_ID}`
})

axiosClient.interceptors.request.use(async (config)=>{
    let token = getTokenFromStorage()

    if(!token){
        token = await getAccessToken()
    }

    if(isNull(token)){
        return Promise.reject(new Error("Unable to get access token"))
    }

    
    // config.headers.set("Authorization", `Bearer ${token}`)
    config.headers.Authorization = `Bearer ${token}`
    
    console.log("THe current body::", config.data)
    return config
},
    (error)=>{
    console.error("REQUEST FAILED::",error)
        return Promise.reject(error)
})


export default axiosClient