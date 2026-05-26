import { env } from "@core/environment";
import * as jwt from "jsonwebtoken";

type StringValue = jwt.SignOptions["expiresIn"]

export function generateAccessToken(patientId: number, name: string, lastname: string): string {
    const payload = {
        sub: patientId,
        name: `${name} ${lastname}`,
    }

    const secret = env.JWT_SECRET;
    const expiresIn: StringValue | undefined = env.JWT_EXPIRES_IN as StringValue | undefined;

    const options: jwt.SignOptions = {};
    if (expiresIn !== undefined) {
        options.expiresIn = expiresIn;
    }

    return jwt.sign(payload, secret, options);
}