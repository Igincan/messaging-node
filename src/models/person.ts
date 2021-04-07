import { DefaultBody } from "node-server";

export interface Person extends DefaultBody {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
}
