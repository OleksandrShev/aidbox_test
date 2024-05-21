import axios, {AxiosResponse} from 'axios';
import {fetchAidBoxToken, fetchStgFhirToken} from "./tokenFecher";
import {diff} from "deep-object-diff";
import {aidBoxBaseUrl, count, fhirProxyBaseUrl} from "./consts";
import fs from 'fs';
import {removeUnnecessaryDiff} from "./helpers";

// @ts-ignore
export const getFhirProxyEntity = async (fhirProxyUrl:string, allFhirEntities: any[], counter: number, entityName: string, env: string): Promise<any[]> => {
    const fhirTokenResponse = await fetchStgFhirToken();
    const fhirToken: string = fhirTokenResponse.access_token;
    const response: AxiosResponse<any> = await axios.get(fhirProxyUrl, {
        headers: {
            Authorization: `Bearer ${fhirToken}`
        }
    });
    const nextPage = response.data.link.find((el: any) => el.relation === "next");
    allFhirEntities = [...allFhirEntities, ...response.data.entry];
    console.log(entityName, env, counter);
    if ((counter !== 0 && counter % 10 === 0) || !nextPage) {
        const dir = `./data/${env}/${entityName}/`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const filePath = `${dir}/${entityName}_${counter}000.json`;
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        }
        fs.writeFileSync(filePath, JSON.stringify(allFhirEntities));
        allFhirEntities.length = 0;
    }
    if (nextPage) {
        counter++;
        return getFhirProxyEntity(nextPage.url, allFhirEntities, counter, entityName, env);
    }
    return allFhirEntities;
};

// @ts-ignore
export const getAidBoxEntity = async (aidBoxUrl: string, allAidBoxEntities: Array<any>, counter: number, entityName: string, env: string):Promise<any[]> => {
    const aidBoxTokenResponse = await fetchAidBoxToken();
    const aidBoxToken: string = aidBoxTokenResponse.access_token;
    const response: AxiosResponse<any> = await axios.get(aidBoxUrl, {
        headers: {
            Authorization: `Bearer ${aidBoxToken}`
        }
    });
    const nextPage = response.data.link.find((el: any) => el.relation === "next");
    allAidBoxEntities = [...allAidBoxEntities, ...response.data.entry];
    console.log(entityName, env, counter);
    if ((counter !== 0 && counter % 10 === 0) || !nextPage) {
        const dir = `./data/${env}/${entityName}/`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const filePath = `${dir}/${entityName}_${counter}000.json`;
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        }
        fs.writeFileSync(filePath, JSON.stringify(allAidBoxEntities));
        allAidBoxEntities.length = 0;
    }
    if (nextPage) {
        counter++;
        const u = nextPage.url.replace('fhir-proxy-2', 'corea-fhir-proxy-2').replace('fhir/','')
        return getAidBoxEntity(u, allAidBoxEntities, counter, entityName, env);
    }
    return allAidBoxEntities;
};

export const getDifferenceBetweenEntities = async (entity: string) => {
    const aidBoxUrl = `${aidBoxBaseUrl}${entity}?_count=${count}`;
    const fhirProxyUrl = `${fhirProxyBaseUrl}${entity}?_count=${count}`;
    const counter = 1;
    const fhirEntitiesRes = await getFhirProxyEntity(fhirProxyUrl, [], counter, entity, 'fhir');
    const aidBoxEntitiesRes = await getAidBoxEntity(aidBoxUrl, [], counter, entity, 'aidbox');
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
