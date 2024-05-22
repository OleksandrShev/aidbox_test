import express from 'express';
import { fetchAidBoxToken, fetchStgFhirToken } from "./tokenFecher";
import {getAidBoxEntity, getDifferenceBetweenEntities, getFhirProxyEntity} from "./entityFetcher";
import dotenv from 'dotenv';
import {aidBoxBaseUrl, count, fhirProxyBaseUrl} from "./consts";
dotenv.config();
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    const data = {};
    res.send(`Data: ${JSON.stringify(data)}`);
});

app.get('/fhir-token', async (req, res) => {
    try {
        const tokenResponse = await fetchStgFhirToken();
        res.send(`Token: ${JSON.stringify(tokenResponse)}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fhir fetching token');
    }
});

app.get('/aidbox-token', async (req, res) => {
    try {
        const tokenResponse = await fetchAidBoxToken();
        res.send(`Token: ${JSON.stringify(tokenResponse)}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error aidbox fetching token');
    }
});

app.get('/patients', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Patient"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching patients');
    }
});

app.get('/AllergyIntolerance', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("AllergyIntolerance"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching AllergyIntolerance');
    }
});

app.get('/CareTeam', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("CareTeam"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching CareTeam');
    }
});

app.get('/ChargeItem', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("ChargeItem"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching ChargeItem');
    }
});

app.get('/Communication', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Communication"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Communication');
    }
});

app.get('/Condition', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Condition"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Condition');
    }
});

app.get('/Consent', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Consent"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Consent');
    }
});

app.get('/Coverage', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Coverage"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Coverage');
    }
});

app.get('/CoverageEligibilityRequest', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("CoverageEligibilityRequest"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching CoverageEligibilityRequest');
    }
});

app.get('/CoverageEligibilityResponse', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("CoverageEligibilityResponse"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching CoverageEligibilityResponse');
    }
});

app.get('/Device', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Device"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Device');
    }
});

app.get('/DeviceRequest', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("DeviceRequest"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching DeviceRequest');
    }
});

app.get('/DiagnosticReport', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("DiagnosticReport"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching DiagnosticReport');
    }
});

app.get('/DocumentReference', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("DocumentReference"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching DocumentReference');
    }
});

app.get('/aidbox-DocumentReference', async (req, res) => {
    try {
        const aidBoxUrl = `${aidBoxBaseUrl}DocumentReference?_count=${count}&_sort=_id`;
        const data = await getAidBoxEntity(aidBoxUrl, [], 1, 'DocumentReference', 'aidbox');
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching aidbox DocumentReference');
    }
});

app.get('/Group', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Group"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Group');
    }
});

app.get('/HealthcareService', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("HealthcareService"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching HealthcareService');
    }
});

app.get('/InsurancePlan', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("InsurancePlan"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching InsurancePlan');
    }
});

app.get('/Media', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Media"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Media');
    }
});

app.get('/MedicationRequest', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("MedicationRequest"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching MedicationRequest');
    }
});

app.get('/MedicationStatement', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("MedicationStatement"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching MedicationStatement');
    }
});
app.get('/Observation', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Observation"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Observation');
    }
});

app.get('/Organization', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Organization"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Organization');
    }
});

app.get('/Procedure', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Procedure"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Procedure');
    }
});

app.get('/QuestionnaireResponse', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("QuestionnaireResponse"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching QuestionnaireResponse');
    }
});

app.get('/RelatedPerson', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("RelatedPerson"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching RelatedPerson');
    }
});

app.get('/RequestGroup', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("RequestGroup"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching RequestGroup');
    }
});

app.get('/Schedule', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Schedule"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Schedule');
    }
});

app.get('/SearchParameter', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("SearchParameter"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching SearchParameter');
    }
});

app.get('/ServiceRequest', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("ServiceRequest"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching ServiceRequest');
    }
});

app.get('/Slot', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Slot"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Slot');
    }
});

app.get('/ValueSet', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("ValueSet"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching ValueSet');
    }
});

app.get('/practitioner', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Practitioner"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching practitioners');
    }
});

app.get('/practitioner-role', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("PractitionerRole"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching practitioner roles');
    }
});

app.get('/location', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Location"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching locations');
    }
});

app.get('/appointment', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Appointment"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Appointment');
    }
});

app.get('/encounter', async (req, res) => {
    try {
        res.send(await getDifferenceBetweenEntities("Encounter"));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Encounter');
    }
});

app.get('/fhir-encounters', async (req, res) => {
    try {
        const fhirProxyUrl = `${fhirProxyBaseUrl}Encounter?_count=${count}&_sort=_id`;
        const data = await getFhirProxyEntity(fhirProxyUrl, [], 1, 'Encounter', 'fhir');
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching fhir encounters');
    }
});

app.get('/aidbox-encounters', async (req, res) => {
    try {
        const aidBoxUrl = `${aidBoxBaseUrl}Encounter?_count=${count}&_sort=_id`;
        const data = await getAidBoxEntity(aidBoxUrl, [], 1, 'Encounter', 'aidbox');
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching aidbox encounters');
    }
});

app.get('/fhir-appointment', async (req, res) => {
    try {
        const fhirProxyUrl = `${fhirProxyBaseUrl}Appointment?_count=${count}&_sort=_id`;
        const data = await getFhirProxyEntity(fhirProxyUrl, [], 1, 'Appointment', 'fhir');
        console.log(data);
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching appointments');
    }
});

app.get('/aidbox-appointment', async (req, res) => {
    try {
        const aidBoxUrl = `${aidBoxBaseUrl}Appointment?_count=${count}&_sort=_id`;
        const data = await getAidBoxEntity(aidBoxUrl, [], 1, 'Appointment', 'aidbox');
        console.log(data);
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching appointments');
    }
});

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

server.timeout = 1800000;

