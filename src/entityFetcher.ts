import axios, {AxiosResponse} from 'axios';
import {fetchAidBoxToken, fetchStgFhirToken} from "./tokenFecher";
import {diff} from "deep-object-diff";
import {aidBoxBaseUrl, count, fhirProxyBaseUrl} from "./consts";


// @ts-ignore
export const getFhirProxyEntity = async (fhirProxyUrl:string, allFhirEntities: any): Promise<any[]> => {
    const fhirTokenResponse = await fetchStgFhirToken();
    const fhirToken: string = fhirTokenResponse.access_token;
    const response: AxiosResponse<any> = await axios.get(fhirProxyUrl, {
        headers: {
            Authorization: `Bearer ${fhirToken}`
        }
    });
    const nextPage = response.data.link.find((el: any) => el.relation === "next");
    allFhirEntities = [...allFhirEntities, ...response.data.entry];
    if (nextPage) {
        return getFhirProxyEntity(nextPage.url, allFhirEntities);
    }
    return allFhirEntities;
};

// @ts-ignore
export const getAidBoxEntity = async (aidBoxUrl: string, allAidBoxEntities: Array<any>):Promise<any[]> => {
    const aidBoxTokenResponse = await fetchAidBoxToken();
    const aidBoxToken: string = aidBoxTokenResponse.access_token;
    const response: AxiosResponse<any> = await axios.get(aidBoxUrl, {
        headers: {
            Authorization: `Bearer ${aidBoxToken}`
        }
    });
    const nextPage = response.data.link.find((el: any) => el.relation === "next");
    allAidBoxEntities = [...allAidBoxEntities, ...response.data.entry];
    if (nextPage) {
        const u = nextPage.url.replace('fhir-proxy-2', 'corea-fhir-proxy-2').replace('fhir/','')
        return getAidBoxEntity(u, allAidBoxEntities);
    }
    return allAidBoxEntities;
};

export const getDifferenceBetweenEntities = async (entity: string) => {
    const aidBoxUrl = `${aidBoxBaseUrl}${entity}?_count=${count}`;
    const fhirProxyUrl = `${fhirProxyBaseUrl}${entity}?_count=${count}`;

    const fhirEntitiesRes = await getFhirProxyEntity(fhirProxyUrl, []);
    const aidBoxEntitiesRes = await getAidBoxEntity(aidBoxUrl, []);
    let diffResult: any[] = [];
    let notFoundResult: any[] = [];
    aidBoxEntitiesRes.forEach(aidBoxEntity => {
        const searchedFhirEntity =  fhirEntitiesRes.find(fhirPatient => aidBoxEntity.resource.id === fhirPatient.resource.id);
        let result: {id: string, desc?: string, dif?: any} = {
            id: aidBoxEntity.resource.id
        }
        if (searchedFhirEntity) {
            const dif = diff(searchedFhirEntity, aidBoxEntity);
            removeUnnecessaryDiff(dif);
            if (Object.keys(dif).length != 0) {
                result = {
                    ... result,
                    desc: `the difference between the aidbox and the fhir ${entity}s`,
                    dif
                }
                diffResult.push(result)
            }
        } else {
            result = {
                ...result,
                desc: `aidbox ${entity} not found in the fhir ${entity}s`,
            }
            notFoundResult.push(result);
        }
    })
    return {diffResult, notFoundResult}
}

export const removeUnnecessaryDiff = (dif: any) => {
    if (dif?.fullUrl) {
        delete dif?.fullUrl;
    }
    if (dif?.link) {
        delete dif?.link;
    }
    if (dif?.resource?.meta) {
        delete dif?.resource?.meta;
    }
    if (!(!!Object.keys(dif?.resource).length)) {
        delete dif?.resource;
    }
    // for (let key in dif) {
    //     if (dif[key] && typeof dif[key] === 'object') {
    //         removeUnnecessaryDiff(dif[key], unnecessaryDiffList);
    //
    //         if (Object.keys(dif[key]).length === 0) {
    //             delete dif[key];
    //         }
    //     } else {
    //         if (unnecessaryDiffList.includes(key)) {
    //             delete dif[key];
    //         }
    //     }
    // }
}
