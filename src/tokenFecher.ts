import axios from 'axios';
import { grant_type} from "./consts";

interface TokenResponse {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    token_type: string;
}

export async function fetchStgFhirToken(): Promise<TokenResponse> {
    const url = 'https://stg01.keycloak.stg01.amwell.systems/auth/realms/services/protocol/openid-connect/token';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = {
        grant_type: grant_type,
        client_id: process.env.fhir_client_id,
        client_secret: process.env.fhir_client_secret
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchAidBoxToken(): Promise<TokenResponse> {
    const url = 'https://dev-next.keycloak.dev.amwell.systems/auth/realms/services/protocol/openid-connect/token';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = {
        grant_type: grant_type,
        client_id: process.env.aidBox_client_id,
        client_secret: process.env.aidBox_client_secret
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
