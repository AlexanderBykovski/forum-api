import "dotenv/config";
import { Algorithm, hash, verify } from "@node-rs/argon2";

const pepperHex = process.env["PASSWORD_PEPPER"];
if (!pepperHex) throw new Error("PASSWORD_PEPPER is not defined");
const pepper = Buffer.from(pepperHex, "hex");

export function hashPassword(password: string): Promise<string> {
    return hash(password, {
        algorithm: Algorithm.Argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
        secret: pepper,
    });
}

export function verifyPassword(hash: string, password: string): Promise<boolean> {
    return verify(hash, password, { secret: pepper });
}
