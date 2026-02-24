import type { Address } from "./address";

export interface Customer {
    id: string;
    companyName: string;
    address: Address;
    fullAddress: string;
    latitude: number;
    longitude: number;
}