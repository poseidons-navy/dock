import { randomBytes } from "crypto"


/**
 * 
 * @param entity_abrv - entity abbreviation e.g "cus" for customer or "pm" for payment method
 * @returns {string} - unique_id prefixed with the entity abbreviation e.g "cus_1234"
 * 
 */
export const generate_unique_id = (entity_abrv: String): string => {
    const unique_id = randomBytes(16).toString("hex")
    return `${entity_abrv}_${unique_id}`
}