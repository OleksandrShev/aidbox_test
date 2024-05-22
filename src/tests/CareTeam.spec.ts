import fs from 'fs';
import path from 'path';
import {test} from '@jest/globals';
import {removeUnnecessaryDiff} from "../helpers";
import {diff} from "deep-object-diff";

const getEntitiesFromDir = (dir: any) => {
    const files = fs.readdirSync(dir);
    const entities = [];
    for (const file of files) {
        // @ts-ignore
        const data = JSON.parse(fs.readFileSync(path.join(dir, file)));
        entities.push(...data);
    }
    return entities;
};

test('test CareTeam', () => {
    const aidBoxDir = './data/aidbox/CareTeam';
    const fhirEntities = getEntitiesFromDir('./data/fhir/CareTeam');

    let diffResult: any[] = [];
    let notFoundResult: any[] = [];

    const aidBoxFiles = fs.readdirSync(aidBoxDir);
    for (const aidBoxFile of aidBoxFiles) {
        // @ts-ignore
        const aidBoxEntities = JSON.parse(fs.readFileSync(path.join(aidBoxDir, aidBoxFile)));

        aidBoxEntities.forEach((aidBoxEntity: any) => {
            const searchedFhirEntity =  fhirEntities.find(fhirPatient => aidBoxEntity.resource.id === fhirPatient.resource.id);
            let result: {id: string, desc?: string, dif?: any} = {
                id: aidBoxEntity.resource.id
            }
            if (searchedFhirEntity) {
                const dif = diff(searchedFhirEntity, aidBoxEntity);
                removeUnnecessaryDiff(dif);
                if (Object.keys(dif).length != 0) {
                    result = {
                        ... result,
                        desc: `the difference between the aidbox and fhir entities`,
                        dif
                    }
                    diffResult.push(result);
                }
            } else {
                result = {
                    ... result,
                    desc: `aidbox entity not found in fhir entities`,
                }
                notFoundResult.push(result);
            }
        });

        const resultDir = './data/result/CareTeam';
        if (!fs.existsSync(resultDir)) {
            fs.mkdirSync(resultDir, { recursive: true });
        }

        const diffResultFilePath = path.join(resultDir, 'diffResult.json');
        const notFoundResultFilePath = path.join(resultDir, 'notFoundResult.json');

        if (fs.existsSync(diffResultFilePath)) {
            fs.unlinkSync(diffResultFilePath);
        }
        if (fs.existsSync(notFoundResultFilePath)) {
            fs.unlinkSync(notFoundResultFilePath);
        }

        fs.writeFileSync(diffResultFilePath, JSON.stringify(diffResult));
        fs.writeFileSync(notFoundResultFilePath, JSON.stringify(notFoundResult));
    }
});
