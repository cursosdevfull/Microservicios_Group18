import { Router } from "express";
import { env } from "@core/index";
import { KafkaProducer, RabbimqProducer } from "@core/services";
import { ExchangeType } from "@core/types";

export class Routes {
    private readonly router: Router

    constructor() {
        this.router = Router();
        this.router.get("/", (req, res) => {
            res.json({ message: "Welcome to the Appointment API!" });
        });

        this.router.post("/appointment", async (req, res) => {
            const { countryISO } = req.body;
            //let sagaOrchestrator: SagaOrchestrator | null = null;
            //let publisher: RabbimqProducer | null = null;

            try {
                const traceId = req.headers["x-trace-id"] || "N/A";

                const producer = new KafkaProducer()
                await producer.send(`APPOINTMENT_${countryISO}`, [{ ...req.body, traceId }]);

                /*  if (Math.random() < 0.3) {
                     console.log("Simulating failure for appointment request with Trace ID:", traceId);
                     throw new Error("Simulated random failure");
                 } */

                //const steps: IStep[] = []

                console.log("Trace ID for appointment request:", traceId); // Debugging line to check the generated trace ID

                /*                 publisher = new RabbimqProducer();
                                await publisher.connect();
                                await publisher.configureExchange(env.EXCHANGE_NAME, env.EXCHANGE_TYPE as ExchangeType);
                                await publisher.publish(`${env.ROUTING_KEY_PREFIX}.${countryISO}`, { ...req.body, traceId }); */

                //const serviceAppointmentFromDiscovery = await axios.get(`${env.API_DISCOVERY_URL}/services/name/appointment-${countryISO.toLowerCase()}`)
                //const appointmentUrl = `${serviceAppointmentFromDiscovery.data.host}:${serviceAppointmentFromDiscovery.data.port}/api/v1/appointment`
                //const appointmentCompensationUrl = `${serviceAppointmentFromDiscovery.data.host}:${serviceAppointmentFromDiscovery.data.port}/api/v1/appointment-compensation`
                // const responseAppointment = await axios.post(appointmentUrl, req.body, { headers: { "x-trace-id": traceId } });

                //steps.push(new AppointmentCountryStep(appointmentUrl, appointmentCompensationUrl, req.body, traceId))

                /* const serviceSalesforceFromDiscovery = await axios.get(`${env.API_DISCOVERY_URL}/services/name/salesforce`)
                const salesforceUrl = `${serviceSalesforceFromDiscovery.data.host}:${serviceSalesforceFromDiscovery.data.port}/api/v1/salesforce`
                const salesforceCompensationUrl = `${serviceSalesforceFromDiscovery.data.host}:${serviceSalesforceFromDiscovery.data.port}/api/v1/salesforce-compensation` */
                //await axios.post(salesforceUrl, req.body, { headers: { "x-trace-id": traceId } });

                //steps.push(new SalesforceStep(salesforceUrl, salesforceCompensationUrl, req.body, traceId))

                //sagaOrchestrator = new SagaOrchestrator(steps);
                //await sagaOrchestrator.execute();

                //res.json(responseAppointment.data);
                res.json({ message: "Appointment created successfully" });
            } catch (error) {
                /*                 if (sagaOrchestrator) {
                                    await sagaOrchestrator.compensate();
                                } */
                const traceId = req.headers["x-trace-id"] || "N/A";
                console.error("Trace ID for appointment request:", traceId); // Debugging line to check the generated trace ID
                res.status(500).json({ message: "Error forwarding request to appointment service", error });
            } finally {
                //publisher?.close();
            }
        })
    }

    public getRouter(): Router {
        return this.router;
    }
}

export const router = new Routes().getRouter();