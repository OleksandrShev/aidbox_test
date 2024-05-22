import axios, {AxiosResponse} from 'axios';
import {fetchAidBoxToken, fetchStgFhirToken} from "./tokenFecher";
import {aidBoxBaseUrl, count, fhirProxyBaseUrl} from "./consts";
import fs from 'fs';

// @ts-ignore
export const getFhirProxyEntity = async (fhirProxyUrl:string, allFhirEntities: any[], counter: number, entityName: string, env: string): Promise<any> => {
    const fhirTokenResponse = await fetchStgFhirToken();
    const fhirToken: string = fhirTokenResponse.access_token;
    const response: AxiosResponse<any> = await axios.get(fhirProxyUrl, {
        headers: {
            Authorization: `Bearer ${fhirToken}`
        }
    });
    const nextPage = response.data.link.find((el: any) => el.relation === "next");
    console.log(entityName, env, counter);
    const dir = `./data/${env}/${entityName}/`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = `${dir}/${entityName}_${counter}000.json`;
    if(fs.existsSync(filePath)){
        fs.unlinkSync(filePath);
    }
    fs.writeFileSync(filePath, JSON.stringify(response.data.entry));
    if (nextPage && counter < 10) {
        counter++;
        return getFhirProxyEntity(nextPage.url, allFhirEntities, counter, entityName, env);
    }
    return `${entityName}`;
};

// @ts-ignore
export const getAidBoxEntity = async (aidBoxUrl: string, allAidBoxEntities: Array<any>, counter: number, entityName: string, env: string):Promise<any> => {
    const aidBoxTokenResponse = await fetchAidBoxToken();
    const aidBoxToken: string = aidBoxTokenResponse.access_token;
    const response: AxiosResponse<any> = await axios.get(aidBoxUrl, {
        headers: {
            Authorization: `Bearer ${aidBoxToken}`
        }
    });
    const nextPage = response.data.link.find((el: any) => el.relation === "next");
    console.log(entityName, env, counter);
    const dir = `./data/${env}/${entityName}/`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = `${dir}/${entityName}_${counter}000.json`;
    if(fs.existsSync(filePath)){
        fs.unlinkSync(filePath);
    }
    fs.writeFileSync(filePath, JSON.stringify(response.data.entry));
    if (nextPage && counter < 10) {
        counter++;
        const u = nextPage.url.replace('fhir-proxy-2', 'corea-fhir-proxy-2').replace('fhir/','')
        return getAidBoxEntity(u, allAidBoxEntities, counter, entityName, env);
    }
    return `${entityName}`;
};

export const getDifferenceBetweenEntities = async (entity: string) => {
    const aidBoxUrl = `${aidBoxBaseUrl}${entity}?_count=${count}&_sort=_id`;
    const fhirProxyUrl = `${fhirProxyBaseUrl}${entity}?_count=${count}&_sort=_id`;
    const counter = 1;
    const fhirEntitiesRes = await getFhirProxyEntity(fhirProxyUrl, [], counter, entity, 'fhir');
    const aidBoxEntitiesRes = await getAidBoxEntity(aidBoxUrl, [], counter, entity, 'aidbox');
    // let diffResult: any[] = [];
    // let notFoundResult: any[] = [];
    // aidBoxEntitiesRes.forEach(aidBoxEntity => {
    //     const searchedFhirEntity =  fhirEntitiesRes.find(fhirPatient => aidBoxEntity.resource.id === fhirPatient.resource.id);
    //     let result: {id: string, desc?: string, dif?: any} = {
    //         id: aidBoxEntity.resource.id
    //     }
    //     if (searchedFhirEntity) {
    //         const dif = diff(searchedFhirEntity, aidBoxEntity);
    //         removeUnnecessaryDiff(dif);
    //         if (Object.keys(dif).length != 0) {
    //             result = {
    //                 ... result,
    //                 desc: `the difference between the aidbox and the fhir ${entity}s`,
    //                 dif
    //             }
    //             diffResult.push(result)
    //         }
    //     } else {
    //         result = {
    //             ...result,
    //             desc: `aidbox ${entity} not found in the fhir ${entity}s`,
    //         }
    //         notFoundResult.push(result);
    //     }
    // })
    return {fhirEntitiesRes, aidBoxEntitiesRes}
}
