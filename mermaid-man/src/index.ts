import {constructVesselPublicKey, getProgramAddress, getVesselData} from "./utils";

const creator_id =  "usr_708e348a5a839d2ccbf0eb65e4b1fa0c";
const vessel_id = "vsl_9256c45c08f1e1f9e26a23a5a242";
const address = "6Q76gKWcpe3dhfiCkwqv9ZL6wkvpMSApBL1RWyvkDGrp";


(async ()=>{
    await getVesselData(address, vessel_id)
})();